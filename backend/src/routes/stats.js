const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../data/items.json');

let statsCache = null;

// Load stats from file and cache it
function loadStats() {
  try {
    const raw = fs.readFileSync(DATA_PATH);
    const items = JSON.parse(raw);
    const total = items.length;
    const averagePrice =
      total === 0 ? 0 : items.reduce((acc, cur) => acc + (cur.price || 0), 0) / total;

    statsCache = {
      total,
      averagePrice,
      cachedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error('Error reading or parsing items.json:', e);
    statsCache = null;
  }
}

// Initial cache load on startup
loadStats();

// GET /api/stats
router.get('/', (req, res) => {
  if (statsCache) {
    return res.json({ ...statsCache, cached: true });
  } else {
    loadStats();
    if (statsCache) {
      return res.json({ ...statsCache, cached: false });
    }
    return res.status(500).json({ error: 'Unable to load stats' });
  }
});

module.exports = router;
