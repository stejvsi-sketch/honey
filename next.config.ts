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
            // Monetag uses randomly-rotating delivery domains (like Adsterra did).
            // To avoid whack-a-mole, script-src / connect-src / frame-src / img-src
            // use the broad `https:` source.  When Monetag is removed, restore the
            // strict directives shown in the comments below each line.
            // ──────────────────────────────────────────────────────────

            "default-src 'self'",

            // STRICT (no Monetag): "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://faves.grow.me https://*.grow.me https://cdn.prod.uidapi.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",

            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

            // STRICT (no Monetag): "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://*.grow.me https://pagead2.googlesyndication.com https://tpc.googlesyndication.com",
            "img-src 'self' data: https:",

            "font-src 'self' data: https://fonts.gstatic.com",

            // STRICT (no Monetag): "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://*.supabase.co https://*.upstash.io https://*.grow.me https://*.growplow.events https://*.uidapi.com https://fundingchoicesmessages.google.com",
            "connect-src 'self' https:",

            // STRICT (no Monetag): "frame-src 'self' https://*.grow.me https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com",
            "frame-src 'self' https:",

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
