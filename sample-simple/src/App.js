import React from 'react';
import AuthButton from './Auth';
import FirestoreCounter from './Firestore';
import Storage from './Storage';
import RealtimeDatabase from './RealtimeDatabase';
import { preloadFirestoreDoc, useFirebaseApp } from 'reactfire';

const Fire = () => (
  <span role="img" aria-label="Fire">
    🔥
  </span>
);

const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h1>
        {title} <Fire />
      </h1>
      {children}
    </div>
  );
};

const App = () => {
  preloadFirestoreDoc(
    firestore => firestore.doc('count/counter'),
    useFirebaseApp()
  );

  return (
    <>
      <h1>
        <Fire /> ReactFire Demo <Fire />
      </h1>
      <div className="container">
        <Card title="Authentication">
          <AuthButton />
        </Card>

        <Card title="Firestore">
          <FirestoreCounter />
        </Card>

        <Card title="Storage">
          <Storage />
        </Card>

        <Card title="Realtime Database">
          <RealtimeDatabase />
        </Card>
      </div>
    </>
  );
};

export default App;
