import React from 'react';
import AuthButton from './Auth';
import FirestoreCounter from './Firestore';

const Fire = () => (
  <span role="img" aria-label="Fire">
    🔥
  </span>
);

const App = () => {
  return (
    <>
      <h1>
        <Fire /> ReactFire Demo <Fire />
      </h1>
      <h2>
        <Fire /> Authentication
      </h2>
      <AuthButton />
      <h2>
        <Fire /> Firestore
      </h2>
      <FirestoreCounter />
    </>
  );
};

export default App;
