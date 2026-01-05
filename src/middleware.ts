import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from 'next/server'

let locales = ['en', 'fr', 'ar']
let defaultLocale = 'en'

function getLocale(request: any) {
  let headers = { 'accept-language': request.headers.get('accept-language') }
  let languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: any) {
  const { pathname } = request.nextUrl
  
  // 👇 YE LINE SBSE ZARURI HAI (Studio ko ignore karne ke liye)
  if (pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}