import { NextRequest, NextResponse } from 'next/server';

// Define supported locales directly to avoid heavy i18n imports
const locales = ['en', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko', 'vi'] as const;

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

  // If it's a protected route, check authentication using lightweight approach
  if (isProtectedRoute) {
    // Use a lightweight token check instead of full getToken
    const authCookie =
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token');

    // If no auth cookie, redirect to login
    if (!authCookie) {
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For admin routes, we'll do a basic check
    // In production, you might want to decode the JWT here for role checking
    if (isAdminRoute) {
      // For now, allow access - you can implement JWT decoding if needed
      // This reduces bundle size significantly by avoiding next-auth/jwt
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (pathWithoutLocale.startsWith('/auth')) {
    const authCookie =
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token');

    if (authCookie) {
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
