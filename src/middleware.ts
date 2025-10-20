import { NextRequest, NextResponse } from 'next/server';

import { locales } from './i18n';

export function middleware(request: NextRequest) {
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

  // Continue with the request if locale is present
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
