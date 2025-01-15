import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.append('Access-Control-Allow-Origin', '*')
  response.headers.append('Access-Control-Allow-Methods', 'GET')

  return response
}

export const config = {
  matcher: [
    '/og-image.png',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}