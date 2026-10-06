const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from dist folder (Parcel build output)
app.use(express.static('dist'));

// Proxy endpoint for shuffled deck
app.get('/api/deck', async (req, res) => {
  try {
    const response = await fetch('https://blackjack.ekstern.dev.nav.no/shuffle');
    const deck = await response.json();
    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
