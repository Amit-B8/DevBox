import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import type { Store } from './database';
import { validateFeedback, validateUsage } from './validation';

export type ApiConfig = { origins: string[]; localWrites: boolean; publicWrites: boolean; proxySecret: string; usageEnabled: boolean; feedbackEnabled: boolean };
class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}
async function readJson(req: IncomingMessage) {
  if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') throw new HttpError(415, 'Use application/json.');
  const maxBytes = 12288;
  if (Number(req.headers['content-length']) > maxBytes) throw new HttpError(413, 'Payload too large.');
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new HttpError(413, 'Payload too large.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown; }
  catch { throw new HttpError(400, 'Invalid JSON.'); }
}
function trustedProxy(req: IncomingMessage, secret: string) {
  const header = req.headers['x-devbox-proxy-secret'];
  if (secret.length < 32 || typeof header !== 'string') return false;
  const a = Buffer.from(header), b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function createApi(store: Store, config: ApiConfig) {
  // Best-effort per-process defense only. Public writes ALSO require an enforcing gateway.
  const buckets = new Map<string, { count: number; until: number }>();
  let globalWindow = { count: 0, until: 0 };
  let cache: { expires: number; data: Awaited<ReturnType<Store['popular']>> } | undefined;
  let popularRequest: ReturnType<Store['popular']> | undefined;
  function rateLimit(req: IncomingMessage, path: string) {
    const now = Date.now();
    if (globalWindow.until <= now) globalWindow = { count: 0, until: now + 60000 };
    if (++globalWindow.count > 600) throw new HttpError(429, 'Too many requests. Try again later.');
    for (const [key, value] of buckets) if (value.until <= now) buckets.delete(key);
    const key = `${req.socket.remoteAddress}:${path}`; // Never trust client-supplied forwarding headers.
    if (!buckets.has(key)) {
      if (buckets.size >= 10000) throw new HttpError(429, 'Too many requests. Try again later.');
      buckets.set(key, { count: 0, until: now + 60000 });
    }
    const bucket = buckets.get(key)!;
    if (++bucket.count > (path === '/api/feedback' ? 5 : 60)) throw new HttpError(429, 'Too many requests. Try again later.');
  }
  return createServer({ requestTimeout: 10000, headersTimeout: 10000, maxHeaderSize: 8192 }, async (req, res) => {
    res.setHeader('Vary', 'Origin');
    try {
      const path = (req.url ?? '/').split('?')[0];
      const origin = req.headers.origin;
      if (origin && !config.origins.includes(origin)) throw new HttpError(403, 'Origin not allowed.');
      if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
      if (req.method === 'OPTIONS') {
        if (!origin) throw new HttpError(403, 'Origin required.');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(204); res.end(); return;
      }
      if (req.method === 'GET' && path === '/api/health/live') { json(res, 200, { application: 'ok' }); return; }
      if (req.method === 'GET' && path === '/api/health') {
        try { await store.health(); json(res, 200, { application: 'ok', database: 'ok' }); }
        catch { json(res, 503, { application: 'ok', database: 'unavailable' }); }
        return;
      }
      rateLimit(req, path);
      if (req.method === 'GET' && path === '/api/popular-tools') {
        if (!cache || cache.expires <= Date.now()) {
          popularRequest ??= store.popular();
          try { cache = { expires: Date.now() + 60000, data: await popularRequest }; }
          finally { popularRequest = undefined; }
        }
        json(res, 200, { tools: cache.data, periodDays: 30 }); return;
      }
      if (path !== '/api/usage' && path !== '/api/feedback') throw new HttpError(404, 'Not found.');
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); throw new HttpError(405, 'Method not allowed.'); }
      if (!origin) throw new HttpError(403, 'Origin required.');
      if (!(config.localWrites || (config.publicWrites && trustedProxy(req, config.proxySecret)))) throw new HttpError(503, 'Submissions are not enabled.');
      if (path === '/api/usage' ? !config.usageEnabled : !config.feedbackEnabled) throw new HttpError(503, 'Submissions are not enabled.');
      const body = await readJson(req);
      if (path === '/api/usage') {
        let value;
        try { value = validateUsage(body); } catch (error) { throw new HttpError(400, (error as Error).message); }
        await store.usage(value);
      } else {
        let value;
        try { value = validateFeedback(body); } catch (error) { throw new HttpError(400, (error as Error).message); }
        await store.feedback(value);
      }
      json(res, 201, { ok: true });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 503;
      if (status === 429) res.setHeader('Retry-After', '60');
      if (!res.destroyed) json(res, status, { error: error instanceof HttpError ? error.message : 'Service temporarily unavailable. Please try again later.' });
    }
  });
}
