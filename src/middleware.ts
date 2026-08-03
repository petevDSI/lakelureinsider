import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'lakelureinsider.com'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  // Strip port so localhost:3000 and lakelureinsider.com:443 both resolve cleanly
  const hostname = host.split(':')[0]

  const response = NextResponse.next()

  if (hostname !== CANONICAL_HOST) {
    response.headers.set('X-Robots-Tag', 'noindex')
  }

  return response
}

export const config = {
  matcher: [
    // All paths except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
