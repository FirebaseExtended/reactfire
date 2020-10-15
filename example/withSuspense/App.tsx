import * as React from 'react';
import {
  FirebaseAppProvider,
  preloadDatabase,
  preloadFirestore,
  useDatabase,
  useDatabaseListData,
  useFirebaseApp,
  useFirestore,
  useFirestoreCollectionData
} from 'reactfire';
import { useEffect, useState } from 'react';

const AnimalsList = () => {
  const firestore = useFirestore();
  const { status, data: animals } = useFirestoreCollectionData(firestore.collection('animals'), { idField: 'id' });

  if (status === 'loading') {
    return <span>Loading animals...</span>;
  }

  return (
    <ul>
      {animals.map(animal => (
        <li key={animal.id as string}>{animal.commonName as string}</li>
      ))}
    </ul>
  );
};

const ReadDB = () => {
  const firebaseApp = useFirebaseApp();
  const [database, setDatabase] = useState<firebase.firestore.Firestore | undefined>(undefined);
  useEffect(() => {
    preloadFirestore({
      firebaseApp: firebaseApp,
      setup: async firestore => {
        return firestore().enablePersistence();
      }
    });
  }, []);

  if (!database) {
    return <span>Loading...</span>;
  }

  return <AnimalsList />;
};

export const App = ({ firebaseConfig }: { firebaseConfig: { [key: string]: unknown } }) => {
  return (
    <div className="flex">
      <FirebaseAppProvider
        firebaseConfig={{
          apiKey: 'AIzaSyBg3u1sJlyJwQCE95oSDH_mtLABS-is8ZM',
          authDomain: 'rxfire-525a3.firebaseapp.com',
          databaseURL: 'https://rxfire-525a3.firebaseio.com',
          projectId: 'rxfire-525a3',
          storageBucket: 'rxfire-525a3.appspot.com',
          messagingSenderId: '844180061847',
          appId: '1:844180061847:web:400f7142e2d1aaeb'
        }}
        suspense={true}
      >
        <div className="max-w-sm w-full">
          <div className="h-48 bg-blue-100">
            <h2>Firestore</h2>
          </div>
          <div>
            <ul>
              <li>hello</li>
              <li>world</li>
            </ul>
          </div>
          {/* <ReadDB /> */}
        </div>
      </FirebaseAppProvider>
    </div>
  );
};
