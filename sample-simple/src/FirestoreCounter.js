import React, { Suspense } from 'react';
import { useFirestoreDoc, useUser } from 'reactfire';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Counter = props => {
  const ref = firebase.firestore().doc('count/counter');

  const increment = amountToIncrement => {
    ref.update({
      value: firebase.firestore.FieldValue.increment(amountToIncrement)
    });
  };

  const snapshot = useFirestoreDoc(ref);
  console.log(snapshot);
  const counterValue = snapshot.data().value;

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {counterValue} </span>
      <button onClick={() => increment(1)}>+</button>
    </>
  );
};

const AuthCheck = props => {
  const user = useUser(firebase.auth());
  if (!user) {
    return props.fallback;
  } else {
    return props.children;
  }
};

const SuspenseWrapper = props => {
  return (
    <Suspense fallback="loading...">
      <AuthCheck fallback="sign in to use Firestore">
        <Counter />
      </AuthCheck>
    </Suspense>
  );
};

export default SuspenseWrapper;
