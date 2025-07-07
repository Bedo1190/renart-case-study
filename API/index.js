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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});