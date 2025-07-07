const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const port = 4000;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/rings', async (req, res) => {
  try {
    const snapshot = await db.collection('engagementRings').get();
    const rings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rings);
  } catch (error) {
    console.error('Error fetching rings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});