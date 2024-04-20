import { createRouter, defineEventHandler, getQuery, getCookie, useBase } from "h3";
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
				return await VACANCIES.findAll({
					offset: query.offset ?? 0,
					limit: 20,
					where: {
						...where,
						active: 'Y'
					}
				});
			} else  {
				return await VACANCIES.findOne({ where: { id, active: 'Y' }, rejectOnEmpty: true });
			}
		} catch (err) {
			return err;
		}
	}))
	.get('/public-companies', defineEventHandler(async event => {
		const query = getQuery(event);
		const companies = (await BOURGEOISIE.findAll({ attributes: ['id', 'name'] })).map(c => c.dataValues);
		if (!query.skipRating) {
			for (let company of companies) {
				company.rating = await GetRating('C', company.id);
			}
		}
		return companies;
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
				const user = await PROLETARIAT.findOne({ where: { login: getCookie(event, 'username') } });
				const usersReview = await REVIEWS.findOne({ where: { p_subject: user.id, b_object: company.id } });
				if (usersReview) usersReviewId = usersReview.id;
				else reviewAllowed = true;
			}

			return {
				id: company.id,
				name: company.name,
				myReviewId: usersReviewId,
                reviewAllowed,
				reviews,
				rating: await GetRating('C', company.id)
			};
		} catch (err) {
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