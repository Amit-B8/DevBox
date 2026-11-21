import { connectDatabase } from './database';
import { createApi } from './server';

const { pool, store } = connectDatabase();
const server = createApi(store, {
  origins: (process.env.ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean),
  localWrites: process.env.NODE_ENV === 'development' && process.env.ENABLE_LOCAL_WRITES === 'true',
  publicWrites: process.env.ENABLE_PUBLIC_WRITES === 'true',
  proxySecret: process.env.WRITE_PROXY_SECRET ?? '',
  usageEnabled: process.env.ENABLE_USAGE === 'true',
  feedbackEnabled: process.env.ENABLE_FEEDBACK === 'true',
});
server.listen(Number(process.env.PORT ?? 3001), process.env.HOST ?? '127.0.0.1', () => console.log('DevBox API listening.'));
for (const signal of ['SIGTERM', 'SIGINT'] as const) process.on(signal, () => {
  server.close(() => { void pool.end().then(() => process.exit(0)); });
  setTimeout(() => process.exit(1), 10000).unref();
});
