const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = require('./db');

// Routes
app.use('/api/articles', require('./routes/articles'));
app.use('/api/tribes', require('./routes/tribes'));
app.use('/api/search', require('./routes/search'));

// Sitemap for SEO
app.get('/sitemap.xml', require('./routes/sitemap'));

// Robots.txt for SEO
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: ${process.env.BASE_URL || 'http://localhost:3000'}/sitemap.xml`);
});

// Main page with Schema Markup
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرجع القبائل العربية - أنساب وتاريخ القبائل</title>
  <meta name="description" content="موسوعة شاملة لأنساب القبائل العربية وتاريخها وأشهر مشائخها. مرجع موثوق للباحثين والمهتمين بالتاريخ العربي.">
  <meta name="keywords" content="القبائل العربية, أنساب, تاريخ, قبائل عدنانية, قبائل قحطانية, المشائخ">
  <meta name="author" content="مرجع القبائل العربية">
  <meta property="og:title" content="مرجع القبائل العربية">
  <meta property="og:description" content="موسوعة شاملة لأنساب القبائل العربية وتاريخها">
  <meta property="og:type" content="website">
  <link rel="canonical" href="${process.env.BASE_URL || 'http://localhost:3000'}/"/>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مرجع القبائل العربية",
    "url": "${process.env.BASE_URL || 'http://localhost:3000'}",
    "description": "موسوعة شاملة لأنساب القبائل العربية وتاريخها",
    "sameAs": [
      "https://www.facebook.com/arab-tribes",
      "https://twitter.com/arab-tribes"
    ]
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script src="/js/main.js"></script>
</body>
</html>`;
  res.send(html);
});

// Article page with advanced Schema Markup
app.get('/article/:slug', (req, res) => {
  try {
    const { query: dbQuery } = require('./db');
    const result = dbQuery(
      'SELECT * FROM articles WHERE slug = ? AND published = 1',
      [req.params.slug]
    );

    if (!result) {
      return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }

    const article = result;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const articleUrl = `${baseUrl}/article/${article.slug}`;
    
    // Schema Markup for Article
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt || article.content.substring(0, 160),
      "image": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/article-default.jpg`,
        "width": 1200,
        "height": 630
      },
      "datePublished": article.created_at,
      "dateModified": article.updated_at || article.created_at,
      "author": {
        "@type": "Person",
        "name": article.author || "مرجع القبائل العربية"
      },
      "publisher": {
        "@type": "Organization",
        "name": "مرجع القبائل العربية",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 200,
          "height": 200
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      "keywords": article.keywords || "القبائل العربية, أنساب, تاريخ"
    };

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} - مرجع القبائل العربية</title>
  <meta name="description" content="${(article.excerpt || article.content.substring(0, 155)).replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${article.keywords || 'القبائل العربية, أنساب, تاريخ'}">
  <meta name="author" content="${article.author || 'مرجع القبائل العربية'}">
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${(article.excerpt || article.content.substring(0, 155)).replace(/"/g, '&quot;')}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${articleUrl}">
  <meta property="article:published_time" content="${article.created_at}">
  <meta property="article:author" content="${article.author || 'مرجع القبائل العربية'}">
  <link rel="canonical" href="${articleUrl}"/>
  <script type="application/ld+json">
  ${JSON.stringify(articleSchema)}
  </script>
</head>
<body>
  <div id="root"></div>
  <script src="/js/main.js"></script>
</body>
</html>`;
    res.send(html);
  } catch (error) {
    console.error('Error loading article:', error);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
  }
});

