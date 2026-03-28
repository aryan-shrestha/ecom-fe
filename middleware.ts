import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { COOKIE_NAMES } from './src/config/constants';
import { ROUTES } from './src/lib/routes/paths';


/**
 * Middleware for route protection based on refresh_token cookie presence
 *
 * Logic:
 * - If user is on /login or /register and has refresh_token cookie -> redirect to /dashboard
 * - If user is on protected routes and has NO refresh_token cookie -> redirect to /login
 *
 * Note: We cannot access in-memory access token here, so we use cookie heuristics.
 * The actual auth verification happens in AuthGuard on the client.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
  const hasRefreshToken = !!refreshToken;

  // Public routes: /login, /register
  const isPublicRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;

  // Protected routes: /dashboard, /account, and any other routes under (protected) group
  const isProtectedRoute =
    pathname === ROUTES.DASHBOARD ||
    pathname === ROUTES.ACCOUNT ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account');

  // If user has refresh token and tries to access public auth pages, redirect to dashboard
  if (isPublicRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  // If user has no refresh token and tries to access protected routes, redirect to login
  if (isProtectedRoute && !hasRefreshToken) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
