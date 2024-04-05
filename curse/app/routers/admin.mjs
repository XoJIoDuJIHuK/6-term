import { createRouter, defineEventHandler, sendRedirect, setResponseStatus, getQuery } from "h3";
import { authenticateTokens, isAdmin } from '../auth.mjs';
import { getModel, sendMail } from '../utilFunctions.mjs';
import ejs from 'ejs';
import { BOURGEOISIE, PROLETARIAT, PROMOTION_REQUESTS, ACCOUT_DROP_REQUESTS } from "../models.mjs";

export const adminRouter = createRouter()
	.get('/promotion_requests', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'company') || !isAdmin(event)) {
			await sendRedirect(event, '/notfound');
		}
		return await ejs.renderFile('./views/admin/promotion_requests.html');
	}))
	.get('/drop_requests', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'company') || !isAdmin(event)) {
			await sendRedirect(event, '/notfound');
		}
		return await ejs.renderFile('./views/admin/drop_requests.html');
	}))
	.patch('/promote', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'company') || !isAdmin(event)) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const { requestId } = getQuery(event);
			const request = await PROMOTION_REQUESTS.findByPk(requestId);
			if (!request) {
				throw new Error('no such request');
			}
			const companyId = request.dataValues.company_id;
			await BOURGEOISIE.update({approved: true}, {where: {id: companyId}});
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
		return 'approved';
	}))
	.delete('/promote', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'company') || !isAdmin(event)) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const { requestId } = getQuery(event);
			const request = await PROMOTION_REQUESTS.findByPk({where: {id: requestId}});
			await PROMOTION_REQUESTS.destroy({ where: {id: request.id}});
			const company = await BOURGEOISIE.findByPk(request.company_id);
			await sendMail(company.email, 'xd');
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
		return 'successfully refused promotion';
	}))
	.delete('/drop_user', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'company') || !isAdmin(event)) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		const query = getQuery(event);
		const id = +query.id;
		const userType = query.userType;
		try {
			const model = getModel(userType);
			const userExists = (await model.findAndCountAll({where:{id}})).count > 0;
			if (!userExists) {
				throw new Error('no such user');
			}
			await model.destroy({where:{id}});
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
		return 'deleted';
	}))
	.post('/drop_user', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'company') || !isAdmin(event)) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const requestId = +getQuery(event).requestId;
			const request = await ACCOUT_DROP_REQUESTS.findByPk(requestId);
			const model = request.isCompany ? BOURGEOISIE : PROLETARIAT;
			const user = model.findByPk(request.account_id);
			await sendMail(user.email, 'xd');
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}));