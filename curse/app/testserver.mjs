import { createApp, defineEventHandler, defineWebSocketHandler, toNodeListener } from "h3";
import { createServer } from "node:http";

export const app = createApp();

app.use(
  defineEventHandler(() =>
    fetch(
      "https://raw.githubusercontent.com/unjs/crossws/main/examples/h3/public/index.html",
    ).then((r) => r.text()),
  ),
);

app.use(
  "/_ws",
  defineWebSocketHandler({
    open(peer) {
      console.log("[ws] open", peer);
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
  }),
);

// createServer(toNodeListener(app)).listen(process.env.PORT || 3000);