import * as React from 'react';
import {
  FirebaseAppProvider,
  preloadAuth,
  preloadAppCheck,
  preloadDatabase,
  preloadFirestore,
  preloadFirestoreDoc,
  preloadRemoteConfig,
  preloadStorage,
  preloadUser,
  useFirebaseApp
} from 'reactfire';
import { Card } from '../display/Card';
import { Auth } from './Auth';
import { Firestore } from './Firestore';
import { RealtimeDatabase } from './RealtimeDatabase';
import { RemoteConfig } from './RemoteConfig';

// Import auth directly because most components need it
// Other Firebase libraries can be lazy-loaded as-needed
import 'firebase/auth';
import { Storage } from './Storage';

const preloadSDKs = firebaseApp => {
  return Promise.all([
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        return firestore().enablePersistence();
      }
    }),
    preloadDatabase({ firebaseApp }),
    preloadStorage({
      firebaseApp,
      setup(storage) {
        return storage().setMaxUploadRetryTime(10000);
      }
    }),
    preloadAppCheck({
      firebaseApp,
      setup: async (appCheck) => {
        // Commented out to ensure example runs without error
        // appCheck().activate("/* YOUR RECAPTCHA v3 SITE KEY*/"", true);
        return appCheck()
      },
     }),
    preloadAuth({ firebaseApp }),
    preloadRemoteConfig({
      firebaseApp,
      setup(remoteConfig) {
        remoteConfig().settings = {
          minimumFetchIntervalMillis: 10000,
          fetchTimeoutMillis: 10000
        };
        return remoteConfig().fetchAndActivate();
      }
    })
  ]);
};

const preloadData = async firebaseApp => {
  const user = await preloadUser({ firebaseApp });

  if (user) {
    await preloadFirestoreDoc(firestore => firestore.doc('count/counter'), firebaseApp);
  }
};

export const AppWrapper = ({ firebaseConfig }: { firebaseConfig: { [key: string]: unknown } }) => {
  return (
    <div className="flex flex-wrap justify-around p-4">
      <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
        <App />
      </FirebaseAppProvider>
    </div>
  );
};

const App = () => {
  const firebaseApp = useFirebaseApp();

  // Kick off fetches for SDKs and data that
  // we know our components will eventually need.
  //
  // This is OPTIONAL but encouraged as part of the render-as-you-fetch pattern
  // https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense
  preloadSDKs(firebaseApp).then(() => preloadData(firebaseApp));

  return (
    <>
      <Card title="Authentication">
        <Auth />
      </Card>
      <Card title="Firestore">
        <Firestore />
      </Card>
      <Card title="Realtime Database">
        <RealtimeDatabase />
      </Card>
      <Card title="Remote Config">
        <RemoteConfig />
      </Card>
      <Card title="Storage">
        <Storage />
      </Card>
    </>
  );
};
