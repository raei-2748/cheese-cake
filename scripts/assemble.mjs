import { readFile, writeFile } from 'node:fs/promises';
const assets = {};
for (const [path, file, type] of [
  ['/', 'index.html', 'text/html'], ['/app.js', 'app.js', 'text/javascript'],
  ['/data.js', 'data.js', 'text/javascript'], ['/parse.js', 'parse.js', 'text/javascript'], ['/style.css', 'style.css', 'text/css']
]) {
  assets[path] = { body: await readFile('ui/' + file, 'utf8'), type: type + '; charset=utf-8' };
}
const worker = await readFile('worker/index.js', 'utf8');
await writeFile('dist/server/index.js', worker.replace('__SITE_ASSETS__', () => JSON.stringify(assets)));
