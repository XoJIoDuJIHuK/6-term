import jwt from 'jsonwebtoken';
import { TOKENS, PROLETARIAT, BOURGEOISIE } from "./models.mjs";
import fs from 'fs';
import { setCookie, getCookie } from 'h3';
import * as bcrypt from 'bcrypt';
import { ClientError } from './utilFunctions.mjs';
const { salt, refreshSecret, accessSecret } = JSON.parse(fs.readFileSync('./serverConfig.json'));

export async function setNewToken(event, isAccess, username, userType) {
	async function upsertToken(isAccess, username, expiresDate) {
		const tokenType = isAccess ? 'A' : 'R';
		const owner_p = userType === 'regular' ? 
			(await PROLETARIAT.findOne({where: {login: username}})).id : null;
		const owner_b = userType === 'company' ? 
			(await BOURGEOISIE.findOne({where: {login: username}})).id : null;
		const where = {
			type: tokenType,
			owner_p,
			owner_b
		}
		const data = {
			type: tokenType,
			owner_p,
			owner_b,
			value: token,
			expires: expiresDate
		}
		const tokenExists = (await TOKENS.findAndCountAll({ where })).count > 0;
		if (tokenExists) {
			await TOKENS.update(data, { where })
		} else {
			await TOKENS.create(data);
		}
	}

	const secret = isAccess ? accessSecret : refreshSecret;
	const cookieName = isAccess ? 'access_token' : 'refresh_token';
	const seconds = isAccess ? (10 * 60) : (24 * 60 * 60);
	const token = jwt.sign({
		username,
		userType,
		exp: Math.floor(Date.now() / 1e3) + seconds
	}, secret);
	const expiresDate = new Date((new Date()).getTime() + seconds * 1e3);
	await upsertToken(isAccess, username, expiresDate);
	setCookie(event, cookieName, token, { 
		httpOnly: true, 
		sameSite: 'strict', 
		expires: expiresDate
	});
	return token
}
export async function authorizeTokens(event, expectedUserType) {
	async function validateRefreshToken() {
		const decodedToken = jwt.verify(refreshToken, refreshSecret);
		const existingToken = (await TOKENS.findOne({ where: { ...searchConditions, type: 'R' }})).value;
		if (decodedToken.username !== username || refreshToken !== existingToken) {
			throw new ClientError('refresh token invalid', 403);
		}
	}
	async function validateAccessToken() {
		try {
			const decodedToken = jwt.verify(accessToken, accessSecret);
			if (decodedToken.username !== username) {
				throw new ClientError('usernames don\'t match', 403);
			}
		} catch (err) {
			if (err.name === 'TokenExpiredError' || err.message === 'jwt must be provided') {
				await setNewToken(event, true, username, userType);
				await setNewToken(event, false, username, userType);
			} else {
				throw err;
			}
		}
	}
	const userType = getCookie(event, 'user_type');
	if (expectedUserType !== userType) {
		return false;
	}
	const refreshToken = getCookie(event, 'refresh_token') ?? '';
	const accessToken = getCookie(event, 'access_token') ?? '';
	const username = getCookie(event, 'username');
	const searchConditions = {};
	if (userType === 'company') {
		searchConditions.owner_b = (await BOURGEOISIE.findOne({ where: { login: username }})).dataValues.id;
	} else {
		searchConditions.owner_p = (await PROLETARIAT.findOne({ where: { login: username } })).dataValues.id;
	}
	if (refreshToken) {
		try {
			await validateRefreshToken();
			await validateAccessToken();
		} catch (err) {
			return false;
		}
	} else {
		return false;
	}
	return true;
}

export async function validatePassword(username, password, model) {
	const matchingRows = await model.findAndCountAll({
		where: {
			login: username
		}
	});
	const user = matchingRows.rows[0];
	if (matchingRows.count === 0 || !(await bcrypt.compare(password, user.password_hash))) {
		throw new Error('wrong credentials');
	}
	return user.login;
}
export function encryptPassword(password) {
	return bcrypt.hashSync(password, salt);
}

export async function isAdmin(event) {
	const username = getCookie(event, 'username');
	return (await PROLETARIAT.findAndCountAll({ where: { name: username, isAdmin: true } })).count === 1;
}