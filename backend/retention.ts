import { lt } from 'drizzle-orm';
import { connectDatabase } from './database';
import { toolUsage, userFeedback } from './schema';

async function main() {
  if (process.env.ALLOW_RETENTION_DELETE !== 'true') throw new Error('Retention deletion must be explicitly enabled.');
  const { db, pool } = connectDatabase();
  try {
    await db.transaction(async tx => {
      await tx.delete(toolUsage).where(lt(toolUsage.createdAt, new Date(Date.now() - 30 * 86400000)));
      await tx.delete(userFeedback).where(lt(userFeedback.createdAt, new Date(Date.now() - 180 * 86400000)));
    });
    console.log('Retention cleanup complete.');
  } finally { await pool.end(); }
}
main().catch(() => { console.error('Retention cleanup failed or was not authorized.'); process.exitCode = 1; });
