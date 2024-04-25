import { createRouter, defineEventHandler, setResponseStatus, getQuery } from "h3";
import { ClientError, getSelectLimit, sendMail } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, PROMOTION_REQUESTS, ACCOUNT_DROP_REQUESTS, TOKENS, REVIEWS, BLACK_LIST, sequelize } from "../models.mjs";
import { Op, col } from 'sequelize';

export const adminRouter = createRouter()
	.get('/personal', defineEventHandler(async event => {
		return { message: 'nothing to see here' };
	}))
	.get('/promotion-requests', defineEventHandler(async event => {
		try {
			const totalElements = (await PROMOTION_REQUESTS.findAndCountAll()).count;
			const requests = (await PROMOTION_REQUESTS.findAll({ ...getSelectLimit(event), include: {
				model: BOURGEOISIE,
				attributes: ['name']
			}})).map(r => { return {
				id: r.id,
				company_name: r.BOURGEOISIE.name,
				proof: r.proof
			} });
			return requests;
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.get('/drop-requests', defineEventHandler(async event => {
		try {
			const totalElements = (await ACCOUNT_DROP_REQUESTS.findAndCountAll()).count;
			const requests = await ACCOUNT_DROP_REQUESTS.findAll(getSelectLimit(event));
			return { requests, totalElements };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.patch('/promote', defineEventHandler(async event => {
		try {
			const { requestId } = getQuery(event);
			const request = await PROMOTION_REQUESTS.findByPk(+requestId);
			if (!request) {
				throw new Error('no such request');
			}
			const companyId = request.dataValues.company_id;
			await PROMOTION_REQUESTS.destroy({ where: {id: request.id}});
			await BOURGEOISIE.update({approved: true}, {where: {id: companyId}});
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
		return { message: 'Компания подтверждена' };
	}))
	.delete('/promote', defineEventHandler(async event => {
		try {
			const { requestId } = getQuery(event);
			const request = await PROMOTION_REQUESTS.findByPk(+requestId);
			await PROMOTION_REQUESTS.destroy({ where: {id: request.id}});
			const company = await BOURGEOISIE.findByPk(request.company_id);
			await sendMail(company.email, 'xd');
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
		return { message: 'Запрос на подтверждение отклонён' };
	}))
	.delete('/drop-user', defineEventHandler(async event => {
		try {
			const query = getQuery(event);
			const id = +query.requestId;
			const request = await ACCOUNT_DROP_REQUESTS.findByPk(id);
			const model = request.isCompany === 'Y' ? BOURGEOISIE : PROLETARIAT;
			const userExists = (await model.findAndCountAll({ where: { id: request.account_id } })).count > 0;
			if (!userExists) {
				throw new Error('no such user');
			}
			await TOKENS.destroy({ where: (request.isCompany === 'Y' ? {owner_b:request.account_id} : {owner_p: request.account_id}) });
			await model.destroy({ where: { id: request.account_id } });
			await ACCOUNT_DROP_REQUESTS.destroy({ where: { id: request.id } });
			sendMail(email, 'your drop account request was satisfied');
			return { message: 'Учётная запись успешно удалена' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.post('/drop-user', defineEventHandler(async event => {
		try {
			const requestId = +getQuery(event).requestId;
			const request = await ACCOUNT_DROP_REQUESTS.findByPk(requestId);
			const model = request.isCompany ? BOURGEOISIE : PROLETARIAT;
			const user = model.findByPk(request.account_id);
			await ACCOUNT_DROP_REQUESTS.destroy({ where: { id: requestId } });
			sendMail(user.email, 'your drop account request was refused');
			return { message: 'Запрос на удаление успешно отклонён' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.get('/reported-reviews', defineEventHandler(async event => {
		try {
			const totalElements = (await REVIEWS.findAndCountAll({ where: { reported: 'Y' } })).count;
			const [reviews] = await sequelize.query(`select r.id as id, r.text as text, r.p_subject as p_subject, p.id as prolId, ` +
				`p.name as prolName, b.id as bourId, b.name as bourName  from "REVIEWS" r join "PROLETARIAT" p on r.p_subject = p.id or ` +
				` r.p_object = p.id join "BOURGEOISIE" b on r.b_subject = b.id or r.b_object = b.id where r.reported = 'Y';`);
			return { totalElements, reports: reviews.map(r => { 
				const senderUserType = r.p_subject ? 'regular' : 'company';
				const [senderName, senderId, receiverName, receiverId] = r.p_subject ? 
					[r.prolname, r.prolid, r.bourname, r.bourid] : 
					[r.bourname, r.bourid, r.prolname, r.prolid];
				return {
					id: r.id,
					senderUserType,
					senderId,
					senderName,
					receiverId,
					receiverName
			}})};
		} catch (err) {
			console.log('error', err)
			return err;
		}
	}))
	.post('/review', defineEventHandler(async event => {
		try {
			const { id } = getQuery(event);
			const review = await REVIEWS.findByPk(id);
			if (!review || review.reported === 'N') {
				throw new ClientError('Нет такого отзыва');
			}
			await REVIEWS.update({ reported: 'N' }, { where: { id } });
			return { message: 'Жалоба удалена' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.delete('/review', defineEventHandler(async event => {
		try {
			const { id } = getQuery(event);
			const review = await REVIEWS.findByPk(id);
			if (!review) {
				throw new ClientError('Нет такого отзыва');
			}
			await REVIEWS.destroy({ where: { id } });
			return { message: 'Отзыв удалён' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.get('/ban', defineEventHandler(async event => {
		const totalElements = (await BLACK_LIST.findAndCountAll()).count;
		const query = getQuery(event);
		const [result] = await sequelize.query(`select n.id as id, n.p_subject as p_subject, n.b_subject as b_subject, p.name as prol_name, ` +
			` b.name as bour_name from "BLACK_LIST" n join "PROLETARIAT" p on n.p_subject = p.id or n.p_object = p.id join "BOURGEOISIE" b on ` +
			`n.b_subject = b.id or n.b_object = b.id LIMIT 20 OFFSET ${Number.isFinite(+query.offset) ? +query.offset : 0};`);
		return { list: result, totalElements };
	}))
	.put('/ban', defineEventHandler(async event => {
		try {
			const { senderUserType, senderId, receiverId } = getQuery(event);
			const searchCondition = {}
			if (senderUserType === 'company') {
				searchCondition.b_subject = senderId;
				searchCondition.p_object = receiverId;
			} else {
				searchCondition.p_subject = senderId;
				searchCondition.b_object = receiverId;
			}
			if (await BLACK_LIST.findOne({ where: searchCondition })) {
				return { message: 'Запись в чёрном списке уже существует' };
			}
			await BLACK_LIST.create(searchCondition);
			return { message: 'Запись в чёрный список добавлена' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.delete('/ban', defineEventHandler(async event => {
		try {
			const { id } = getQuery(event);
			if (!await BLACK_LIST.findByPk(id)) {
				throw new ClientError('Записи в чёрном списке не существует');
			}
			await BLACK_LIST.destroy({ where: { id } });
			return { message: 'Запись удалена из чёрного списка' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}));