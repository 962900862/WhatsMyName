import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/locale';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://bigbeautifulbillcalculator.org';

  // Helper function to generate clean URLs for sitemap
  function generateCleanUrl(path: string, locale: string): string {
    // Remove anchors for sitemap
    const cleanPath = path.replace(/#.*$/, '');
    
    if (locale === defaultLocale) {
      // Default locale (en) goes to root
      return cleanPath === '' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`;
    } else {
      // Other locales get prefixed
      return cleanPath === '' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${cleanPath}`;
    }
  }

  // Static pages for Big Beautiful Bill Calculator
  const staticRoutes = ['', '/privacy-policy', '/terms-of-service', '/cookie-policy'];
  const staticPages = staticRoutes.flatMap((route) => {
    return locales.map((locale) => ({
      url: generateCleanUrl(route, locale),
      lastModified: new Date(),
    }));
  });

  return staticPages;
}