// Tribe page with Schema Markup
app.get('/tribe/:slug', (req, res) => {
  try {
    const { query: dbQuery } = require('./db');
    const result = dbQuery(
      'SELECT * FROM tribes WHERE slug = ?',
      [req.params.slug]
    );

    if (!result) {
      return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }

    const tribe = result;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const tribeUrl = `${baseUrl}/tribe/${tribe.slug}`;

    // Schema Markup for Thing (Tribe)
    const tribeSchema = {
      "@context": "https://schema.org",
      "@type": "Thing",
      "name": tribe.name,
      "description": tribe.description || `قبيلة ${tribe.name} من القبائل العربية`,
      "image": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/tribe-default.jpg`
      },
      "url": tribeUrl,
      "sameAs": []
    };

    // Add custom properties
    if (tribe.lineage) {
      tribeSchema.additionalProperty = {
        "@type": "PropertyValue",
        "name": "النسب",
        "value": tribe.lineage
      };
    }

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tribe.name} - مرجع القبائل العربية</title>
  <meta name="description" content="${(tribe.description || `قبيلة ${tribe.name}`).replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${tribe.name}, قبيلة, أنساب, تاريخ">
  <meta property="og:title" content="${tribe.name}">
  <meta property="og:description" content="${(tribe.description || `قبيلة ${tribe.name}`).replace(/"/g, '&quot;')}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${tribeUrl}">
  <link rel="canonical" href="${tribeUrl}"/>
  <script type="application/ld+json">
  ${JSON.stringify(tribeSchema)}
  </script>
</head>
<body>
  <div id="root"></div>
  <script src="/js/main.js"></script>
</body>
</html>`;
    res.send(html);
  } catch (error) {
    console.error('Error loading tribe:', error);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
  }
});

// FAQ page with FAQPage Schema
app.get('/faq', (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هي القبائل العربية؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "القبائل العربية هي مجموعات من السكان العرب تنتمي إلى أصول وأنساب مشتركة. تنقسم إلى قبائل عدنانية وقحطانية وبائدة."
          }
        },
        {
          "@type": "Question",
          "name": "ما الفرق بين القبائل العدنانية والقحطانية؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "القبائل العدنانية تنتسب إلى عدنان بن إسماعيل، بينما القبائل القحطانية تنتسب إلى قحطان بن هود."
          }
        },
        {
          "@type": "Question",
          "name": "أين أجد معلومات عن قبيلتي؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يمكنك البحث في موقعنا عن اسم قبيلتك أو استخدام محرك البحث للعثور على المعلومات المتعلقة بنسبك وتاريخ قبيلتك."
          }
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>الأسئلة الشائعة - مرجع القبائل العربية</title>
  <meta name="description" content="أسئلة وأجوبة شاملة عن القبائل العربية وأنسابها وتاريخها">
  <link rel="canonical" href="${baseUrl}/faq"/>
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema)}
  </script>
</head>
<body>
  <div id="root"></div>
  <script src="/js/main.js"></script>
</body>
</html>`;
    res.send(html);
  } catch (error) {
    console.error('Error loading FAQ:', error);
    res.status(500).send('خطأ في تحميل الصفحة');
  }
});

// About page with Organization Schema
app.get('/about', (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    const aboutSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "مرجع القبائل العربية",
      "url": baseUrl,
      "description": "موسوعة شاملة لأنساب القبائل العربية وتاريخها وأشهر مشائخها",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "info@arab-tribes.com"
      },
      "sameAs": [
        "https://www.facebook.com/arab-tribes",
        "https://twitter.com/arab-tribes"
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>من نحن - مرجع القبائل العربية</title>
  <meta name="description" content="تعرف على مرجع القبائل العربية - موسوعة شاملة لأنساب وتاريخ القبائل العربية">
  <link rel="canonical" href="${baseUrl}/about"/>
  <script type="application/ld+json">
  ${JSON.stringify(aboutSchema)}
  </script>
</head>
<body>
  <div id="root"></div>
  <script src="/js/main.js"></script>
</body>
</html>`;
    res.send(html);
  } catch (error) {
    console.error('Error loading about page:', error);
    res.status(500).send('خطأ في تحميل الصفحة');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('خطأ في الخادم');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`);
});
