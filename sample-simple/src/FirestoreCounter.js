import React, { Suspense } from 'react';
import { useFirestoreDoc, suspendOnDocumentReference } from 'reactfire';
import firebase from 'firebase/app';
import 'firebase/firestore';

const Counter = props => {
  const ref = firebase.firestore().doc('count/counter');

  const snapshot = useFirestoreDoc(ref);
  console.log(snapshot);
  const counterValue = snapshot.data().value;

  return (
    <>
      <button onClick={() => console.log('click')}>-</button>
      <span> {counterValue} </span>
      <button onClick={() => console.log('click')}>+</button>
    </>
  );
};

const SuspenseWrapper = props => {
  return (
    <Suspense fallback="loading...">
      <Counter />
    </Suspense>
  );
};

export default SuspenseWrapper;
