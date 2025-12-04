/* eslint-disable @typescript-eslint/no-var-requires */
import { createServer } from "http";
import next from "next";

const port = Number(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    if (!req.url) return;

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const { pathname, searchParams } = parsedUrl;

    handle(req, res, { pathname, query: Object.fromEntries(searchParams) });
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
