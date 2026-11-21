import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createApi, type ApiConfig } from './server';
import type { Store } from './database';
import { validateFeedback, validateUsage } from './validation';

const origin = 'http://localhost:3000';
const config: ApiConfig = { origins: [origin], localWrites: true, publicWrites: false, proxySecret: '', usageEnabled: true, feedbackEnabled: true };
async function withApi(run: (base: string, records: unknown[]) => Promise<void>, overrides: Partial<ApiConfig> = {}, failDatabase = false) {
  const records: unknown[] = [];
  const store: Store = {
    async health() { if (failDatabase) throw new Error('secret connection information'); },
    async usage(event) { if (failDatabase) throw new Error('secret SQL'); records.push(event); },
    async feedback(value) { records.push(value); },
    async popular() { return [{ toolId: 'pdf-combiner', count: 6 }]; },
  };
  const server = createApi(store, { ...config, ...overrides });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`, records); }
  finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
}
const post = (base: string, path: string, body: unknown, headers: Record<string, string> = {}) => fetch(base + path, {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
});

test('usage rejects unknown IDs/actions, extra tool input, and malformed objects', () => {
  for (const value of [null, [], { toolId: 'missing', action: 'convert' },
    { toolId: 'pdf-combiner', action: 'upload' }, { toolId: 'pdf-combiner', action: 'convert', filename: 'private.pdf' }]) {
    assert.throws(() => validateUsage(value));
  }
  assert.deepEqual(validateUsage({ toolId: 'pdf-combiner', action: 'convert' }), { toolId: 'pdf-combiner', action: 'convert' });
});
test('feedback validates category, length, optional registry ID, and extra fields', () => {
  for (const value of [{ category: 'other', message: 'A useful message' },
    { category: 'suggestion', message: ' '.repeat(20) }, { category: 'bug_report', message: 'x'.repeat(2001) },
    { category: 'general_feedback', message: 'A useful message', toolId: 'missing' },
    { category: 'suggestion', message: 'A useful message', email: 'extra' }]) assert.throws(() => validateFeedback(value));
  assert.equal(validateFeedback({ category: 'suggestion', message: '  A useful message  ' }).message, 'A useful message');
});
test('enabled local requests store only validated records', async () => {
  await withApi(async (base, records) => {
    assert.equal((await post(base, '/api/usage', { toolId: 'pdf-combiner', action: 'convert' })).status, 201);
    assert.equal((await post(base, '/api/feedback', { category: 'bug_report', message: 'The button is hard to read.' })).status, 201);
    assert.equal(records.length, 2);
    assert.deepEqual(records[0], { toolId: 'pdf-combiner', action: 'convert' });
  });
});
test('writes stay disabled without explicit gates and trusted production gateway', async () => {
  const secret = 'a'.repeat(32);
  await withApi(async base => {
    assert.equal((await post(base, '/api/usage', { toolId: 'pdf-combiner', action: 'convert' })).status, 503);
  }, { localWrites: false });
  await withApi(async base => {
    const body = { toolId: 'pdf-combiner', action: 'convert' };
    assert.equal((await post(base, '/api/usage', body)).status, 503);
    assert.equal((await post(base, '/api/usage', body, { 'X-DevBox-Proxy-Secret': 'wrong' })).status, 503);
    assert.equal((await post(base, '/api/usage', body, { 'X-DevBox-Proxy-Secret': secret })).status, 201);
  }, { localWrites: false, publicWrites: true, proxySecret: secret });
  await withApi(async base => {
    assert.equal((await post(base, '/api/usage', { toolId: 'pdf-combiner', action: 'convert' })).status, 503);
  }, { usageEnabled: false });
});
test('CORS, payload limits, JSON parsing, and feedback rate limits are enforced', async () => {
  await withApi(async base => {
    assert.equal((await post(base, '/api/usage', {}, { Origin: 'https://untrusted.example' })).status, 403);
    assert.equal((await post(base, '/api/usage', {}, { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await post(base, '/api/usage', { text: 'x'.repeat(13000) })).status, 413);
    assert.equal((await fetch(base + '/api/usage', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    for (let i = 0; i < 5; i++) assert.equal((await post(base, '/api/feedback', { category: 'suggestion', message: 'Make labels easier to read.' })).status, 201);
    assert.equal((await post(base, '/api/feedback', { category: 'suggestion', message: 'Make labels easier to read.' })).status, 429);
  });
});
test('health and public aggregates expose no individual records or driver errors', async () => {
  await withApi(async base => {
    assert.equal((await fetch(base + '/api/health/live')).status, 200);
    assert.equal((await fetch(base + '/api/health')).status, 200);
    assert.deepEqual(await (await fetch(base + '/api/popular-tools')).json(), { tools: [{ toolId: 'pdf-combiner', count: 6 }], periodDays: 30 });
  });
  await withApi(async base => {
    assert.equal((await fetch(base + '/api/health')).status, 503);
    const response = await post(base, '/api/usage', { toolId: 'pdf-combiner', action: 'convert' });
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /secret|SQL/);
  }, {}, true);
});
