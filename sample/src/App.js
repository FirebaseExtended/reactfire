import React, { useState, useEffect } from 'react';
import AuthButton from './Auth';
import FirestoreCounter from './Firestore';
import Storage from './Storage';
import RealtimeDatabase from './RealtimeDatabase';
import {
  preloadFirestoreDoc,
  preloadFirestoreCollection,
  useFirebaseApp,
  preloadUser,
  preloadAuth,
  preloadFirestore,
  preloadDatabase,
  preloadStorage,
  useFirestore,
  getCache
} from 'reactfire';

const Fire = () => (
  <span role="img" aria-label="Fire">
    🔥
  </span>
);

const Card = ({ title, children }) => {
  const [mounted, setMounted] = useState(title !== 'Firestore');

  return (
    <div className="card">
      <h1>
        {title} <Fire />
        <button onClick={() => setMounted(!mounted)}>X</button>
      </h1>

      {mounted ? children : null}
    </div>
  );
};

// Our components will lazy load the
// SDKs to decrease their bundle size.
// Since we know that, we can start
// fetching them now
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
    )
      .then(() => console.log('PRELOAD COMPLETE'))
      .catch(console.error);

    // preloadFirestoreCollection(
    //   firestore => firestore.collection('animals').orderBy('commonName', 'asc'),
    //   firebaseApp
    // );
  }
};

function FirestoreMonitor() {
  const firestore = useFirestore();
  const [time, setTime] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 500);

    return () => clearInterval(interval);
  });
  let activeQueries = [];
  const queries = firestore()._firestoreClient?.eventMgr?.queries;
  const cacheKeys = Array.from(getCache().keys());

  if (queries) {
    queries.forEach(query => {
      activeQueries.push(query.path.toString());
    });
  }

  return (
    <>
      Active Firestore Queries
      <ul>
        {activeQueries.map(q => {
          return (
            <li key={q}>
              <pre>{q}</pre>
            </li>
          );
        })}
      </ul>
      Cache keys
      <ul>
        {cacheKeys.map(q => {
          const numSubs = getCache().get(q).subscribers;

          return (
            <li key={q}>
              <pre>
                <em>{numSubs}</em>: {q}
              </pre>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const App = () => {
  const firebaseApp = useFirebaseApp();

  // Kick off fetches for SDKs and data that
  // we know our components will eventually need.
  //
  // This is OPTIONAL but encouraged as part of the render-as-you-fetch pattern
  // https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense
  preloadSDKs(firebaseApp);
  preloadData(firebaseApp);

  return (
    <>
       
      <h1>
        <Fire /> ReactFire Demo <Fire />
      </h1>
      <React.Suspense fallback="">
        <FirestoreMonitor />
      </React.Suspense>
      <div className="container">
        {/* <Card title="Authentication">
          <AuthButton />
        </Card>
  */}
        {/* <Card title="Firestore">
          <FirestoreCounter />
        </Card>

        <Card title="Firestore">
          <FirestoreCounter />
        </Card> */}

        <Card title="Storage">
          <Storage />
        </Card>

        {/* <Card title="Realtime Database">
          <RealtimeDatabase />
        </Card> */}
      </div>
    </>
  );
};

export default App;
