import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const publicPaths = ['/login', '/signup', '/'];
const protectedPaths = ['/dashboard'];
const authApiPaths = ['/api/auth', '/api/auth/signup'];
const staticAssets = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i;

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow Next.js internals and static assets
  if (pathname.startsWith('/_next') || staticAssets.test(pathname)) {
    return NextResponse.next();
  }

  // Allow auth API routes
  if (authApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check session
  const session = await auth();
  const sessionToken = session?.user?.id;

  // Public paths: allow everyone
  if (publicPaths.includes(pathname)) {
    // Authenticated users visiting login/signup should redirect to dashboard
    if ((pathname === '/login' || pathname === '/signup') && sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected paths: require session
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
