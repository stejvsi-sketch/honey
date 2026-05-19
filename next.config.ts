import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
  },
  headers: async () => [
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
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
            "font-src 'self' data:",
            "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://*.supabase.co https://*.upstash.io",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],
};

export default nextConfig;
