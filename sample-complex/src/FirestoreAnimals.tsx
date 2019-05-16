import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useFirestoreCollection } from 'reactfire';

const deserialize = collection => {
  return {
    docs: collection.map(item => ({ ...item, data: () => item.data }))
  };
};

const Animals = ({ serverAnimals }) => {
  let initialAnimals = deserialize(serverAnimals);

  let animals = initialAnimals;

  if (firebase.apps.length) {
    animals = useFirestoreCollection(
      firebase.firestore().collection('animals'),
      { startWithValue: initialAnimals }
    );
  }

  return (
    <ul className="list-disc list-inside">
      {animals.docs.map(animal => (
        <li key={animal.id}>name: {animal.data().commonName}</li>
      ))}
    </ul>
  );
};

export default Animals;
