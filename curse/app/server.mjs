import { createServer } from "node:http";
import { getHeaders, appendHeaders, createApp, defineEventHandler, setResponseHeader, toNodeListener, getCookie, setResponseStatus } from "h3";
export const app = createApp({debug: true});
import { masterRouter } from './routers/master.mjs';
import { ClientError, handleStatic, getModel } from "./utilFunctions.mjs";
import fs from 'fs';
import { authorizeTokens, isAdmin } from "./auth.mjs";

app.use(defineEventHandler(event => {
    appendHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': '*'
    })
}))
app.use(defineEventHandler(async event => {
    async function checkAuthorization(userType) {
        const model = getModel(userType);
        if (!(await model.findOne({ where: { login: getCookie(event, 'username') } })) ||
            getCookie(event, 'user_type') !== userType) {
            throw new ClientError('Не авторизован', 401);
        }
        await authorizeTokens(event, userType);
    }
    async function checkAuthentication(userType) {
        if (userType === 'admin' && !isAdmin(event)) {
            throw new ClientError('Недостаточно прав', 403);
        }
    }
    const path = event.path.split('?')[0].split('/').slice(1);
    try {
        if (['prol', 'bour', 'admin'].indexOf(path[0]) !== -1 ) {
            let protectedEndpoints;
            let expectedType;
            switch (path[0]) {
                case 'prol':
                    protectedEndpoints = ['personal', 'review', 'cv', 'password', 'responses'];
                    expectedType = 'regular';
                    break;
                case 'bour':
                    protectedEndpoints = ['personal', 'password', 'responses', 'vacancy', 'review', 'promotion-request', 'applicants-list'];
                    expectedType = 'company';
                    break;
                default:
                    protectedEndpoints = ['promotion-requests', 'drop-requests', 'promote', 'personal', 'password', 'review', 'drop-user', 'ban'];
                    expectedType = 'admin';
                    break;
            }
            if (protectedEndpoints.indexOf(path[1]) !== -1) {
                await checkAuthorization(expectedType);
                await checkAuthentication(expectedType);
            }
        }
    } catch (err) {
        setResponseStatus(event, err.code ?? 400);
        return err;
    }
}));
app.use(masterRouter);
app.use(defineEventHandler(handleStatic));
app.use(defineEventHandler(async event => {
    setResponseHeader(event, 'Content-Type', 'text/html');
    return fs.readFileSync('./views/react-front/dist/index.html');
}));

// createServer(toNodeListener(app)).listen(process.env.PORT || 5173);
createServer(toNodeListener(app)).listen(process.env.PORT || 3000);