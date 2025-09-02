import { getAllCategories } from '../utils/batteryData.js';

export async function GET() {
  const baseUrl = 'https://batteries.guide';
  const categories = getAllCategories();
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' }, // Homepage
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/search', priority: '0.9', changefreq: 'weekly' }
  ];
  
  // Category pages
  const categoryPages = categories.map(category => ({
    url: `/${category.slug}`,
    priority: '0.9',
    changefreq: 'weekly'
  }));
  
  // Individual battery pages
  const batteryPages = [];
  categories.forEach(category => {
    category.batteries.forEach(battery => {
      const slug = battery.type.toLowerCase().replace(/[^a-z0-9]/g, '-');
      batteryPages.push({
        url: `/${category.slug}/${slug}`,
        priority: '0.8',
        changefreq: 'monthly'
      });
    });
  });
  
  // Combine all pages
  const allPages = [...staticPages, ...categoryPages, ...batteryPages];
  
  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600' // Cache for 1 hour
    }
  });
}