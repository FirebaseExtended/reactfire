import 'firebase/database';
import * as React from 'react';
import { useState } from 'react';
import { useDatabase, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

const Counter = () => {
  const database = useDatabase();
  const ref = database.ref('counter');
  const increment = amountToIncrement => {
    ref.transaction(counterVal => {
      return counterVal + amountToIncrement;
    });
  };

  const response = useDatabaseObjectData(ref);

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
  const animalsRef = database.ref('animals');
  const animalsQuery = animalsRef.orderByChild('commonName');
  const { status, data: animals } = useDatabaseListData(animalsQuery, {
    idField: 'id'
  });

  const addAnimal = () => {
    const possibleAnimals = ['Dog', 'Cat', 'Iguana', 'Zebra'];
    const selectedAnimal = possibleAnimals[Math.floor(Math.random() * possibleAnimals.length)];
    const newRef = animalsRef.push();
    newRef.set({ commonName: selectedAnimal });
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
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
      <WideButton
        label="Add Animal"
        onClick={() => {
          addAnimal();
        }}
      />
    </>
  );
};

const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { status, data: user, hasEmitted } = useUser();

  if (!children) {
    throw new Error('Children must be provided');
  }
  if (status === 'loading' || hasEmitted === false) {
    return <LoadingSpinner />;
  } else if (user) {
    return children as JSX.Element;
  }

  return fallback;
};

export const RealtimeDatabase = () => {
  return (
    <>
      <AuthWrapper fallback={<span>Sign in to use this component</span>}>
        <CardSection title="Get/Set object value">
          <Counter />
        </CardSection>
        <CardSection title="Work with lists of data">
          <AnimalsList />
        </CardSection>
      </AuthWrapper>
    </>
  );
};
