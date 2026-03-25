import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || 'file:sqlite.db';
const isFileDb = databaseUrl.startsWith('file:') || !databaseUrl.includes('://');

export default isFileDb
  ? defineConfig({
      schema: './src/db/schema.ts',
      out: './drizzle',
      dialect: 'sqlite',
      dbCredentials: {
        url: databaseUrl.replace(/^file:/, ''),
      },
    })
  : defineConfig({
      schema: './src/db/schema.ts',
      out: './drizzle',
      dialect: 'turso',
      dbCredentials: {
        url: databaseUrl,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      },
    });
