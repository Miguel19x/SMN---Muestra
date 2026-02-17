import type { APIRoute } from 'astro';

/**
 * Sitemap dinámico para SEO
 * 
 * Genera un sitemap.xml con todas las páginas públicas del sitio
 * y casos dinámicos de personas desaparecidas (si aplicable en el futuro)
 */
export const GET: APIRoute = async () => {
  const baseUrl = 'https://datatracker-demo.vercel.app';

  // Páginas estáticas principales
  const staticPages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    { url: '/estadisticas', changefreq: 'weekly', priority: 0.8 },
    { url: '/listado-de-fallecidos', changefreq: 'weekly', priority: 0.9 },
    { url: '/subir-informacion', changefreq: 'monthly', priority: 0.7 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages
      .map(
        (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache 1 hora
    },
  });
};
