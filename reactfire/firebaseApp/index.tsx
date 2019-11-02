import * as firebase from 'firebase/app';
import * as React from 'react';
import { concat, from } from 'rxjs';
import {
  preloadObservable,
  preloadRequest,
  usePreloadedRequest
} from '../useObservable';

type FirebaseAppContextValue = firebase.app.App;

const FirebaseAppContext = React.createContext<
  FirebaseAppContextValue | undefined
>(undefined);

export function FirebaseAppProvider(props) {
  const { firebaseConfig, initPerformance } = props;
  let { firebaseApp } = props;
  firebaseApp =
    firebaseApp ||
    React.useMemo(() => {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      return firebase;
    }, [firebaseConfig]);

  React.useMemo(() => {
    if (initPerformance === true && !!firebase.apps.length) {
      // initialize Performance Monitoring
      firebase.performance();
    }
  }, [initPerformance, firebaseApp]);

  return <FirebaseAppContext.Provider value={firebaseApp} {...props} />;
}

export function useFirebaseApp() {
  const firebaseApp = React.useContext(FirebaseAppContext);
  if (!firebaseApp) {
    throw new Error(
      'Cannot call useFirebaseApp unless your component is within a FirebaseAppProvider'
    );
  }

  return firebaseApp;
}

export enum SDK {
  AUTH = 'auth',
  DATABASE = 'database',
  FIRESTORE = 'firestore',
  STORAGE = 'storage',
  PERFORMANCE = 'performance'
}

export function useSDK(sdk: SDK, firebaseApp?: firebase.app.App) {
  firebaseApp = firebaseApp || useFirebaseApp();

  // use the request cache so we don't issue multiple fetches for the sdk
  const result = preloadRequest(
    () => fetchSDK(sdk, firebaseApp),
    `firebase-sdk-${sdk}`
  );

  return usePreloadedRequest(result);
}

export function fetchSDK(
  sdk: SDK,
  firebaseApp: firebase.app.App
): Promise<
  () =>
    | firebase.firestore.Firestore
    | firebase.auth.Auth
    | firebase.database.Database
    | firebase.storage.Storage
    | firebase.performance.Performance
> {
  let sdkPromise;
  if (firebaseApp[sdk]) {
    sdkPromise = Promise.resolve(firebaseApp[sdk]);
  } else {
    switch (sdk) {
      case SDK.FIRESTORE:
        sdkPromise = import('firebase/firestore');
        break;
      case SDK.DATABASE:
        sdkPromise = import('firebase/database');
        break;
      case SDK.AUTH:
        sdkPromise = import('firebase/auth');
        break;
      case SDK.STORAGE:
        sdkPromise = import('firebase/storage');
        break;
      case SDK.PERFORMANCE:
        sdkPromise = import('firebase/performance');
        break;
    }
    sdkPromise = sdkPromise.then(() => firebaseApp[sdk]).catch(console.log);
  }
  return sdkPromise;
}
