import * as React from 'react';
import { useEffect, useState } from 'react';
import { preloadFirestore, useFirebaseApp, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useFirestoreDocDataOnce, useUser } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { AuthWrapper } from './Auth';

const Counter = () => {
  const firestore = useFirestore;
  const serverIncrement = firestore.FieldValue.increment;
  const ref = firestore().doc('count/counter');

  const increment = amountToIncrement => {
    ref.update({
      value: serverIncrement(amountToIncrement)
    });
  };

  const response = useFirestoreDocData(ref);

  const { status, data: count } = response;
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {(count as any).value} </span>
      <button onClick={() => increment(1)}>+</button>
    </>
  );
};

const AnimalsList = () => {
  const firestore = useFirestore();
  const animalsCollection = firestore.collection('animals');
  const [isAscending, setIsAscending] = useState(false);
  const animalsQuery = animalsCollection.orderBy('commonName', isAscending ? 'asc' : 'desc');
  const { status, data: animals } = useFirestoreCollectionData(animalsQuery, {
    idField: 'id'
  });

  const addAnimal = () => {
    const possibleAnimals = ['Dog', 'Cat', 'Iguana', 'Zebra'];
    const selectedAnimal = possibleAnimals[Math.floor(Math.random() * possibleAnimals.length)];
    animalsCollection.add({ commonName: selectedAnimal });
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <WideButton
        label="Sort"
        onClick={() => {
          setIsAscending(!isAscending);
        }}
      />
      <div className="h-20 overflow-x-scroll shadow-inner m-2 border border-black">
        <ul>
          {animals.map(animal => (
            <li key={animal.id as string}>{animal.commonName as string}</li>
          ))}
        </ul>
      </div>
      <WideButton
        label="Add Animal"
        onClick={() => {
          addAnimal();
        }}
      />
    </>
  );
};

const StaticValue = props => {
  const firestore = useFirestore();

  const ref = firestore.doc('count/counter');

  const { status, data } = useFirestoreDocDataOnce(ref);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  return <span>{(data as any).value}</span>;
};

export const Firestore = () => {
  const firebaseApp = useFirebaseApp();
  const [database, setDatabase] = useState<firebase.firestore.Firestore | undefined>(undefined);
  useEffect(() => {
    preloadFirestore({
      firebaseApp: firebaseApp,
      setup: async firestore => {
        await firestore().enablePersistence();
        setDatabase(firestore());
      }
    });
  }, []);

  if (!database) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AuthWrapper fallback={<span>Sign in to use this component</span>}>
        <CardSection title="Get/Set document value">
          <Counter />
        </CardSection>
        <CardSection title="Fetch data once">
          <StaticValue />
        </CardSection>
        <CardSection title="Work with lists of data">
          <AnimalsList />
        </CardSection>
      </AuthWrapper>
    </>
  );
};
