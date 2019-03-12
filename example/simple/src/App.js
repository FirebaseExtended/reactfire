import React from 'react';
import AuthButton from './AuthButton';
import FirestoreCounter from './FirestoreCounter';

const App = () => {
  return (
    <>
      <h1>ReactFire Demo</h1>
      <h2>Authentication</h2>
      <AuthButton />
      <h2>Firestore</h2>
      <FirestoreCounter />
    </>
  );
};

export default App;
