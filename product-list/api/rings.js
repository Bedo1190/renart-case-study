import admin from 'firebase-admin';
import cors from 'cors';
import axios from 'axios';

// Enable CORS
const corsMiddleware = cors({ origin: true });

let db = null;

// Initialize Firebase Admin SDK safely
try {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase initialized successfully');
  }

  db = admin.firestore();
} catch (err) {
  console.error('❌ Firebase initialization failed:', err.message);
  db = null;
}

// External gold price fetch function
async function getGoldPricePerGram() {
  try {
    const response = await axios.get(
      'https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD'
    );
    const data = response.data[0];
    const bid = data.spreadProfilePrices[0].bid;
    const ask = data.spreadProfilePrices[0].ask;
    const pricePerOunce = (bid + ask) / 2;
    return pricePerOunce / 31.1035; // Convert ounce to grams
  } catch (err) {
    console.error('❌ Swissquote gold API failed:', err.message);
    return 70.0; // Fallback value
  }
}

// API handler
export default async function handler(req, res) {
  // Wait for CORS
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
  });

  // Firebase check
  if (!db) {
    return res.status(500).json({ error: 'Firestore not initialized. Check Firebase credentials.' });
  }

  try {
    const goldPricePerGram = await getGoldPricePerGram();

    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const minScore = parseFloat(req.query.minScore);
    const maxScore = parseFloat(req.query.maxScore);

    const snapshot = await db.collection('engagementRings').get();

    const rings = snapshot.docs.map((doc) => {
      const data = doc.data();
      const popularityScore = data.popularityScore || 0;
      const weight = data.weight || 0;
      const priceUSD = (popularityScore + 1) * weight * goldPricePerGram;

      return {
        id: doc.id,
        ...data,
        priceUSD: parseFloat(priceUSD.toFixed(2)),
      };
    });

    const filteredRings = rings.filter((ring) => {
      const passesPrice =
        (isNaN(minPrice) || ring.priceUSD >= minPrice) &&
        (isNaN(maxPrice) || ring.priceUSD <= maxPrice);
      const passesScore =
        (isNaN(minScore) || ring.popularityScore >= minScore) &&
        (isNaN(maxScore) || ring.popularityScore <= maxScore);
      return passesPrice && passesScore;
    });

    res.status(200).json(filteredRings);
  } catch (error) {
    console.error('❌ Error fetching rings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
