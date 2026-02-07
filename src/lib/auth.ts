import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.AUTH_SECRET || 'default-dev-secret-do-not-use-in-prod';
const key = new TextEncoder().encode(secretKey);

type SessionPayload = Record<string, unknown>;

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(formData: FormData) {
  const password = formData.get('password');
  const envPassword = process.env.AUTH_PASSWORD || 'admin'; // Default fallback

  if (password === envPassword) {
    const session = await encrypt({ user: 'admin', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    const cookieStore = await cookies();
    cookieStore.set('session', session, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}
