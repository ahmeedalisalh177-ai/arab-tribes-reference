const express = require('express');
const router = express.Router();
const { query: dbQuery } = require('../db');

// Get all tribes
router.get('/', (req, res) => {
  try {
    const type = req.query.type;
    let sql = 'SELECT * FROM tribes ORDER BY name ASC';
    const params = [];

    if (type) {
      sql = 'SELECT * FROM tribes WHERE type = ? ORDER BY name ASC';
      params.push(type);
    }

    const result = dbQuery(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tribe by slug
router.get('/:slug', (req, res) => {
  try {
    const result = dbQuery(
      'SELECT * FROM tribes WHERE slug = ?',
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new tribe
router.post('/', (req, res) => {
  try {
    const { name, slug, description, lineage, history, notable_sheikhs, region, type } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = dbQuery(
      `INSERT INTO tribes (name, slug, description, lineage, history, notable_sheikhs, region, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, lineage, history, notable_sheikhs, region, type]
    );

    res.status(201).json({
      id: result.lastID,
      name, slug, description, lineage, history, notable_sheikhs, region, type
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update tribe
router.put('/:id', (req, res) => {
  try {
    const { name, description, lineage, history, notable_sheikhs, region, type } = req.body;

    const result = dbQuery(
      `UPDATE tribes 
       SET name = ?, description = ?, lineage = ?, history = ?, notable_sheikhs = ?, region = ?, type = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, lineage, history, notable_sheikhs, region, type, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

    res.json({ id: req.params.id, name, description, lineage, history, notable_sheikhs, region, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete tribe
router.delete('/:id', (req, res) => {
  try {
    const result = dbQuery(
      'DELETE FROM tribes WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

    res.json({ message: 'Tribe deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
