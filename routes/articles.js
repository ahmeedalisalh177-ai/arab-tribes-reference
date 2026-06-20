const express = require('express');
const router = express.Router();
const { query: dbQuery } = require('../db');

// Get all published articles
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = dbQuery(
      `SELECT id, title, slug, excerpt, author, created_at 
       FROM articles 
       WHERE published = 1 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = dbQuery(
      'SELECT COUNT(*) as count FROM articles WHERE published = 1'
    );

    res.json({
      articles: result.rows,
      total: countResult.rows[0].count,
      page: page,
      limit: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get article by slug
router.get('/:slug', (req, res) => {
  try {
    const result = dbQuery(
      'SELECT * FROM articles WHERE slug = ? AND published = 1',
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new article
router.post('/', (req, res) => {
  try {
    const { title, excerpt, content, keywords, author, slug } = req.body;

    if (!title || !content || !slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = dbQuery(
      `INSERT INTO articles (title, slug, excerpt, content, keywords, author, published)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [title, slug, excerpt, content, keywords, author]
    );

    res.status(201).json({
      id: result.lastID,
      title, slug, excerpt, content, keywords, author,
      published: false
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update article
router.put('/:id', (req, res) => {
  try {
    const { title, excerpt, content, keywords, author, published } = req.body;

    const result = dbQuery(
      `UPDATE articles 
       SET title = ?, excerpt = ?, content = ?, keywords = ?, author = ?, published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, excerpt, content, keywords, author, published ? 1 : 0, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ id: req.params.id, title, excerpt, content, keywords, author, published });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete article
router.delete('/:id', (req, res) => {
  try {
    const result = dbQuery(
      'DELETE FROM articles WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
