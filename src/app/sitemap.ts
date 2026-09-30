import { MetadataRoute } from 'next';
import { mockProjects } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lathepattarai.com';

  const staticRoutes = ['', '/portfolio', '/services', '/ongoing', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projectRoutes = mockProjects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.completionDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
