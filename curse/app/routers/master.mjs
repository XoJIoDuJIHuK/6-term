import { createRouter, defineEventHandler, getQuery, getCookie, useBase, setResponseStatus } from "h3";
import { ClientError, logout, getSelectLimit } from '../utilFunctions.mjs';
import { adminRouter } from './admin.mjs';
import { proletariatRouter } from './proletariat.mjs';
import { bourgeoisieRouter } from './bourgeoisie.mjs';
import { BOURGEOISIE, REVIEWS, VACANCIES, GetRating, PROLETARIAT } from "../models.mjs";
import { Op } from "sequelize";
import { authorizeTokens, setNewToken, validateRefreshToken, refreshSecret, accessSecret } from "../auth.mjs";
import jwt from 'jsonwebtoken';

const filterOptions = ['region', 'schedule', 'experience'];

const masterRouter = createRouter()
	.get('/public-vacancies', defineEventHandler(async event => {
		try {
			const query = getQuery(event);
			const where = {};
			for (let option of filterOptions) {//unexpected query parameters protection
				if (query[option]) {
					where[option] = (query[option] === 'null' || query[option] === 'undefined') ? undefined : query[option];
				}
			}
			if (query.text) {
				where[Op.or] = [
					{name: {[Op.iLike]: `%${query.text}%`}}, 
					{description: {[Op.iLike]: `%${query.text}%`}}
				]
			}
			if (query.min_salary) {
				where.min_salary = { [Op.gte]: query.min_salary };
			}
			if (query.max_salary) {
				where.max_salary = { [Op.lte]: query.max_salary };
			}
			if (query.min_hours_per_day) {
				where.min_hours_per_day = { [Op.gte]: query.min_hours_per_day };
			}
			if (query.max_hours_per_day) {
				where.max_hours_per_day = { [Op.lte]: query.max_hours_per_day };
			}
            const id = query.id;
			if (id === undefined) {
				const totalElements = (await VACANCIES.findAndCountAll({ where: { ...where, active: 'Y' } })).count;
				const data = await VACANCIES.findAll({
					...getSelectLimit(event),
					where: {
						...where,
						active: 'Y'
					}
				});
				return { totalElements, data };
			} else  {
				return await VACANCIES.findOne({ where: { id, active: 'Y' }, rejectOnEmpty: true });
			}
		} catch (err) {
			setResponseStatus(event, err.code ?? 404);
			return new ClientError(err.message, err.code ?? 404);
		}
	}))
	.get('/public-companies', defineEventHandler(async event => {
		const query = getQuery(event);
		const totalElements = (await BOURGEOISIE.findAndCountAll()).count;
		const companies = (await BOURGEOISIE.findAll({ attributes: ['id', 'name'], ...getSelectLimit(event) })).map(e => e.dataValues);
		if (!query.skipRating) {
			for (let company of companies) {
				company.rating = await GetRating('C', company.id);
			}
		}
		return { companies, totalElements };
	}))
	.get('/company-reviews', defineEventHandler(async event => {
		try {
			const query = getQuery(event);
			if (Number.isNaN(+query.id)) throw new ClientError();
			const company = await BOURGEOISIE.findOne({ 
				where: { id: query.id }, attributes: ['id', 'name'] 
			});
			if (!company) {
				throw new ClientError();
			}
			const totalElements = (await REVIEWS.findAndCountAll({ where: { b_object: company.id } })).count;
			const reviews = (await REVIEWS.findAll({ 
				where: { b_object: company.id }, attributes: ['id', 'text', 'rating', 'p_subject'], ...getSelectLimit(event)
			})).map(r => r.dataValues);
			for (let review of reviews) {
				review.author = (await PROLETARIAT.findByPk(review.p_subject)).name;
			}

			let usersReviewId;
			let reviewAllowed = false;
			const access_token = getCookie(event, 'access_token')
			if (access_token) {
				const decodedToken = jwt.verify(access_token, accessSecret);
				if (decodedToken.userType === 'regular') {
					const usersReview = await REVIEWS.findOne({ where: { p_subject: decodedToken.id, 
						b_object: company.id } });
					if (usersReview) usersReviewId = usersReview.id;
					else reviewAllowed = true;
				}
			}

			return { totalElements, data: {
				id: company.id,
				name: company.name,
				myReviewId: usersReviewId,
                reviewAllowed,
				reviews,
				rating: await GetRating('C', company.id)
			}};
		} catch (err) {
			setResponseStatus(event, err.code ?? 404);
			return err;
		}
	}))
	.put('/report-review', defineEventHandler(async event => {
		async function reviewIsAvailable(event, review) {
			const userId = jwt.verify(getCookie(event, 'access_token')).id;
			const userExists = (await BOURGEOISIE.findAndCountAll({ where: { id: userId } })).count;
			return await authorizeTokens(event, 'company') && userId && userExists && userId === review.b_subject;
		}
		try {
			const { id } = getQuery(event);
			if (Number.isNaN(+id)) throw new ClientError();
			const review = await REVIEWS.findByPk(id);
			if (review.b_subject && !reviewIsAvailable(event, review)) {
				throw new ClientError('Откуда ты получил идентификатор этого отзыва?', 403);
			}
			if (!review) {
				throw new ClientError('Отзыв не обнаружен');
			}
			if (review.reported === 'Y') return { message: 'Жалоба уже расматривается' }
			await REVIEWS.update({ reported: 'Y' }, { where: { id } });
			return { message: 'Жалоба отправлена' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.get('/logout', defineEventHandler(async event => {
		await logout(event);
		return { message: 'what kind of message did you expect?' };
	}))
	.get('/refresh', defineEventHandler(async event => {
		const refreshToken = getCookie(event, 'refresh_token');
		const decodedToken = jwt.verify(refreshToken, refreshSecret);
		const userType = decodedToken.userType;
		const id = decodedToken.id;
		const searchConditions = {};
		if (userType === 'company') {
			searchConditions.owner_b = id;
		} else {
			searchConditions.owner_p = id;
		}
		try {
			await validateRefreshToken(refreshToken, searchConditions);
		} catch (err) {
			return new ClientError('Токен инвалид', 401);
		}
		await setNewToken(event, true, id, userType);
		await setNewToken(event, false, id, userType);
		return { message: 'JWT set' };
	}));

masterRouter.use('/admin/**',  useBase('/admin/', adminRouter.handler));
masterRouter.use('/prol/**', useBase('/prol/', proletariatRouter.handler));
masterRouter.use('/bour/**', useBase('/bour/', bourgeoisieRouter.handler));

export { masterRouter };