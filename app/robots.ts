import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Beneficial search engine bots: allow pages, block API/admin.
      {
        userAgent: ['Googlebot', 'Bingbot', 'Mediapartners-Google', 'Yandex', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/api/', '/xqvjkl/'],
      },

      // 2. AI training crawlers: block everything.
      {
        userAgent: [
          'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
          'ClaudeBot', 'Claude-Web', 'anthropic-ai',
          'Bytespider', 'CCBot', 'Google-Extended',
          'FacebookBot', 'Amazonbot', 'Applebot-Extended',
          'PerplexityBot', 'Cohere-ai', 'YouBot',
        ],
        disallow: '/',
      },

      // 3. Commercial SEO scrapers: block everything.
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot', 'omgili', 'omgilibot'],
        disallow: '/',
      },

      // 4. Catch-all fallback: allow pages, block API/admin.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/xqvjkl/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
