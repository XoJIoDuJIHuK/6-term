import { createServer } from "node:http";
import { createApp, createRouter, defineEventHandler, deleteCookie, toNodeListener, send, getCookie, sendRedirect, setCookie, readBody, setHeader, 
	useBase, serveStatic } from "h3";
export const app = createApp({debug: true});
import { authenticateTokens, setNewToken, validatePassword } from './jwt.mjs';
import fs from 'fs';
import { stat, readFile } from "node:fs/promises";
import { join } from "pathe";
import { BOURGEOISIE, PROLETARIAT } from "./models.mjs";
const cookies = ['username', 'access_token', 'refresh_token', 'user_type'];
const publicDir = 'vue-front/dist';

const apiRouter = createRouter();
const masterRouter = createRouter()
	.get('/', defineEventHandler(async event => {
		return 'Hello!';
	}))
	// .get('/**', defineEventHandler(event => {
	// 	return event.path;
	// }))
	.post('/', defineEventHandler(event => {
		return event.path;
	}))
	.get('/logout', defineEventHandler(async event => {
		for (let cookie of cookies) {
			deleteCookie(event, cookie);
		}
		sendRedirect(event, '/');
		return 'why not redirected?';
	}));

const bourgeoisieRouter = createRouter()
	.get('/', defineEventHandler(async event => {
		authenticateTokens(event, 'company');
		return 'bour';
	}));

const proletariatRouter = createRouter()
	.get('/', defineEventHandler(event => {
		if (!authenticateTokens(event, 'regular')) {
			sendRedirect(event, '/logout');
		}
		return 'prol_base_slash';
	}))
	.get('/home', defineEventHandler(async event => {
		if (!authenticateTokens(event, 'regular')) {
			sendRedirect(event, '/logout');
		}
		return 'prol_base';
	}))
	.post('/**', defineEventHandler(event => {
		return event.context.params._;
	}))
	.get('/login', defineEventHandler(event => {
		setHeader(event, 'Content-Type', 'text/html');
		return fs.readFileSync('./views/prol.login.html');
	}))
	.post('/login', defineEventHandler(async event => {
		await login(event, 'regular');
		sendRedirect(event, '/prol/home');
		return 'why not redirected?';
	}));

app.use(defineEventHandler(handleStatic));
masterRouter.use('/api/**',  useBase('/api', apiRouter.handler));
masterRouter.use('/prol/**', useBase('/prol', proletariatRouter.handler));
masterRouter.use('/bour/**', useBase('/bour', bourgeoisieRouter.handler));
app.use(masterRouter);


// (async () => {
// 	const stats = await stat(`./vue-front/dist/assets/index-pkPZQdrn.js`).catch(() => {});
// 	console.log(stats);
// })();
createServer(toNodeListener(app)).listen(process.env.PORT || 3000);

async function login(event, userType) {
	const { username, password } = await readBody(event);
	try {
		for (let cookie of cookies) {
			if (getCookie(event, cookie)) {
				throw new Error('already logged in');
			}
		}
		await validatePassword(username, password, userType === 'company' ? BOURGEOISIE : PROLETARIAT);
		setCookie(event, 'username', username, { httpOnly: true, sameSite: 'strict' });
		setCookie(event, 'user_type', userType, { httpOnly: true, sameSite: 'strict' });
		await setNewToken(event, false, username, userType);
		await setNewToken(event, true,  username, userType);
		sendRedirect(event, userType === 'company' ? '/bour/home' : '/prol/home');
	} catch (err) {
		sendRedirect(event, '/logout');
	}
}
function handleStatic(event) {
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
				type: extension === 'js' ? 'text/javascript' : extension === 'css' ? 'text/css' : 'text/html',
				size: stats.size,
				mtime: stats.mtimeMs
			};
		}
	});
}