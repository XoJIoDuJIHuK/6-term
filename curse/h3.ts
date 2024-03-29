import { createApp, toWebhandler } from "https://esm.sh/h3";

export const app = createApp();

export const handler = toWebHandler(app);