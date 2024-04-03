import jwt from 'jsonwebtoken';
import { TOKENS, PROLETARIAT, BOURGEOISIE } from "./models.mjs";
import fs from 'fs';
import { setCookie, getCookie } from 'h3';
import * as bcrypt from 'bcrypt';
const { salt, refreshSecret, accessSecret } = JSON.parse(fs.readFileSync('./serverConfig.json'));
class NotAuthorizedError extends Error {};

export async function setNewToken(event, isAccess, username, userType) {
	async function upsertToken(isAccess, username, expiresDate) {
		const tokenType = isAccess ? 'A' : 'R';
		const owner_p = userType === 'regular' ? 
			(await PROLETARIAT.findOne({where: {name: username}})).dataValues.id : null;
		const owner_b = userType === 'company' ? 
			(await BOURGEOISIE.findOne({where: {name: username}})).dataValues.id : null;
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
export async function authenticateTokens(event, expectedUserType) {
	async function validateRefreshToken() {
		jwt.verify(refreshToken, refreshSecret);
		if (refreshToken !== (await TOKENS.findOne({
			where: Object.assign(searchConditions, {type: 'R'})
		})).value) {
			throw new NotAuthorizedError('refresh token is not in white list');
		}
	}
	async function validateAccessToken() {
		jwt.verify(accessToken, accessSecret, async (err) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					await setNewToken(event, true, username, userType)
				} else {
					throw err
				}
			} else {
				if (accessToken !== (await TOKENS.findOne({
					where: Object.assign(searchConditions, {type: 'A'})
				})).value) {
					throw new NotAuthorizedError('access token is not in white list')
				}
			}
		})
	}
	const userType = getCookie(event, 'user_type');
	if (expectedUserType !== userType) {
		return false;
	}
	const refreshToken = getCookie(event, 'refresh_token');
	const accessToken = getCookie(event, 'access_token');
	const username = getCookie(event, 'username');
	const searchConditions = {};
	if (userType === 'company') {
		searchConditions.owner_b = (await BOURGEOISIE.findOne({
			where: {
				name: username
			}
		})).dataValues.id;
	} else {
		searchConditions.owner_p = (await PROLETARIAT.findOne({
			where: {
				name: username
			}
		})).dataValues.id;
	}
	if (refreshToken && accessToken) {
		try {
			await validateAccessToken();
			await validateRefreshToken();
		} catch (err) {
			return false;
		}
	} else {
		return false;
	}
	return true;
}

export async function validatePassword(username, password, model) {
	const user = (await model.findOne({
		where: {
			name: username
		},
		rejectOnEmpty: true
	})).dataValues;
	if (!user || !(await bcrypt.compare(password, user.password_hash))) {
		throw new Error('wrong credentials');
	}
}
export function encryptPassword(password) {
	return bcrypt.hashSync(password, salt);
}

export async function isAdmin(event) {
	const username = getCookie(event, 'username');
	return (await PROLETARIAT.findAndCountAll({ where: { name: username, isAdmin: true } })).count === 1;
}