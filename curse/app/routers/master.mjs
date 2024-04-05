import { createRouter, defineEventHandler, getQuery, sendRedirect, setHeader, useBase } from "h3";
import { logout } from '../utilFunctions.mjs';
import ejs from 'ejs';

import { adminRouter } from './admin.mjs';
import { proletariatRouter } from './proletariat.mjs';
import { bourgeoisieRouter } from './bourgeoisie.mjs';
import { VACANCIES } from "../models.mjs";
const filterOptions = ['min_salary', 'max_salary', 'region', 'schedule', 'experience', 'min_hours_per_day', 'max_hours_per_day'];

const masterRouter = createRouter()
	.get('/', defineEventHandler(async event => {
		return 'Hello!';
	}))
	.get('/vacancies', defineEventHandler(async event => {
		const query = getQuery(event);
		const where = {};
		for (let option of filterOptions) {
			if (query[option]) {
				where[option] = query[option];//unexpected query parameters protection
			}
		}
		return await VACANCIES.findAll({
			offset: query.offset ?? 0,
			limit: 20,
			where
		});
	}))
	.get('/login', defineEventHandler(async event => {
		logout(event);
		setHeader(event, 'Content-Type', 'text/html');
		return await ejs.renderFile('./views/login.html');
	}))
	.get('/register', defineEventHandler(event => {
		logout(event);
		setHeader(event, 'Content-Type', 'text/html');
		return ejs.renderFile('./views/register.html')
	}))
	.get('/notfound', defineEventHandler(async event => {
		setHeader(event, 'Content-Type', 'text/html');
		return await ejs.renderFile('./views/404.html');
	}))
	.get('/**', defineEventHandler(async event => {
		await sendRedirect(event, '/notfound');
	}));

masterRouter.use('/admin/**',  useBase('/admin/', adminRouter.handler));
masterRouter.use('/prol/**', useBase('/prol/', proletariatRouter.handler));
masterRouter.use('/bour/**', useBase('/bour/', bourgeoisieRouter.handler));

export { masterRouter };