import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';

import { locales } from './i18n';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/account',
  '/orders',
  '/rfq',
  '/inventory',
  '/analytics',
  '/settings',
];

// Define admin-only routes
const adminRoutes = ['/admin', '/analytics', '/inventory', '/settings'];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/products',
  '/services',
  '/blog',
  '/market-reports',
  '/origin-stories',
  '/contact',
  '/legal',
  '/auth',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_static/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.startsWith('/@vite/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(
        `/en${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  // Extract locale and path without locale
  const locale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathWithoutLocale.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route =>
    pathWithoutLocale.startsWith(route)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
    });

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has required role for admin routes
    if (isAdminRoute && token.role !== UserRole.ADMIN) {
      const unauthorizedUrl = new URL(`/${locale}/unauthorized`, request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Check if user account is active
    if (!token.isActive) {
      const suspendedUrl = new URL(`/${locale}/account-suspended`, request.url);
      return NextResponse.redirect(suspendedUrl);
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (pathWithoutLocale.startsWith('/auth')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
    });

    if (token && token.isActive) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Continue with the request if all checks pass
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, static assets, and development files
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - all items inside /public folder (images, icons, etc.)
    // - @vite/client (development only)
    '/((?!api|_next|_static|_vercel|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|workbox|images|fonts|icons|@vite|.*\\.).*)',
  ],
};
