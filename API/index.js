const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const port = 4000;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getGoldPricePerGram = async () => {
  try {
    const response = await axios.get(
      'https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD'
    );

    const data = response.data[0];
    const bid = data.spreadProfilePrices[0].bid;
    const ask = data.spreadProfilePrices[0].ask;

    const pricePerOunce = (bid + ask) / 2;
    const pricePerGram = pricePerOunce / 31.1035;

    return pricePerGram;
  } catch (err) {
    console.error('Swissquote gold API failed:', err.message);
    // fallback price per gram in USD if API call fails
    return 70.0;
  }
};

app.get('/rings', async (req, res) => {
  try {
    const goldPricePerGram = await getGoldPricePerGram();

    // Extract filters from query parameters
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const minScore = parseFloat(req.query.minScore);
    const maxScore = parseFloat(req.query.maxScore);

    // Fetch all rings
    const snapshot = await db.collection('engagementRings').get();

    const rings = snapshot.docs.map(doc => {
      const data = doc.data();
      const popularityScore = data.popularityScore || 0;
      const weight = data.weight || 0;

      // Compute price
      const priceUSD = (popularityScore + 1) * weight * goldPricePerGram;

      return {
        id: doc.id,
        ...data,
        priceUSD: parseFloat(priceUSD.toFixed(2)),
      };
    });

    // Apply filtering based on query parameters
    const filteredRings = rings.filter(ring => {
      const passesPrice =
        (isNaN(minPrice) || ring.priceUSD >= minPrice) &&
        (isNaN(maxPrice) || ring.priceUSD <= maxPrice);

      const passesScore =
        (isNaN(minScore) || ring.popularityScore >= minScore) &&
        (isNaN(maxScore) || ring.popularityScore <= maxScore);

      return passesPrice && passesScore;
    });

    res.json(filteredRings);
  } catch (error) {
    console.error('Error fetching rings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
