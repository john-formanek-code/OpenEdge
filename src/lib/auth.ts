import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getAuthPassword, getAuthSecret } from './env';

type SessionPayload = Record<string, unknown>;
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

function getSigningKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSigningKey());
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, getSigningKey(), {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(formData: FormData) {
  const password = formData.get('password');
  const envPassword = getAuthPassword();

  if (password === envPassword) {
    const expiresAt = new Date(Date.now() + sessionDurationMs);
    const session = await encrypt({ user: 'admin', expires: expiresAt });
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: 'session', path: '/' });
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
