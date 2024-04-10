import { createRouter, defineEventHandler, getQuery, getCookie, setHeader, useBase } from "h3";
import { logout } from '../utilFunctions.mjs';
import ejs from 'ejs';
import fs from 'fs';

import { adminRouter } from './admin.mjs';
import { proletariatRouter } from './proletariat.mjs';
import { bourgeoisieRouter } from './bourgeoisie.mjs';
import { VACANCIES } from "../models.mjs";
const filterOptions = ['min_salary', 'max_salary', 'region', 'schedule', 'experience', 'min_hours_per_day', 'max_hours_per_day', 'offset'];

const masterRouter = createRouter()
	.get('/public-vacancies', defineEventHandler(async event => {
		const query = getQuery(event);
		const where = {};
		for (let option of filterOptions) {//unexpected query parameters protection
			if (query[option]) {
				where[option] = query[option] === 'null' ? null : query[option];
			}
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
	.get('/logout', defineEventHandler(async event => {
		logout(event);
		return {};
	}))
	.get('/notfound', defineEventHandler(async event => {
		setHeader(event, 'Content-Type', 'text/html');
		return await ejs.renderFile('./views/404.html');
	}));

masterRouter.use('/admin/**',  useBase('/admin/', adminRouter.handler));
masterRouter.use('/prol/**', useBase('/prol/', proletariatRouter.handler));
masterRouter.use('/bour/**', useBase('/bour/', bourgeoisieRouter.handler));

export { masterRouter };