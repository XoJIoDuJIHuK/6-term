import jwt from 'jsonwebtoken';
import { TOKENS, PROLETARIAT, BOURGEOISIE } from "./models.mjs";
import fs from 'fs';
import { setCookie, getCookie } from 'h3';
import * as bcrypt from 'bcrypt';
import { ClientError, log } from './utilFunctions.mjs';
export const { salt, refreshSecret, accessSecret } = JSON.parse(fs.readFileSync('./serverConfig.json'));

export async function setNewToken(event, isAccess, id, userType) {
	async function upsertToken(isAccess, id, expiresDate) {
		const tokenType = isAccess ? 'A' : 'R';
		const owner_p = (userType === 'regular' || userType === 'admin') ? id : null;
		const owner_b = userType === 'company' ? id : null;
		const where = {
			// type: tokenType,
			owner_p,
			owner_b
		}
		const data = {
			// type: tokenType,
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
	const seconds = isAccess ? 
		(10 * 60) 
		// (10)
		: 
		(24 * 60 * 60);
	const token = jwt.sign({
		id,
		userType,
		// exp: Math.floor(Date.now() / 1e3) + seconds
		maxAge: seconds 
	}, secret);
	const expiresDate = new Date(
		// (new Date()).getTime() + 
		seconds);
	if (!isAccess) await upsertToken(isAccess, id, expiresDate);
	setCookie(event, cookieName, token, { 
		httpOnly: false, 
		sameSite: 'strict', 
		maxAge: expiresDate
	});
	return token;
}

export async function validateRefreshToken(refreshToken, searchConditions) {
	const decodedToken = jwt.verify(refreshToken, refreshSecret);
	const existingToken = (await TOKENS.findOne({ where: { ...searchConditions, 
		// type: 'R'
	} }));
	if (!existingToken || refreshToken !== existingToken.value) {
		throw new ClientError('Неверный токен', 401);
	}
}

export async function authorizeTokens(event, expectedUserType) {
	async function validateAccessToken() {
		try {
			const decodedToken = jwt.verify(accessToken, accessSecret);
			if (decodedToken.id !== +getCookie(event, 'user_id')) {
				throw new ClientError('Логины не сходятся', 403);
			}
		} catch (err) {
			if (err.name === 'TokenExpiredError' || err.message === 'jwt must be provided') {
				// await setNewToken(event, true, id, userType);
				// await setNewToken(event, false, id, userType);
				throw new ClientError('Access token invalid', 403);
			} else {
				throw err;
			}
		}
	}
	const refreshToken = getCookie(event, 'refresh_token') ?? '';
	const accessToken = getCookie(event, 'access_token') ?? '';
	const decodedToken = jwt.verify(accessToken, accessSecret);
	const { userType, id } = decodedToken;
	if (expectedUserType !== userType) {
		return false;
	}
	const searchConditions = {};
	if (userType === 'company') {
		searchConditions.owner_b = id;
	} else {
		searchConditions.owner_p = id;
	}
	await validateAccessToken();
	// if (refreshToken) {
	// 	await validateRefreshToken();
		
	// } else {
	// 	return false;
	// }
	return true;
}

export async function validatePassword(username, password, model) {
	const matchingRows = await model.findAndCountAll({ where: { login: username } });
	const user = matchingRows.rows[0];
	if (matchingRows.count === 0 || !(await bcrypt.compare(password, user.password_hash))) {
		throw new ClientError('Wrong credentials', 400);
	}
	return user;
}
export function encryptPassword(password) {
	return bcrypt.hashSync(password, salt);
}

export async function isAdmin(event) {
	try {
		const id = jwt.verify(+getCookie(event, 'access_token'), accessSecret);
		const user = await PROLETARIAT.findByPk(id);
		return user.is_admin;
	} catch (err) {
		log('isAdmin (auth.mjs) error: ' + JSON.stringify(err));
		return false;
	}
}