import { defineConfig } from 'drizzle-kit';
export default defineConfig({ schema: './backend/schema.ts', out: './backend/migrations', dialect: 'postgresql' });
