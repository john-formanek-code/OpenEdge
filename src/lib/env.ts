const isProduction = process.env.NODE_ENV === 'production';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return 'file:sqlite.db';
}

export function getDatabaseAuthToken(): string | undefined {
  return process.env.DATABASE_AUTH_TOKEN;
}

export function getAuthSecret(): string {
  if (!isProduction) {
    return process.env.AUTH_SECRET || 'default-dev-secret-do-not-use-in-prod';
  }
  return requireEnv('AUTH_SECRET');
}

export function getAuthPassword(): string {
  if (!isProduction) {
    return process.env.AUTH_PASSWORD || 'admin';
  }
  return requireEnv('AUTH_PASSWORD');
}

export function isFileDatabaseUrl(url: string): boolean {
  return url.startsWith('file:');
}
