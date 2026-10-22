import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_JOURNAL_SLUGS } from '@/lib/legacy-journal-slugs';

const LEGACY_HOSTS = new Set(['ifonlyisentthis.com', 'www.ifonlyisentthis.com']);
const CURRENT_ORIGIN = 'https://www.honeyifonly.com';
const LEGACY_STATIC_PATHS: Record<string, string> = {
  '/': '/unsent',
  '/unsent': '/unsent',
  '/archive': '/unsent',
  '/about': '/about',
  '/how-it-works': '/about',
  '/author': '/author',
  '/contact': '/contact',
  '/privacy': '/privacy',
  '/terms': '/terms',
  '/cookies': '/cookies',
  '/disclaimer': '/disclaimer',
  '/faq': '/faq',
  '/journal': '/journal',
  '/stories': '/stories',
  '/write': '/write',
  '/burn': '/burn',
  '/methodology': '/methodology',
  '/collections': '/collections',
  '/robots.txt': '/robots.txt',
  '/sitemap.xml': '/sitemap.xml',
};

export function proxy(request: NextRequest) {
  // The former domain previously sent every path to /unsent. Preserve known
  // pages with page-specific redirects and stop redirecting unknown URLs to an
  // unrelated archive (which can be treated as a soft 404).
  if (LEGACY_HOSTS.has(request.nextUrl.hostname.toLowerCase())) {
    const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
    let destination = LEGACY_STATIC_PATHS[pathname];

    if (!destination) {
      const lastSegment = pathname.split('/').filter(Boolean).at(-1);
      if (lastSegment && LEGACY_JOURNAL_SLUGS.has(lastSegment)) {
        destination = `/journal/${lastSegment}`;
      }
    }

    if (destination) {
      const url = new URL(destination, CURRENT_ORIGIN);
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url, 308);
    }

    return new NextResponse('This legacy URL has no matching page on Honey, If Only.', {
      status: 410,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

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
