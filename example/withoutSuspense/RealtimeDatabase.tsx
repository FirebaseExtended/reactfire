import 'firebase/database';
import { getDatabase, ref, query, orderByChild, push, set, increment as rtdbIncrement } from 'firebase/database';
import * as React from 'react';
import { DatabaseProvider, useDatabase, useDatabaseListData, useDatabaseObjectData, useFirebaseApp, useUser } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { AuthWrapper } from './Auth';

const Counter = () => {
  const database = useDatabase();
  const counterRef = ref(database, 'counter');
  const increment = amountToIncrement => {
    return set(counterRef, rtdbIncrement(amountToIncrement));
  };

  const response = useDatabaseObjectData(counterRef);

  const { status, data: count } = response;
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {count as any} </span>
      <button onClick={() => increment(1)}>+</button>
    </>
  );
};

const AnimalsList = () => {
  const database = useDatabase();
  const animalsRef = ref(database, 'animals');
  const animalsQuery = query(animalsRef, orderByChild('commonName'));
  const { status, data: animals } = useDatabaseListData<{commonName: string, id: string}>(animalsQuery, {
    idField: 'id'
  });

  const addAnimal = () => {
    const possibleAnimals = ['Dog', 'Cat', 'Iguana', 'Zebra'];
    const selectedAnimal = possibleAnimals[Math.floor(Math.random() * possibleAnimals.length)];
    const newRef = push(animalsRef);
    set(newRef, { commonName: selectedAnimal });
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  } else if (!animals) {
    return <span>no animals found</span>
  }
  
  return (
    <>
      <div className="h-20 overflow-x-scroll shadow-inner m-2 border border-black">
        <ul>
          {animals.map(animal => (
            <li key={animal.id as string}>{animal.commonName as string}</li>
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
      <WideButton
        label="Add Animal"
        onClick={() => {
          addAnimal();
        }}
      />
    </>
  );
};

export const RealtimeDatabase = () => {
  const firebaseApp = useFirebaseApp();
  const database = getDatabase(firebaseApp);

  return (
    <DatabaseProvider sdk={database}>
      <AuthWrapper fallback={<span>Sign in to use this component</span>}>
        <CardSection title="Get/Set object value">
          <Counter />
        </CardSection>
        <CardSection title="Work with lists of data">
          <AnimalsList />
        </CardSection>
      </AuthWrapper>
    </DatabaseProvider>
  );
};
