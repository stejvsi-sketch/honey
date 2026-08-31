import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
  },

  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/textures/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            // ── CSP NOTE ──────────────────────────────────────────────
            // Adcash uses randomly-rotating delivery domains.
            // To avoid whack-a-mole, script-src / connect-src / frame-src / img-src
            // use the broad `https:` source.  When Adcash is removed, restore the
            // strict directives shown in the comments below each line.
            // ──────────────────────────────────────────────────────────

            "default-src 'self'",

            // STRICT (no ad networks): "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com",
            // OPEN: BidVertiser (and future Monumetric) use rotating delivery domains
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",

            "style-src 'self' 'unsafe-inline' https:",

            // STRICT (no ad networks): "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com",
            "img-src 'self' data: https:",

            "font-src 'self' data: https://fonts.gstatic.com",

            // STRICT (no ad networks): "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://*.supabase.co https://*.upstash.io https://fundingchoicesmessages.google.com",
            "connect-src 'self' https:",

            // STRICT (no ad networks): "frame-src 'self' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com",
            "frame-src 'self' https:",

            // STRICT (no Adcash): "worker-src 'self'"
            "worker-src 'self'",

            // STRICT (no Adcash): "media-src 'self'"
            "media-src 'self'",

            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
};

export default nextConfig;
