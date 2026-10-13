import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';
import { propertyService } from '@/services/property.service';

// Listings change constantly; a cached sitemap would advertise sold homes.
export const dynamic = 'force-dynamic';

/**
 * The public routes plus every listed home. `/admin/*` is excluded, as in
 * hgs-frontend. A failed read yields the static routes only — a sitemap must
 * never advertise a URL the routes would 404.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const routes: MetadataRoute.Sitemap = ['', '/properties', '/contact'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.8,
  }));

  const listings: MetadataRoute.Sitemap = [];
  const first = await propertyService.search({});
  if (first) {
    const pages = [first];
    for (let page = 2; page <= first.total_pages && page <= 50; page += 1) {
      const next = await propertyService.search({ page });
      if (!next) break;
      pages.push(next);
    }
    for (const { items } of pages) {
      for (const property of items) {
        listings.push({
          url: `${base}/properties/${property.slug}`,
          lastModified: property.listed_at ?? undefined,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  }
  return [...routes, ...listings];
}
