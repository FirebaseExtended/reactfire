import * as firebase from 'firebase/app';
import * as React from 'react';

export * from './sdk';

type FirebaseAppContextValue = firebase.app.App;

// INVESTIGATE I don't like magic strings, can we have export this in js-sdk?
const DEFAULT_APP_NAME = '[DEFAULT]';

const FirebaseAppContext = React.createContext<
  FirebaseAppContextValue | undefined
>(undefined);

type Props = {
  initPerformance?: boolean;
  firebaseApp?: firebase.app.App;
  firebaseConfig?: Object;
  appName?: string;
};

const shallowEq = (a: Object, b: Object) =>
  a == b ||
  [...Object.keys(a), ...Object.keys(b)].every(key => a[key] == b[key]);

export function FirebaseAppProvider(props: Props & { [key: string]: unknown }) {
  const { firebaseConfig, appName, initPerformance = false } = props;
  const firebaseApp: firebase.app.App =
    props.firebaseApp ||
    React.useMemo(() => {
      const existingApp = firebase.apps.find(
        app => app.name == (appName || DEFAULT_APP_NAME)
      );
      if (existingApp) {
        if (shallowEq(existingApp.options, firebaseConfig)) {
          return existingApp;
        } else {
          throw `Does not match the options already provided to the ${appName ||
            'default'} firebase app instance, give this new instance a different appName.`;
        }
      } else {
        return firebase.initializeApp(firebaseConfig, appName);
      }
    }, [firebaseConfig, appName]);

  React.useMemo(() => {
    if (initPerformance === true) {
      if (firebaseApp.performance) {
        // initialize Performance Monitoring
        firebaseApp.performance();
      } else {
        throw new Error(
          'firebase.performance not found. Did you forget to import it?'
        );
      }
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
