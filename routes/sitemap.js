const { query: dbQuery } = require('../db');

module.exports = (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    // Get all published articles
    const articlesResult = dbQuery(
      'SELECT slug, updated_at FROM articles WHERE published = 1 ORDER BY updated_at DESC'
    );

    // Get all tribes
    const tribesResult = dbQuery(
      'SELECT slug, updated_at FROM tribes ORDER BY updated_at DESC'
    );

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add main pages
    const mainPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/faq', priority: '0.7', changefreq: 'monthly' }
    ];
    
    mainPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    // Add articles
    articlesResult.rows.forEach(article => {
      const date = new Date(article.updated_at).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    // Add tribes
    tribesResult.rows.forEach(tribe => {
      const date = new Date(tribe.updated_at).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${baseUrl}/tribe/${tribe.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });

    sitemap += '</urlset>';

    res.type('application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating sitemap');
  }
};
