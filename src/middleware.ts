import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Agar user root URL ('/') par hai, toh 'en' par redirect karo
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  // Assets (images/files) ko ignore karo
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, static files)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};