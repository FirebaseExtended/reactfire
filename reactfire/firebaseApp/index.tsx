import * as firebase from 'firebase/app';
import * as React from 'react';
import { preloadRequest, usePreloadedRequest } from '../useObservable';

export * from './sdk';

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
