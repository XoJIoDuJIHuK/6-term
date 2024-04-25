import { setNewToken, validatePassword, encryptPassword } from './auth.mjs';
import { stat, readFile } from "node:fs/promises";
import { join } from "pathe";
import fs from 'fs';
import { deleteCookie, getCookie, setCookie, readBody, serveStatic, setResponseStatus, getQuery } from "h3";
const cookies = ['user_id', 'access_token', 'refresh_token', 'user_type'];//TODO separate
import { BOURGEOISIE, PROLETARIAT, RESPONSES, REVIEWS, TOKENS, VACANCIES, CVS, BLACK_LIST } from "./models.mjs";
import EventEmitter from 'node:events';

export const publicDir ='D:/6-term/curse/app/views/react-front/dist'

export async function login(event, userType) {
	try {
		const { username, password } = await readBody(event);
		if (isLoggedIn(event)) {
			throw new ClientError('Вход в учётную запись уже произведён', 401);
		}
		const { name, id, is_admin } = await validatePassword(username, password, getModel(userType));
		setCookie(event, 'user_id', id, { sameSite: 'strict' });
		if (userType ==='regular' && is_admin) {
			userType = 'admin';
		}
		setCookie(event, 'user_type', userType, { sameSite: 'strict' });
		await setNewToken(event, false, id, userType);
		await setNewToken(event, true,  id, userType);
		return { message: 'Вход успешен', name };
	} catch (err) {
		await logout(event);
		setResponseStatus(event, 400);
		return err;
	}
}
export function handleStatic(event) {
	const regex = /.(css|js|jpg)$/;
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
				type: extension === 'js' ? 'text/javascript' 
					: extension === 'css' ? 'text/css' 
					: extension === 'html' ? 'text/html'
					: 'image/jpeg',
				size: stats.size,
				mtime: stats.mtimeMs
			};
		}
	});
}
export function isLoggedIn(event) {
	for (let cookie of cookies) {
		if (getCookie(event, cookie)) {
			return true;
		}
	}
	return false
}
export async function logout(event) {
	const id = getCookie(event, 'user_id');
	const userType = getCookie(event, 'user_type');
	if (id && userType) {
		const user = await getModel(userType).findByPk(id);
		if (user) {
			const searchCondition = {};
			if (userType === 'company') {
				searchCondition.owner_b = id;
			} else {
				searchCondition.owner_p = id;
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
		throw new ClientError('Инвалид тип пользователя', 400);
	}
}
export async function updatePersonal(event, expectedUserType) {
	try {
		console.log('НЕГРЫ ВСЕ ПИДОРАСЫ');
		const id = getCookie(event, 'user_id');
		const userType = getCookie(event, 'user_type');
		if (expectedUserType !== userType) {
			throw new ClientError('Инвалид тип пользователя', 400);
		}
		const model = getModel(userType);
		const data = await readBody(event);
		const user = await model.findByPk(id);
		if (emailIsValid(user.email) && !emailIsValid(data.email)) {
			throw new ClientError('Нельзя менять правильное мыло на неправильное', 400);
		}
		user.name = data.name;
		user.email = data.email;
		if (userType === 'company') {
			user.description = data.description;
		} else {
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
		const { model, data } = userType === 'company' ? { model: BOURGEOISIE, data: {
			login: username,
			password_hash: encryptPassword(password),
			name: 'Default company name',
			approved: false,
			description: undefined
		} } : { model: PROLETARIAT, data: {
			login: username,
			password_hash: encryptPassword(password),
			name: 'Ivan Ivanov',
			is_admin: false,
			education_json: [],
			experience_json: []
		} };
		if (await model.findOne({ where: { login: data.login } })) {
			throw new ClientError('Логин занят', 400);
		}
		await model.create(data);
		return { message: 'Регистрация успешна. Теперь войди нормально' };
	} catch (err) {
		setResponseStatus(event, err.code ?? 400);
		return err;
	}
}
export async function changePassword(event, userType) {
	try {
		const { oldPassword, newPassword } = await readBody(event);
		const id = getCookie(event, 'user_id');
		const model = getModel(userType);
		const existingUser = await model.findByPk(id);
		if (!existingUser || existingUser.password_hash !== encryptPassword(oldPassword)) {
			throw new ClientError('Неправильный пароль', 400);
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
		const fromId = +getCookie(event, 'user_id');
		const { toId, text, rating } = await readBody(event);
		const from = { model: fromModel, id: fromId };
		const to = { model: toModel, id: toId };

		if (!await RESPONSES.findOne({ include: [ {
			model: CVS,
			include: {
				model: PROLETARIAT,
				where: { id: fromModel === PROLETARIAT ? from.id : to.id }
			}
		}, {
			model: VACANCIES,
			include: {
				model: BOURGEOISIE,
				where: { id: fromModel === PROLETARIAT ? to.id : from.id }
			}
		}], where: { status: 'Y' } })) {
			throw new ClientError(fromModel === PROLETARIAT ? 'Оставлять отзывы можно только на приютившие вас компании' :
			'Оставлять отзывы можно только на соискателей, которых вы пригласили', 400);
		}

		const searchCondition = {}
		if (from.model === PROLETARIAT) {
			searchCondition.p_subject = from.id;
			searchCondition.b_object = to.id;
		} else {
			searchCondition.b_subject = from.id;
			searchCondition.p_object = to.id;
		}

		if (await BLACK_LIST.findOne({ where: searchCondition })) {
			throw new ClientError('Вы не можете оставлять отзывы на данного пользователя', 400)
		}

		if (await REVIEWS.findOne({ where: searchCondition })) {
			throw new ClientError('Отзыв уже оставлен', 400);
		}
		await REVIEWS.create({
			...searchCondition,
			text,
			rating
		});
		return { message: 'Отзыв оставлен' };
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

export function emailIsValid(email) {
	const emailRegex = /^[a-z0-9]+(\.[a-z0-9]+)*@[a-z]{2,64}\.[a-z]{2,64}$/;
	return email && emailRegex.test(email.toLowerCase());
}

export function getSelectLimit(event) {
	const query = getQuery(event);
	const offset = query ? query.offset : 0
	return { limit: 20, offset: offset ?? 0 };
}

class VacancyEmitter extends EventEmitter {};
export const vacancyEmitter = new VacancyEmitter();
export async function notifyAboutChanges(vacancy) {
	vacancyEmitter.emit('changed', vacancy);
}
vacancyEmitter.on('changed', vacancy => { console.log('vacancy changed to ', vacancy) });