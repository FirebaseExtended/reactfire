import * as React from 'react';
import { useEffect, useState, useTransition, SuspenseList } from 'react';
import {
  FirestoreProvider,
  SuspenseWithPerf,
  useFirebaseApp,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useFirestoreDocDataOnce,
  useInitFirestore,
} from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { AuthWrapper } from './Auth';
import { initializeFirestore, doc, collection, enableIndexedDbPersistence, increment, updateDoc, orderBy, query, addDoc, deleteDoc, getFirestore } from 'firebase/firestore';

const Counter = () => {
  const firestore = useFirestore();

  const ref = doc(firestore, 'count', 'counter');

  const incrementCounter = (amountToIncrement) => {
    updateDoc(ref, {
      value: increment(amountToIncrement),
    });
  };

  const { data: count } = useFirestoreDocData(ref);

  return (
    <>
      <button onClick={() => incrementCounter(-1)}>-</button>
      <span> {(count as any).value} </span>
      <button onClick={() => incrementCounter(1)}>+</button>
    </>
  );
};

const StaticValue = () => {
  const firestore = useFirestore();

  const ref = doc(firestore, 'count/counter');

  const { data } = useFirestoreDocDataOnce(ref);

  return <span>{(data as any).value}</span>;
};

const List = ({ query, removeAnimal }) => {
  const { data: animals } = useFirestoreCollectionData(query, { idField: 'id' });
  return (
    <>
      <div className="h-20 overflow-x-scroll shadow-inner m-2 border border-black">
        <ul>
          {(animals as Array<{ id: string; commonName: string }>).map((animal) => (
            <li key={animal.id}>
              {animal.commonName} <button onClick={() => removeAnimal(animal.id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {Array.from(
          animals.reduce((animalCountMap, animal) => {
            const currentCount = animalCountMap.get(animal.commonName) ?? 0;
            return animalCountMap.set(animal.commonName, currentCount + 1);
          }, new Map<string, number>())
        ).map((animalStat: [string, number]) => {
          const [animalName, animalCount] = animalStat;
          return (
            <li key={animalName}>
              {animalName}: {animalCount}
            </li>
          );
        })}
      </ul>
    </>
  );
};

const FavoriteAnimals = (props) => {
  const firestore = useFirestore();
  const animalsCollection = collection(firestore, 'animals');
  const [isAscending, setIsAscending] = useState(true);
  const animalsQuery = query(animalsCollection, orderBy('commonName', isAscending ? 'asc' : 'desc'));
  const [isPending, startTransition] = useTransition();

  const toggleSort = () => {
    startTransition(() => {
      setIsAscending(!isAscending);
    });
  };

  const addAnimal = () => {
    const possibleAnimals = ['Dog', 'Cat', 'Iguana', 'Zebra'];
    const selectedAnimal = possibleAnimals[Math.floor(Math.random() * possibleAnimals.length)];
    addDoc(animalsCollection, { commonName: selectedAnimal });
  };

  const removeAnimal = (id) => deleteDoc(doc(animalsCollection, id));

  return (
    <>
      <WideButton label="Sort" onClick={toggleSort} />
      <React.Suspense fallback="loading...">
        <List query={animalsQuery} removeAnimal={removeAnimal} />
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


function FirestoreWrapper({ children }) {
  const app = useFirebaseApp()
  console.debug(performance.now(), "Wrapper called")
  return <FirestoreProvider sdk={getFirestore(app)}>{children}</FirestoreProvider>;
}
export const Firestore = (props) => {
  // Ensure this is called outside of the firestore wrapper.
  // Otherwise children will recall wrapper and spitout errors
  useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    console.debug(performance.now(), "Initialized Firestore")
    await enableIndexedDbPersistence(db);
    return db;
  }, { suspense: false });
  return (
    <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="firestore-demo-root">
      <FirestoreWrapper>
        <AuthWrapper fallback={<span>sign in to use Firestore</span>}>
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
        </AuthWrapper>
      </FirestoreWrapper>
    </SuspenseWithPerf>
  );
};
