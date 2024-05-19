import { createServer } from "node:https";
import { appendHeaders, createApp, defineEventHandler, setResponseHeader, toNodeListener, getCookie, 
    setResponseStatus } from "h3";
import { masterRouter } from './routers/master.mjs';
import { ClientError, handleStatic, getModel, vacancyEmitter } from "./utilFunctions.mjs";
import fs from 'fs';
import { authorizeTokens, isAdmin, refreshSecret, accessSecret } from "./auth.mjs";
import wsAdapter from "crossws/adapters/node";
import jwt from 'jsonwebtoken';

export const app = createApp({debug: true});
app.use(defineEventHandler(event => {
    appendHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*'
    })
}));
app.use(defineEventHandler(async event => {
    async function checkAuthorization(userType) {
        const decodedToken = jwt.verify(getCookie(event, 'refresh_token'), refreshSecret);
        const userId = decodedToken.id;
        const model = getModel(userType);
        if (!(await model.findByPk(userId)) || decodedToken.userType !== userType) {
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
        const prolEndpoints = ['personal', 'review', 'cv', 'password', 'responses', 'drop-request'];
        const bourEndpoints = ['personal', 'password', 'responses', 'vacancy', 'review', 'promotion-request', 
            'applicants-list', 'icon', 'drop-request'];
        const adminEndpoints = ['promotion-requests', 'drop-requests', 'promote', 'password', 'review', 'drop-user', 
            'ban', 'reported-reviews'];
        if (['prol', 'bour', 'admin'].indexOf(path[0]) !== -1 ) {
            let protectedEndpoints;
            let expectedType;
            switch (path[0]) {
                case 'prol':
                    protectedEndpoints = prolEndpoints;
                    expectedType = 'regular';
                    break;
                case 'bour':
                    protectedEndpoints = bourEndpoints;
                    expectedType = 'company';
                    break;
                default:
                    protectedEndpoints = adminEndpoints;
                    expectedType = 'admin';
                    break;
            }
            const access_token = getCookie(event, 'access_token')
            if (expectedType === 'regular' && access_token &&
                jwt.verify(access_token, accessSecret).userType === 'admin' && 
                adminEndpoints.indexOf(path[1]) === -1) {
                throw new ClientError('Админу сюда нельзя', 403);
            }
            if (protectedEndpoints.indexOf(path[1]) !== -1) {
                await checkAuthorization(expectedType);
                await checkAuthentication(expectedType);
            }
        }
    } catch (err) {
        setResponseStatus(event, err.code ?? 400);
        return new ClientError(err.message, err.code ?? 400);
    }
}));
app.use(masterRouter);
app.use(defineEventHandler(handleStatic));
app.use(defineEventHandler(async event => {
    setResponseHeader(event, 'Content-Type', 'text/html');
    return fs.readFileSync('./views/react-front/dist/index.html');
}));

const nodeApp = toNodeListener(app);
const credentials = {
    key: fs.readFileSync('../server.key'),
    cert: fs.readFileSync('../server.crt')
}

const httpsServer = createServer(credentials, nodeApp);
const { handleUpgrade } = wsAdapter({
    hooks: {
      async open(peer) {
        console.log("[ws] open", peer);
        vacancyEmitter.on('changed', vacancy => { peer.send(vacancy); console.log('sending') });
      },
  
      message(peer, message) {
        console.log("[ws] message", peer, message);
        if (message.text().includes("ping")) {
          peer.send("pong");
        }
      },
  
      close(peer, event) {
        console.log("[ws] close", peer, event);
      },
  
      error(peer, error) {
        console.log("[ws] error", peer, error);
      },
    },
  });

httpsServer.on('upgrade', handleUpgrade)
httpsServer.listen(4433);
