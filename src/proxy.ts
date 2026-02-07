import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  
  // Public paths
  if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Check session
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await decrypt(session);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\.png$).*)'],
};
