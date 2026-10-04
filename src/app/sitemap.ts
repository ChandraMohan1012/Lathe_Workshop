import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lathepattarai.com';
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // In demo mode, suppress project slugs to prevent crawlers indexing test data
  if (isDemo) {
    return [];
  }

  const staticRoutes = ['', '/portfolio', '/services', '/ongoing', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projects = await getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.completionDate || new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
