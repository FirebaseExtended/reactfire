import * as firebase from 'firebase/app';
import * as React from 'react';

type FirebaseAppContextValue = firebase.app.App;

const FirebaseAppContext = React.createContext<
  FirebaseAppContextValue | undefined
>(undefined);

export function FirebaseAppProvider(props) {
  const { firebaseConfig, initPerformance } = props;
  // const [firebaseApp, setFirebaseApp] = React.useState(null);

  const value = React.useMemo(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);

      if (initPerformance === true) {
        // initialize Performance Monitoring
        firebase.performance();
      }
    }

    return firebase;
  }, [firebaseConfig]);

  return <FirebaseAppContext.Provider value={value} {...props} />;
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
