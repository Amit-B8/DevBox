import type { MetadataRoute } from 'next';
import { tools, disciplineHubs } from '@/data/tools';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl.replace(/\/$/, '');
  const staticRoutes = [
    '',
    '/engineering',
    '/mathematics',
    '/medical',
    '/finance',
    '/creative',
    '/research',
    '/utilities',
    '/about',
    '/privacy-policy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryRoutes = disciplineHubs.map((hub) => ({
    url: `${baseUrl}/${hub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
