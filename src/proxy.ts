import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fi', 'sv', 'en'];
const defaultLocale = 'fi';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname has an active locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    '/((?!api|_next/static|_next/image|assets|favicon.ico|site.webmanifest|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)',
  ],
};
