import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import express from 'express';
import htmlTemplate from './html-template';
import App from './App';
import serviceAccount from './firebase-key.json';
import admin from 'firebase-admin';
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rxfire-525a3.firebaseio.com'
});

const serializeQuerySnapshot = (snap: admin.firestore.QuerySnapshot): any[] => {
  const items: any[] = [];

  snap.forEach(dataSnap => {
    items.push({ id: dataSnap.id, data: dataSnap.data() });
  });

  return items;
};

const db = admin.firestore();

app.use('/dist', express.static(`dist/client`));

app.get('/*', async (req, res) => {
  console.log('got a request');

  const animalsSnapShot = await db.collection('animals').get();

  const serializedAnimalSnapshot = serializeQuerySnapshot(animalsSnapShot);
  console.log(serializedAnimalSnapshot);
  const markup = ReactDOM.renderToString(
    <App isBrowser={false} animals={serializedAnimalSnapshot} />
  );
  const html = htmlTemplate(
    markup,
    JSON.stringify({ initialCount: 7, animals: serializedAnimalSnapshot })
  );

  res.send(html);
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
