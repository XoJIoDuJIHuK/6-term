import { createRouter, defineEventHandler, sendRedirect, setResponseStatus, getQuery } from "h3";
import { isAdmin } from '../auth.mjs';
import { getModel, sendMail } from '../utilFunctions.mjs';
import ejs from 'ejs';
import { BOURGEOISIE, PROLETARIAT, PROMOTION_REQUESTS, ACCOUNT_DROP_REQUESTS, TOKENS } from "../models.mjs";

export const adminRouter = createRouter()
	.get('/personal', defineEventHandler(async event => {
		return { message: 'nothing to see here' };
	}))
	.get('/promotion-requests', defineEventHandler(async event => {
		try {
			const requests = (await PROMOTION_REQUESTS.findAll({ include: {
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
			const requests = await ACCOUNT_DROP_REQUESTS.findAll();
			return requests;
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
		const query = getQuery(event);
		const id = +query.requestId;
		try {
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
	.delete('review', defineEventHandler(async event => {
		
	}));