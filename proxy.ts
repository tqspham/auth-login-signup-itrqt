import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const publicPaths = ['/login', '/signup', '/'];
const protectedPaths = ['/dashboard'];
const authApiPaths = ['/api/auth', '/api/auth/signup'];
const staticAssets = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i;

function isValidRedirectPath(pathname: string): boolean {
  if (!pathname) return false;
  // Reject absolute URLs and non-relative paths
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return false;
  }
  // Reject auth paths, API routes, Next.js internals
  if (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    staticAssets.test(pathname)
  ) {
    return false;
  }
  return true;
}

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

  // Public paths: allow everyone
  if (publicPaths.includes(pathname)) {
    // Check session only to redirect authenticated users away from login/signup
    const session = await auth();
    const sessionToken = session?.user?.id;

    // Authenticated users visiting login/signup should redirect to dashboard
    if ((pathname === '/login' || pathname === '/signup') && sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected paths: require session
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected) {
    const session = await auth();
    const sessionToken = session?.user?.id;

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      // Only add 'from' parameter if the current path is valid and not a public/auth path
      if (isValidRedirectPath(pathname)) {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
