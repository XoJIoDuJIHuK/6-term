import { createRouter, defineEventHandler, getQuery, getCookie, useBase, setResponseHeaders, setResponseStatus } from "h3";
import { ClientError, logout } from '../utilFunctions.mjs';
import { adminRouter } from './admin.mjs';
import { proletariatRouter } from './proletariat.mjs';
import { bourgeoisieRouter } from './bourgeoisie.mjs';
import { BOURGEOISIE, REVIEWS, VACANCIES, GetRating, PROLETARIAT } from "../models.mjs";
import { Op } from "sequelize";
const filterOptions = ['min_salary', 'max_salary', 'region', 'schedule', 'experience', 'min_hours_per_day', 'max_hours_per_day'];

const masterRouter = createRouter()
	.get('/public-vacancies', defineEventHandler(async event => {
		const query = getQuery(event);
		const where = {};
		for (let option of filterOptions) {//unexpected query parameters protection
			if (query[option]) {
				where[option] = query[option] === 'null' ? undefined : query[option];
			}
		}
		if (query.text) {
			where[Op.or] = [
				{name: {[Op.iLike]: `%${query.text}%`}}, 
				{description: {[Op.iLike]: `%${query.text}%`}}
			]
		}
		try {
            const id = query.id;
			if (id === undefined) {
				const totalElements = (await VACANCIES.findAndCountAll({ where: { ...where, active: 'N' } })).count;
				const data = await VACANCIES.findAll({
					offset: Number.isFinite(+query.offset) ? +query.offset : 0,
					limit: 20,
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
			setResponseStatus(404);
			return err;
		}
	}))
	.get('/public-companies', defineEventHandler(async event => {
		const query = getQuery(event);
		const totalElements = (await BOURGEOISIE.findAndCountAll()).count;
		const companies = (await BOURGEOISIE.findAll({ attributes: ['id', 'name'] })).map(c => c.dataValues);
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
			const company = await BOURGEOISIE.findOne({ 
				where: { id: query.id }, attributes: ['id', 'name'] 
			});
			if (!company) {
				throw new ClientError();
			}
			const totalElements = (await REVIEWS.findAndCountAll({ where: { b_object: company.id } })).count;
			const reviews = (await REVIEWS.findAll({ 
				where: { b_object: company.id }, attributes: ['id', 'text', 'rating', 'p_subject']
			})).map(r => r.dataValues);
			for (let review of reviews) {
				review.author = (await PROLETARIAT.findByPk(review.p_subject)).name;
			}

			let usersReviewId;
			let reviewAllowed = false;
			const userType = getCookie(event, 'user_type');
			if (userType === 'regular') {
				const usersReview = await REVIEWS.findOne({ where: { p_subject: +getCookie(event, 'user_id'), b_object: company.id } });
				if (usersReview) usersReviewId = usersReview.id;
				else reviewAllowed = true;
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
			return err;
		}
	}))
	.put('/report-review', defineEventHandler(async event => {
		try {
			const { id } = getQuery(event);
			const review = await REVIEWS.findByPk(id);
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
	}));

masterRouter.use('/admin/**',  useBase('/admin/', adminRouter.handler));
masterRouter.use('/prol/**', useBase('/prol/', proletariatRouter.handler));
masterRouter.use('/bour/**', useBase('/bour/', bourgeoisieRouter.handler));

export { masterRouter };