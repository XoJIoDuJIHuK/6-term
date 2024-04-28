import { createServer } from "node:http";
import { appendHeaders, createApp, defineEventHandler, setResponseHeader, toNodeListener, getCookie, setResponseStatus, defineWebSocketHandler } from "h3";
export const app = createApp({debug: true});
import { masterRouter } from './routers/master.mjs';
import { ClientError, handleStatic, getModel, vacancyEmitter } from "./utilFunctions.mjs";
import fs from 'fs';
import { authorizeTokens, isAdmin } from "./auth.mjs";
import wsAdapter from "crossws/adapters/node";

app.use(defineEventHandler(event => {
    appendHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': '*'
    })
}));
app.use(defineEventHandler(async event => {
    async function checkAuthorization(userType) {
        const model = getModel(userType);
        if (!(await model.findByPk(getCookie(event, 'user_id')) ||
            getCookie(event, 'user_type') !== userType)) {
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
                    protectedEndpoints = ['personal', 'password', 'responses', 'vacancy', 'review', 
                        'promotion-request', 'applicants-list', 'icon'];
                    expectedType = 'company';
                    break;
                default:
                    protectedEndpoints = ['promotion-requests', 'drop-requests', 'promote', 'personal', 
                        'password', 'review', 'drop-user', 'ban', 'reported-reviews'];
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
const server = createServer(toNodeListener(app));
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
server.on('upgrade', handleUpgrade)
server.listen(process.env.PORT || 3000);