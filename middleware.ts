import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cloudflare's bot verification can issue a POST to the page URL after the challenge.
  // Next.js page routes only respond to GET, so this results in HTTP 405.
  // Convert POST requests on page routes (non-API) back to GET via redirect.
  if (request.method === 'POST' && !request.nextUrl.pathname.startsWith('/api')) {
    const url = request.nextUrl.clone();
    return NextResponse.redirect(url, 303);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)).*)',
  ],
};
