import { authenticateTokens, setNewToken, validatePassword, encryptPassword } from './auth.mjs';
import { stat, readFile } from "node:fs/promises";
import { join } from "pathe";
import { deleteCookie, getCookie, sendRedirect, setCookie, readBody, serveStatic, setResponseStatus } from "h3";
const cookies = ['username', 'access_token', 'refresh_token', 'user_type'];//TODO separate
import { BOURGEOISIE, PROLETARIAT, REVIEWS } from "./models.mjs";

export async function login(event, userType) {
	const { username, password } = await parseBody(event);
	try {
		if (isLoggedIn(event)) {
			throw new Error('already logged in')
		}
		await validatePassword(username, password, getModel(userType));
		setCookie(event, 'username', username, { httpOnly: false, sameSite: 'strict' });
		setCookie(event, 'user_type', userType, { httpOnly: false, sameSite: 'strict' });
		await setNewToken(event, false, username, userType);
		await setNewToken(event, true,  username, userType);
		sendRedirect(event, userType === 'company' ? '/bour/home' : '/');
	} catch (err) {
		logout(event);
		setResponseStatus(event, 400);
		return err;
	}
}
export function handleStatic(event) {
	return serveStatic(event, {
		getContents: async id => {
			return await readFile(join(publicDir, id))
		},
		getMeta: async id => {
			const stats = await stat(join(publicDir, id)).catch(() => {});
			if (!stats || !stats.isFile()) {
				return;
			}
			const extension = id.split('.').pop();
			return {
				type: extension === 'js' ? 'text/javascript' : extension === 'css' ? 'text/css' : 'text/html',
				size: stats.size,
				mtime: stats.mtimeMs
			};
		}
	});
}
export function isLoggedIn(event) {
	for (let cookie of cookies) {
		if (getCookie(event, cookie)) {
			return true
		}
	}
	return false
}
export function logout(event) {
	for (let cookie of cookies) {
		deleteCookie(event, cookie);
	}
}
export async function parseBody(event) {
	return JSON.parse(await readBody(event));
}
export function getModel(userType) {
	if (userType === 'company') {
		return BOURGEOISIE;
	} else if (userType === 'regular') {
		return PROLETARIAT;
	} else {
		throw new Error('wrong user type');
	}
}
export async function updatePersonal(event, expectedUserType) {
	if (!isLoggedIn(event) || !(await authenticateTokens(event, 'regular'))) {
		await sendRedirect(event, '/notfound');
	}
	const username = getCookie(event, 'username');
	const userType = getCookie(event, 'user_type');
	if (expectedUserType !== userType) {
		setResponseStatus(event, 400);
		return 'wrong user type';
	}
	let model;
	try {
		model = getModel(userType);
	} catch(err) {
		setResponseStatus(event, 400);
		return err;
	}
	const data = await parseBody(event);
	const user = await model.findOne({ where: { login: username } });
	if (!user) {
		setResponseStatus(event, 404);
		return 'no such user';
	}
	try {
		if (userType === 'company') {
			user.name = data.name;
			user.description = data.description;
		} else {
			user.name = data.name;
			user.education_json = data.education_json;
			user.experience_json = data.experience_json;
		}
		await user.save();
	} catch (err) {
		setResponseStatus(event, 500);
		return err;
	}
}
export async function register(event, userType) {
	try {
		const { username, password } = await parseBody(event);
		if (userType === 'company') {
			await BOURGEOISIE.create({
				login: username,
				password_hash: encryptPassword(password),
				name: 'Default company name',
				approved: false,
				description: undefined
			});
		} else if (userType === 'regular') {
			await PROLETARIAT.create({
				login: username,
				password_hash: encryptPassword(password),
				name: 'Ivan Ivanov'
			});
		} else {
			setResponseStatus(event, 400);
			return 'no such user type';
		}
	} catch (err) {
		setResponseStatus(event, 500);
		return err;
	}
	return 'registered';
}
export async function changePassword(event, userType) {
	if (!isLoggedIn(event) || !(await authenticateTokens(event, 'regular'))) {
		setResponseStatus(event, 404);
		return 'not logged in';
	}
	const { oldPassword, newPassword } = await parseBody(event);
	const username = getCookie(event, 'username');
	let existingUser;
	try {
		const model = getModel(userType);
		existingUser = await model.findOne({ where: {
			login: username,
			password_hash: encryptPassword(oldPassword)
		}});
	} catch (err) {
		setResponseStatus(event, 400);
		return err;
	}
	if (!existingUser) {
		setResponseStatus(event, 404);
		return 'no such user';
	}
	existingUser.password_hash = encryptPassword(newPassword);
	existingUser.save();
	return 'password changed';
}
export async function sendMail(to, content) {

}
export async function createReview(event, fromModel, toModel) {
	try {
		const { fromId, toId, text, rating } = parseBody(event);
		const from = { model: fromModel, id: fromId };
		const to = { model: toModel, id: toId };
		if ((await from.model.findAndCountAll({where: {id: from.id}})).count === 0 || 
			(await to.model.findAndCountAll({where: {id : to.id}})).count === 0) {
			throw new Error('invalid id');
		}
		REVIEWS.create({
			p_subject: from.model === PROLETARIAT ? from.id : undefined,
			p_object: to.model === PROLETARIAT ? to.id : undefined,
			b_subject: from.model === BOURGEOISIE ? from.id : undefined,
			b_object: to.model === BOURGEOISIE ? to.id : undefined,
			text,
			rating
		});
	} catch (err) {
		setResponseStatus(event, 400);
		return err;
	}
}