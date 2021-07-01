import '@testing-library/jest-dom/extend-expect';
import { act as actOnHook, renderHook } from '@testing-library/react-hooks';
import firebase from 'firebase/app';
import { FirebaseAppProvider, preloadFirestore, useFirestore } from '..';
import * as React from 'react';

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
        appId: '1:844180061847:web:400f7142e2d1aaeb',
      },
      'preloadsdk-test-suite'
    );

    // app.firestore().settings({
    //   host: 'localhost:8080',
    //   ssl: false
    // });
  });

  describe('useFirestore', () => {
    it('awaits the preloadFirestore setup', async () => {
      let resolver: Function;
      const promise = new Promise((res) => {
        resolver = res;
      });

      const preloadPromise = preloadFirestore({
        firebaseApp: app,
        setup: async () => {
          await promise;
        },
      });

      const { result, waitFor } = renderHook(() => useFirestore(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <FirebaseAppProvider firebaseApp={app} suspense={true}>
            {children}
          </FirebaseAppProvider>
        ),
      });

      // Even though Firestore is available, useFirestore
      // shouldn't return until the setup function resolvess
      await waitFor(() => !!app.firestore);
      expect(result.current).toBe(undefined);

      actOnHook(() => resolver());
      await preloadPromise;
      await waitFor(() => {
        if (result.all.length > 0) {
          return true;
        } else {
          return false;
        }
      });

      expect(result.current).toBeDefined();
    });
  });
});
