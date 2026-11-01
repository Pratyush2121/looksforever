import { connectToDatabase, isDbConnected } from '../lib/db.js';
import { Product, Category, Blog } from '../lib/models.js';

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {}

  const baseUrl = process.env.VITE_SITE_URL || 'https://looksforever.org';
  const now = new Date().toISOString().slice(0, 10);

  let products = [];
  let categories = [];
  let blogs = [];

  if (dbAvailable) {
    try {
      [products, categories, blogs] = await Promise.all([
        Product.find({ active: true }).select('slug updatedAt'),
        Category.find({ active: true }).select('slug updatedAt'),
        Blog.find({ active: true }).select('slug updatedAt publishedAt'),
      ]);
    } catch (e) {}
  }

  const staticRoutes = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '/products', changefreq: 'daily', priority: '0.9' },
    { loc: '/about', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blogs', changefreq: 'weekly', priority: '0.8' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  staticRoutes.forEach(r => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${r.loc}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
    xml += `    <priority>${r.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Categories
  categories.forEach(c => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/category/${c.slug}</loc>\n`;
    xml += `    <lastmod>${c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Products
  products.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/product/${p.slug}</loc>\n`;
    xml += `    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  });

  // Blogs
  blogs.forEach(b => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/${b.slug}</loc>\n`;
    xml += `    <lastmod>${b.updatedAt ? new Date(b.updatedAt).toISOString().slice(0, 10) : now}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(xml);
}

