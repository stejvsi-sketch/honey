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

  const response = NextResponse.next();

  // For HTML page requests (not API, not static assets):
  // Set max-age=0 so browsers always revalidate with the CDN.
  // This ensures that after a Vercel/Cloudflare cache purge,
  // visitors immediately see fresh content instead of stale browser cache.
  // s-maxage=18000 keeps the CDN caching for 5h (no extra compute cost).
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=18000, stale-while-revalidate=18000'
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
