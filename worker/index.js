const assets = __SITE_ASSETS__;
const noStore = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (body, status = 200) => Response.json(body, { status, headers: noStore });

async function state(request, db, url) {
  const owner = request.headers.get('oai-authenticated-user-id');
  if (!owner) return json({ error: 'Sign in to open your study records.' }, 401);
  if (!db) return json({ error: 'Study storage is unavailable.' }, 503);
  if (request.method === 'GET') {
    const record = await db.prepare('SELECT revision, payload FROM study_state WHERE owner_id = ?').bind(owner).first();
    return json(record ? { revision: record.revision, data: JSON.parse(record.payload) } : { revision: 0, data: null });
  }
  if (request.method !== 'PUT') return json({ error: 'Method unavailable.' }, 405);
  if (request.headers.get('Origin') !== url.origin) return json({ error: 'Open the Site directly to save.' }, 403);
  const raw = await request.text();
  if (raw.length > 1500000) return json({ error: 'Study records exceed the storage limit.' }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: 'Invalid study record.' }, 400); }
  if (!body || !Number.isSafeInteger(body.revision) || body.revision < 0 || body.data?.version !== 1) {
    return json({ error: 'Invalid study record.' }, 400);
  }
  const payload = JSON.stringify(body.data);
  const next = body.revision + 1;
  const update = body.revision === 0
    ? db.prepare('INSERT INTO study_state (owner_id, revision, payload) VALUES (?, ?, ?) ON CONFLICT(owner_id) DO NOTHING').bind(owner, next, payload)
    : db.prepare('UPDATE study_state SET revision = ?, payload = ? WHERE owner_id = ? AND revision = ?').bind(next, payload, owner, body.revision);
  const result = await update.run();
  return result.meta.changes === 1
    ? json({ revision: next })
    : json({ error: 'This workspace changed in another tab or device. Reload to get the latest records.' }, 409);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/state') {
      try { return await state(request, env.DB, url); }
      catch { return json({ error: 'Study storage could not be reached. Try again.' }, 503); }
    }
    const asset = Object.hasOwn(assets, url.pathname) && assets[url.pathname];
    if (!asset) return new Response('Page unavailable', { status: 404 });
    return new Response(asset.body, { headers: {
      ...noStore,
      'Content-Type': asset.type,
      'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'"
    } });
  }
};
