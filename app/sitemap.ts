import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '', '/letters', '/write', '/about', '/journal',
    '/terms', '/privacy', '/disclaimer', '/contact',
  ];

  return staticPages.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/letters' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : path === '/letters' ? 0.9 : 0.6,
  }));
}
