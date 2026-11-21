import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { count, desc, gte, sql } from 'drizzle-orm';
import { toolUsage, userFeedback } from './schema';
import type { Usage, Feedback } from './validation';

export interface Store {
  health(): Promise<void>;
  usage(event: Usage): Promise<void>;
  feedback(feedback: Feedback): Promise<void>;
  popular(): Promise<{ toolId: string; count: number }[]>;
}
export function connectDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5,
    connectionTimeoutMillis: 3000, idleTimeoutMillis: 30000, statement_timeout: 5000 });
  // Never log driver errors: they can contain connection information or SQL values.
  pool.on('error', () => console.error('Database connection interrupted.'));
  const db = drizzle(pool);
  const store: Store = {
    async health() { await db.execute(sql`select 1`); },
    async usage(event) { await db.insert(toolUsage).values(event); },
    async feedback(feedback) { await db.insert(userFeedback).values(feedback); },
    async popular() {
      return db.select({ toolId: toolUsage.toolId, count: count() }).from(toolUsage)
        .where(gte(toolUsage.createdAt, new Date(Date.now() - 30 * 86400000)))
        .groupBy(toolUsage.toolId).having(sql`count(*) >= 5`)
        .orderBy(desc(count()), toolUsage.toolId).limit(10);
    },
  };
  return { pool, db, store };
}
