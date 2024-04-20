import { setNewToken, validatePassword, encryptPassword } from './auth.mjs';
import { stat, readFile } from "node:fs/promises";
import { join } from "pathe";
import fs from 'fs';
import { deleteCookie, getCookie, sendRedirect, setCookie, readBody, serveStatic, setResponseStatus, send } from "h3";
const cookies = ['username', 'access_token', 'refresh_token', 'user_type'];//TODO separate
import { BOURGEOISIE, PROLETARIAT, REVIEWS, TOKENS } from "./models.mjs";
import { createClient } from 'redis';

const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

const publicDir ='D:/6-term/curse/app/views/react-front/dist'

export async function login(event, userType) {
	try {
		const { username, password } = await readBody(event);
		if (isLoggedIn(event)) {
			throw new ClientError('Вход в учётную запись уже произведён', 400);
		}
		const fullUserName = await validatePassword(username, password, getModel(userType));
		setCookie(event, 'username', username, { sameSite: 'strict' });
		if (userType ==='regular' && (await PROLETARIAT.findOne({ where: { login: username } })).is_admin) {
			userType = 'admin';
		}
		setCookie(event, 'user_type', userType, { sameSite: 'strict' });
		await setNewToken(event, false, username, userType);
		await setNewToken(event, true,  username, userType);
		return { message: 'Вход успешен', name: fullUserName };
	} catch (err) {
		await logout(event);
		setResponseStatus(event, 400);
		return err;
	}
}
export function handleStatic(event) {
	const regex = /.(css|js)$/;
	if (!regex.test(event.path)) return;
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
export async function logout(event) {
	const username = getCookie(event, 'username');
	const userType = getCookie(event, 'user_type');
	if (username && userType) {
		const user = await getModel(userType).findOne({ where: { login: username} });
		if (user) {
			const searchCondition = {};
			if (userType === 'company') {
				searchCondition.owner_b = user.id;
			} else {
				searchCondition.owner_p = user.id;
			}
			await TOKENS.destroy({ where: searchCondition });
		}
	}
	for (let cookie of cookies) {
		deleteCookie(event, cookie);
	}
}
export function getModel(userType) {
	if (userType === 'company') {
		return BOURGEOISIE;
	} else if (userType === 'regular' || userType === 'admin') {
		return PROLETARIAT;
	} else {
		throw new Error('wrong user type');
	}
}
export async function updatePersonal(event, expectedUserType) {
	try {
		const username = getCookie(event, 'username');
		const userType = getCookie(event, 'user_type');
		if (expectedUserType !== userType) {
			throw new ClientError('Инвалид тип пользователя', 400);
		}
		const model = getModel(userType);
		const data = await readBody(event);
		const user = await model.findOne({ where: { login: username } });
		if (userType === 'company') {
			user.name = data.name;
			user.description = data.description;
		} else {
			user.name = data.name;
			user.education_json = data.education;
			user.experience_json = data.experience;
		}
		await user.save();
		return { message: 'Данные обновлены' };
	} catch (err) {
		setResponseStatus(event, err.code ?? 400);
		return err;
	}
}
export async function register(event, userType) {
	try {
		const { username, password } = await readBody(event);
		if (userType === 'company') {
			//TODO: throw custom error
			await BOURGEOISIE.create({
				login: username,
				password_hash: encryptPassword(password),
				name: 'Default company name',
				approved: false,
				description: undefined
			});
		} else {
			await PROLETARIAT.create({
				login: username,
				password_hash: encryptPassword(password),
				name: 'Ivan Ivanov',
				is_admin: false,
				education_json: [],
				experience_json: []
			});
		}
		return { message: 'Регистрация успешна. Теперь войди нормально' };
	} catch (err) {
		setResponseStatus(event, err.code ?? 400);
		return err;
	}
}
export async function changePassword(event, userType) {
	try {
		const { oldPassword, newPassword } = await readBody(event);
		const username = getCookie(event, 'username');
		const model = getModel(userType);
		const existingUser = await model.findOne({ where: {
			login: username,
			password_hash: encryptPassword(oldPassword)
		}});
		if (!existingUser) {
			throw new ClientError('Неправильный логин или пароль');
		}
		existingUser.password_hash = encryptPassword(newPassword);
		existingUser.save();
		return { message: 'Пароль изменён' };
	} catch (err) {
		setResponseStatus(event, err.code ?? 400);
		return err;
	}
}
export async function sendMail(to, content) {

}
export async function createReview(event, fromModel, toModel) {
	try {
		const fromId = (await fromModel.findOne({ where: { login: getCookie(event, 'username') } })).id;
		const { toId, text, rating } = await readBody(event);
		const from = { model: fromModel, id: fromId };
		const to = { model: toModel, id: toId };
		const fromResult = await from.model.findAndCountAll({where: {id: from.id}});
		if (fromResult.count === 0 || 
			fromResult.rows[0].id !== (await from.model.findOne({ where: { login: getCookie(event, 'username') } })).id ||
			(await to.model.findAndCountAll({where: {id : to.id}})).count === 0) {
			throw new ClientError('Invalid ID', 400);
		}
		const searchCondition = {}
		if (from.model === PROLETARIAT) {
			searchCondition.p_subject = from.id;
			searchCondition.b_object = to.id;
		} else {
			searchCondition.b_subject = from.id;
			searchCondition.p_object = to.id;
		}
		if (await REVIEWS.findOne({ where: searchCondition })) {
			throw new ClientError('Отзыв уже оставлен', 400);
		}
		return await REVIEWS.create({
			...searchCondition,
			text,
			rating
		});
	} catch (err) {
		setResponseStatus(event, err.code ?? 400);
		return err;
	}
}

export class ClientError {
	isError = true;
	message;
	code;
	constructor(message = 'Not found', code = 404) {
		this.message = message;
		this.code = code;
	}
};

export function log(message) {
	fs.writeFileSync('log.log', message + '\n');
}

export async function addReportId(id) {
	await client.connect();
	await client.set(id);
	await client.quit();
}
export async function deleteReportId(id) {
	await client.del(id);
}