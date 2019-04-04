import React from 'react';
import AuthButton from './Auth';
import FirestoreCounter from './Firestore';
import Storage from './Storage';

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
      </div>
    </>
  );
};

export default App;
