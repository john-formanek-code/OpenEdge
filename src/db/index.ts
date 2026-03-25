import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { getDatabaseAuthToken, getDatabaseUrl } from '@/lib/env';

const databaseUrl = getDatabaseUrl();
const authToken = getDatabaseAuthToken();

const client = createClient({
  url: databaseUrl,
  authToken,
});

export const db = drizzle(client, { schema });
