import { setNewToken, validatePassword, encryptPassword, accessSecret, refreshSecret } from './auth.mjs';
import { stat, readFile } from "node:fs/promises";
import { join } from "pathe";
import fs from 'fs';
import { deleteCookie, getCookie, setCookie, readBody, serveStatic, setResponseStatus, getQuery } from "h3";
const cookies = ['user_id', 'access_token', 'refresh_token', 'user_type'];
import { BOURGEOISIE, PROLETARIAT, RESPONSES, REVIEWS, TOKENS, VACANCIES, CVS, BLACK_LIST } from "./models.mjs";
import EventEmitter from 'node:events';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import jwt from 'jsonwebtoken';

export const publicDir ='D:/6-term/curse/app/views/react-front/dist'
const config = JSON.parse(fs.readFileSync('./serverConfig.json'));

export async function login(event, userType) {
	try {
		const { username, password } = await readCredentials(event);
		if (isLoggedIn(event)) {
			throw new ClientError('Вход в учётную запись уже произведён', 401);
		}
		const { name, id, is_admin } = await validatePassword(username, password, getModel(userType));
		setCookie(event, 'user_id', id, { sameSite: 'strict' });
		if (userType ==='regular' && is_admin) {
			userType = 'admin';
		}
		setCookie(event, 'user_type', userType, { sameSite: 'strict' });
		const accessToken = await setNewToken(event, true,  id, userType);
		console.log(accessToken);
		const refreshToken = await setNewToken(event, false, id, userType);
		console.log(refreshToken);
		return { message: 'Вход успешен', name };
	} catch (err) {
		await logout(event);
		setResponseStatus(event, 400);
		delete err.statusCode;
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
	const id = +getCookie(event, 'user_id');
	const userType = +getCookie(event, 'user_type');
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
		const { id, userType } = jwt.verify(getCookie(event, 'access_token'), accessSecret);
		if (expectedUserType !== userType) {
			throw new ClientError('Инвалид тип пользователя', 400);
		}
		const model = getModel(userType);
		const data = await readBody(event);
		if (userType === 'regular') {
			for (let key of ['experience', 'education']) {
				for (let value of data[key]) {
					const since = value.period[0];
					const to = value.period[1];
					if (since !== null && to !== null && Date(since) >= Date(to)) {
						throw new ClientError('Даты не угу', 400);
					}
				}
			}
		}
		const user = await model.findByPk(id);
		if (!emailIsValid(data.email)) {
			throw new ClientError('Мыло неправильное', 400);
		}
		const nameChanged = user.name !== data.name;
		user.name = data.name;
		if (data.name > 70) throw new ClientError('Слишком длинное имя', 400);
		user.email = data.email;
		if (userType === 'company') {
			user.description = data.description;
		} else {
			user.education_json = data.education;
			user.experience_json = data.experience;
		}
		await user.save();
		return { message: 'Данные обновлены' + nameChanged ? '\nДля обновления имени перезайдите в учётную запись' : '', userName: user.name };
	} catch (err) {
		setResponseStatus(event, err.code ?? 400);
		return err;
	}
}
export async function register(event, userType) {
	try {
		const { username, password } = await readCredentials(event);
		if (!password.length) {
			throw new ClientError('Введите нормальный пароль', 400);
		}
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
		let oldPassword, newPassword;
		try {
			({ oldPassword, newPassword } = await readBody(event));
		} catch (err) {
			throw new ClientError('Неверное значение одного из паролей')
		}
		if (!oldPassword.length || !newPassword.length) {
			throw new ClientError('Один из паролей пустой', 400);
		}
		if (oldPassword === newPassword) {
			throw new ClientError('Новые пароль не может равняться старому', 400);
		}
		const id = jwt.verify(getCookie(event, 'access_token'), accessSecret).id;
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
export function sendMail(to, subject, text) {
	let options = {
        service: 'mail.ru',
        auth: {
            user: config.mailUsername,
            pass: config.mailPassword
        }
    }
    nodemailer.createTransport(smtpTransport(options)).sendMail({
        from: config.mailUsername, to, subject, text
    }, function(error){
        if (error) {
            log('email sending error: ' + JSON.stringify(error));
        }
    });
}
export async function createReview(event, fromModel, toModel) {
	try {
		const fromId = +getCookie(event, 'user_id');
		let toId, text, rating;
		try {
			({ toId, text, rating } = await readBody(event));
		} catch (err) {
			throw new ClientError('Чего-то не хватает')
		}
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
	return email && email.length <= 30 && emailRegex.test(email.toLowerCase());
}

export function getSelectLimit(event) {
	return { limit: 20, offset: getOffset(event) ?? 0 };
}
export function getOffset(event) {
	const query = getQuery(event);
	const offset = query ? Number.isNaN(+query.offset) ? 0 : +query.offset : 0;
	return offset;
}

class VacancyEmitter extends EventEmitter {};
export const vacancyEmitter = new VacancyEmitter();
export async function notifyAboutChanges(vacancy) {
	vacancyEmitter.emit('changed', vacancy);
}
vacancyEmitter.on('changed', vacancy => { console.log('vacancy changed to ', vacancy) });

async function readCredentials(event) {
	const body = await readBody(event);
	if (!body) throw new ClientError('Нет тела - нет логина', 400);
	const username = body.username;
	if (!username) throw new ClientError('Нет логина', 400);
	const password = body.password;
	if (username !== username + '' || password !== password + '') {
		throw new ClientError('Логин и пароль должны быть строками', 400);
	}
	if (username.length > 20) {
		throw new ClientError('Превышена длина логина', 400);
	}
	return { username, password };
}