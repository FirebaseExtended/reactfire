import React from 'react';
import AuthButton from './Auth';
import FirestoreCounter from './Firestore';
import Storage from './Storage';
import RealtimeDatabase from './RealtimeDatabase';
import {
  preloadFirestoreDoc,
  useFirebaseApp,
  preloadUser,
  preloadAuth,
  preloadFirestore,
  preloadDatabase,
  preloadStorage
} from 'reactfire';

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

const preloadSDKs = firebaseApp => {
  return Promise.all([
    preloadFirestore(firebaseApp),
    preloadDatabase(firebaseApp),
    preloadStorage(firebaseApp),
    preloadAuth(firebaseApp)
  ]);
};

const preloadData = async firebaseApp => {
  const user = await preloadUser(firebaseApp);

  if (user) {
    preloadFirestoreDoc(
      firestore => firestore.doc('count/counter'),
      firebaseApp
    );
  }
};

const App = () => {
  const firebaseApp = useFirebaseApp();

  // kick off stuff we know our components will eventually need
  preloadSDKs(firebaseApp).then(preloadData(firebaseApp));

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
