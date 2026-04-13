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
  const secret = process.env.AUTH_SECRET;
  if (!secret && isProduction) {
    console.warn('AUTH_SECRET is not set. Authentication features will be disabled.');
    return 'unset-production-secret-auth-disabled';
  }
  return secret || 'default-dev-secret-do-not-use-in-prod';
}

export function getAuthPassword(): string {
  const password = process.env.AUTH_PASSWORD;
  if (!password && isProduction) {
    console.warn('AUTH_PASSWORD is not set. Login will be impossible.');
    return 'unset-production-password-auth-disabled';
  }
  return password || 'admin';
}

export function isFileDatabaseUrl(url: string): boolean {
  return url.startsWith('file:');
}
