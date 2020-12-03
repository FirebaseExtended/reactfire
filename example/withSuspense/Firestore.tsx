import * as React from 'react';
import { useEffect, useState, unstable_useTransition, unstable_SuspenseList as SuspenseList } from 'react';
import {
  preloadFirestore,
  useFirebaseApp,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useFirestoreDocDataOnce,
  AuthCheck,
  SuspenseWithPerf
} from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

const Counter = props => {
  const firestore = useFirestore;

  const serverIncrement = firestore.FieldValue.increment;

  const ref = firestore().doc('count/counter');

  const increment = amountToIncrement => {
    ref.update({
      value: serverIncrement(amountToIncrement)
    });
  };

  const { data } = useFirestoreDocData(ref);

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {(data as { value: number }).value} </span>
      <button onClick={() => increment(1)}>+</button>
    </>
  );
};

const StaticValue = props => {
  const firestore = useFirestore();

  const ref = firestore.doc('count/counter');

  const { data } = useFirestoreDocDataOnce(ref);

  return <span>{(data as any).value}</span>;
};

const List = ({ query, removeAnimal }) => {
  const { data: animals } = useFirestoreCollectionData(query, { idField: 'id' });
  return (
    <div className="h-20 overflow-x-scroll shadow-inner m-2 border border-black">
      <ul>
        {(animals as Array<{ id: string; commonName: string }>).map(animal => (
          <li key={animal.id}>
            {animal.commonName} <button onClick={() => removeAnimal(animal.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FavoriteAnimals = props => {
  const firestore = useFirestore();
  const animalsCollection = firestore.collection('animals');
  const [isAscending, setIsAscending] = useState(true);
  const query = animalsCollection.orderBy('commonName', isAscending ? 'asc' : 'desc');
  const [startTransition, isPending] = unstable_useTransition({
    timeoutMs: 1000
  });

  const toggleSort = () => {
    startTransition(() => {
      setIsAscending(!isAscending);
    });
  };

  const addAnimal = () => {
    const possibleAnimals = ['Dog', 'Cat', 'Iguana', 'Zebra'];
    const selectedAnimal = possibleAnimals[Math.floor(Math.random() * possibleAnimals.length)];
    animalsCollection.add({ commonName: selectedAnimal });
  };

  const removeAnimal = id => animalsCollection.doc(id).delete();

  return (
    <>
      <WideButton label="Sort" onClick={toggleSort} />
      <React.Suspense fallback="loading...">
        <List query={query} removeAnimal={removeAnimal} />
      </React.Suspense>
      <WideButton
        label="Add Animal"
        onClick={() => {
          addAnimal();
        }}
      />
    </>
  );
};

export const Firestore = props => {
  return (
    <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="firestore-demo-root">
      <AuthCheck fallback="sign in to use Firestore">
        <SuspenseList revealOrder="together">
          <CardSection title="Get/Set document value">
            <SuspenseWithPerf fallback="connecting to Firestore..." traceId="firestore-demo-doc">
              <Counter />
            </SuspenseWithPerf>
          </CardSection>
          <CardSection title="Fetch data once">
            <SuspenseWithPerf fallback="connecting to Firestore..." traceId="firestore-demo-doc">
              <StaticValue />
            </SuspenseWithPerf>
          </CardSection>
          <CardSection title="Work with lists of data">
            <SuspenseWithPerf fallback="connecting to Firestore..." traceId="firestore-demo-collection">
              <FavoriteAnimals />
            </SuspenseWithPerf>
          </CardSection>
        </SuspenseList>
      </AuthCheck>
    </SuspenseWithPerf>
  );
};
