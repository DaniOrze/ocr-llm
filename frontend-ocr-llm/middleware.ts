import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/signin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
