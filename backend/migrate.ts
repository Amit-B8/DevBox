import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { connectDatabase } from './database';

async function main() {
  if (process.env.ALLOW_DATABASE_MIGRATIONS !== 'true') throw new Error('Set ALLOW_DATABASE_MIGRATIONS=true only after reviewing the target DATABASE_URL.');
  const { db, pool } = connectDatabase();
  try {
    await migrate(db, { migrationsFolder: './backend/migrations' });
    console.log('Migrations complete.');
  } finally { await pool.end(); }
}
main().catch(() => { console.error('Migration failed. Check configuration and database availability; no connection details are logged.'); process.exitCode = 1; });
