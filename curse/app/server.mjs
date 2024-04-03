import { createServer } from "node:http";
import { createApp, toNodeListener } from "h3";
export const app = createApp({debug: true});
import { masterRouter } from './routers/master.mjs';

app.use(masterRouter);

createServer(toNodeListener(app)).listen(process.env.PORT || 3000);