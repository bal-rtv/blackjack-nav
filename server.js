const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from dist folder (Parcel build output)
app.use(express.static('dist'));

async function fetchDeck(req, res) {
  try {
    const response = await fetch('https://blackjack.ekstern.dev.nav.no/shuffle');

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch deck' });
    }

    const deck = await response.json();
    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
}

// Proxy endpoint for shuffled deck
app.get('/api/deck', fetchDeck);
app.get('/api/shuffle', fetchDeck);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
