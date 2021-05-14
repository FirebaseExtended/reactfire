import '@testing-library/jest-dom/extend-expect';
import { render, act } from '@testing-library/react';
import firebase from 'firebase/app';
import * as React from 'react';
import { FirebaseAppProvider, preloadFirestore, useFirestore } from '..';

describe('Preload SDK', () => {
  let app: firebase.app.App;

  beforeAll(async () => {
    app = firebase.initializeApp(
      {
        apiKey: 'AIzaSyBg3u1sJlyJwQCE95oSDH_mtLABS-is8ZM',
        authDomain: 'rxfire-525a3.firebaseapp.com',
        databaseURL: 'http://localhost:9000?ns=rxfire-525a3',
        projectId: 'rxfire-525a3',
        storageBucket: 'rxfire-525a3.appspot.com',
        messagingSenderId: '844180061847',
        appId: '1:844180061847:web:400f7142e2d1aaeb'
      },
      'preloadsdk-test-suite'
    );

    // app.firestore().settings({
    //   host: 'localhost:8080',
    //   ssl: false
    // });
  });

  describe('useFirestore', () => {
    it.only('awaits the preloadFirestore setup', async () => {
      let preloadResolved = false;
      let preloadResolve: (v?: unknown) => void;

      preloadFirestore({
        firebaseApp: app,
        setup: () => new Promise(resolve => (preloadResolve = resolve))
      }).then(() => {
        preloadResolved = true;
        console.log('RESOLVED');
      });

      const Firestore = () => {
        // @ts-ignore: It's ok that `firestore` is unused here
        const firestore = useFirestore(); // eslint-disable-line @typescript-eslint/no-unused-vars

        expect(preloadResolved).toEqual(true);

        return <div data-testid="success"></div>;
      };

      const { findByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <Firestore />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await findByTestId('fallback');
      expect(preloadResolved).toEqual(false);

      await findByTestId('success')
        .then(() => fail('expected throw'))
        .catch(() => {});
      expect(preloadResolved).toEqual(false);

      // @ts-ignore: "used before assigned" doesn't apply here because we shouldn't get here until resolve is set
      act(() => preloadResolve());

      await findByTestId('success');
      expect(preloadResolved).toEqual(true);
    });
  });
});
