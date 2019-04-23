import * as React from 'react';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useFirestoreCollection } from 'reactfire';
import firebaseConfig from './firebase-config.json';

const Animals = ({ serverAnimals }) => {
  const hydrateSerializedCollection = collection => {
    return {
      docs: collection.map(item => ({ ...item, data: () => item.data }))
    };
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const animals = useFirestoreCollection(
    firebase.firestore().collection('animals'),
    { startWithValue: hydrateSerializedCollection(serverAnimals) }
  );

  return (
    <ul>
      {animals.docs.map(animal => (
        <li key={animal.id}>{animal.data().commonName}</li>
      ))}
    </ul>
  );
};

export default Animals;
