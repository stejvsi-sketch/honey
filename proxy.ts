import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Cloudflare's bot verification can issue a POST to the page URL after the challenge.
  // Next.js page routes only respond to GET, so this results in HTTP 405.
  // Convert POST requests on page routes (non-API) back to GET via redirect.
  if (request.method === 'POST' && !request.nextUrl.pathname.startsWith('/api')) {
    const url = request.nextUrl.clone();
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.next();

  // For HTML page requests: set explicit 5h browser cache with must-revalidate.
  // Without this, browsers use "heuristic caching" which is unpredictable —
  // they might cache for minutes or indefinitely.
  // max-age=18000: browser caches for exactly 5 hours
  // must-revalidate: after 5h, browser MUST check with CDN — no serving stale content
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=18000, s-maxage=18000, stale-while-revalidate=18000, must-revalidate'
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)).*)',
  ],
};
