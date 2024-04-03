import { createRouter, defineEventHandler, sendRedirect, setHeader, useBase } from "h3";
import { logout } from '../utilFunctions.mjs';
import ejs from 'ejs';

import { adminRouter } from './admin.mjs';
import { proletariatRouter } from './proletariat.mjs';
import { bourgeoisieRouter } from './bourgeoisie.mjs';

const masterRouter = createRouter()
	.get('/', defineEventHandler(async event => {
		return 'Hello!';
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