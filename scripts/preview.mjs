import { createServer } from 'node:http';
import worker from '../dist/server/index.js';
let state = null;
const DB = { prepare(sql) { return { bind(...args) { return {
  async first() { return state; },
  async run() {
    if (sql.startsWith('INSERT') && !state) {
      state = { revision: args[1], payload: args[2] };
    } else if (sql.startsWith('UPDATE') && state?.revision === args[3]) {
      state = { revision: args[0], payload: args[1] };
    } else return { meta: { changes: 0 } };
    return { meta: { changes: 1 } };
  }
}; } }; } };
const server = createServer(async (req, res) => {
  const headers = new Headers(req.headers);
  headers.set('oai-authenticated-user-id', 'local-preview');
  const body = [];
  for await (const chunk of req) body.push(chunk);
  const response = await worker.fetch(new Request('http://' + req.headers.host + req.url, {
    method: req.method, headers, body: body.length ? Buffer.concat(body) : undefined
  }), { DB });
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
});
const portIndex = process.argv.indexOf('--port');
server.listen(Number(process.env.PORT || (portIndex >= 0 ? process.argv[portIndex + 1] : 3000)), '0.0.0.0');
