import { createServer } from "node:http";
import { getHeaders, appendHeaders, createApp, defineEventHandler, setResponseHeader, toNodeListener, getCookie } from "h3";
export const app = createApp({debug: true});
import { masterRouter } from './routers/master.mjs';
import { ClientError, handleStatic } from "./utilFunctions.mjs";
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
        if (userType === 'admin' && !isAdmin(event) || !await authorizeTokens(event, userType)) {
            throw new ClientError('Not authorized', 401);
        }
    }
    const path = event.path.split('/').slice(1);
    try {
        if (['prol', 'bour', 'admin'].indexOf(path[0]) !== -1 ) {
            let protectedEndpoints;
            let expectedType;
            switch (path[0]) {
                case 'prol':
                    protectedEndpoints = ['personal', 'reviews', 'cv', 'password', 'responses'];
                    expectedType = 'regular';
                    break;
                case 'bour':
                    protectedEndpoints = ['personal', 'password', 'responses', 'vacancy', 'review', 'promotion-request'];
                    expectedType = 'company';
                    break;
                default:
                    protectedEndpoints = ['promotion_requests', 'drop_requests', 'promote', 'personal', 'password', 'vacancy', 'review', 'user'];
                    expectedType = 'admin';
                    break;
            }
            if (protectedEndpoints.indexOf(path[1]) !== -1) {
                await checkAuthorization(expectedType);
                if (getCookie(event, 'user_type') !== expectedType) throw new ClientError('Not authenticated', 403);
            }
        }
    } catch (err) {
        console.log(err)
        return err;
    }
}))
app.use(masterRouter);
app.use(defineEventHandler(handleStatic));
app.use(defineEventHandler(async event => {
    setResponseHeader(event, 'Content-Type', 'text/html');
    return fs.readFileSync('./views/react-front/dist/index.html');
}));

createServer(toNodeListener(app)).listen(process.env.PORT || 3000);