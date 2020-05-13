import * as firebase from 'firebase/app';
import * as React from 'react';

export * from './sdk';

type FirebaseAppContextValue = firebase.app.App;

// INVESTIGATE I don't like magic strings, can we have export this in js-sdk?
const DEFAULT_APP_NAME = '[DEFAULT]';

const FirebaseAppContext = React.createContext<FirebaseAppContextValue | undefined>(undefined);

const SuspenseEnabledContext = React.createContext<boolean>(undefined);

type Props = {
  firebaseApp?: firebase.app.App;
  firebaseConfig?: Object;
  appName?: string;
  suspense?: boolean;
};

const shallowEq = (a: Object, b: Object) => a == b || [...Object.keys(a), ...Object.keys(b)].every(key => a[key] == b[key]);

export function FirebaseAppProvider(props: Props & { [key: string]: unknown }) {
  const { firebaseConfig, appName, suspense } = props;

  const firebaseApp: firebase.app.App =
    props.firebaseApp ||
    React.useMemo(() => {
      const existingApp = firebase.apps.find(app => app.name == (appName || DEFAULT_APP_NAME));
      if (existingApp) {
        if (shallowEq(existingApp.options, firebaseConfig)) {
          return existingApp;
        } else {
          throw `Does not match the options already provided to the ${appName || 'default'} firebase app instance, give this new instance a different appName.`;
        }
      } else {
        return firebase.initializeApp(firebaseConfig, appName);
      }
    }, [firebaseConfig, appName]);

  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
      <SuspenseEnabledContext.Provider value={suspense ?? false} {...props} />
    </FirebaseAppContext.Provider>
  );
}

export function useIsSuspenseEnabled(): boolean {
  const suspense = React.useContext(SuspenseEnabledContext);

  if (suspense === undefined) {
    throw new Error('Cannot call useIsSuspenseEnabled unless your component is within a FirebaseAppProvider');
  }

  return suspense;
}

export function useSuspenseEnabledFromConfigAndContext(suspenseFromConfig): boolean {
  let suspenseFromContext = useIsSuspenseEnabled();

  // prioritize config over context
  if (suspenseFromConfig !== undefined) {
    return suspenseFromConfig;
  }

  return suspenseFromContext;
}

export function useFirebaseApp() {
  const firebaseApp = React.useContext(FirebaseAppContext);
  if (!firebaseApp) {
    throw new Error('Cannot call useFirebaseApp unless your component is within a FirebaseAppProvider');
  }

  return firebaseApp;
}
