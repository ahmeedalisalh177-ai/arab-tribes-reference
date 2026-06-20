const express = require('express');
const router = express.Router();
const { query: dbQuery } = require('../db');

// Search in articles and tribes
router.get('/', (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const searchTerm = `%${query}%`;

    // Search in articles
    const articlesResult = dbQuery(
      `SELECT id, title, slug, excerpt, 'article' as type 
       FROM articles 
       WHERE (title LIKE ? OR content LIKE ? OR keywords LIKE ?) 
       AND published = 1
       LIMIT 10`,
      [searchTerm, searchTerm, searchTerm]
    );

    // Search in tribes
    const tribesResult = dbQuery(
      `SELECT id, name as title, slug, description as excerpt, 'tribe' as type 
       FROM tribes 
       WHERE (name LIKE ? OR description LIKE ? OR history LIKE ?)
       LIMIT 10`,
      [searchTerm, searchTerm, searchTerm]
    );

    res.json({
      articles: articlesResult.rows,
      tribes: tribesResult.rows,
      total: articlesResult.rows.length + tribesResult.rows.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
