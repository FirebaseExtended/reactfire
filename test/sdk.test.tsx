import { renderHook } from '@testing-library/react-hooks';
import { deleteApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { AuthProvider, FirebaseAppProvider, useAuth } from '../src/index';
import { baseConfig } from './appConfig';
import { randomString } from './test-utils';

describe('Sdk management', () => {
  afterEach(() => {
    getApps().forEach(deleteApp);
  });

  describe('SdkProvider', () => {
    it('throws if the app does not match the app in FirebaseAppProvider', () => {
      // "app" is what we'll use to initialize auth for AuthProvider,
      // but "app2" is what we'll pass to FirebaseAppProvider
      const app = initializeApp(baseConfig);
      const authInstance = getAuth(app);
      const app2 = initializeApp({ ...baseConfig, appId: randomString() }, 'app2');

      // stop a nasty-looking console error
      // https://github.com/facebook/react/issues/11098#issuecomment-523977830
      const errorLog = vi.spyOn(console, 'error');
      errorLog.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <FirebaseAppProvider firebaseApp={app2}>
            <AuthProvider sdk={authInstance}>{children}</AuthProvider>
          </FirebaseAppProvider>
        ),
      });
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual('sdk was initialized with a different firebase app');

      errorLog.mockRestore();
    });
  });

  describe('useSdk', () => {
    it('can get a provided SDK from context', () => {
      const app = initializeApp(baseConfig);
      const authInstance = getAuth(app);
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <FirebaseAppProvider firebaseApp={app}>
            <AuthProvider sdk={authInstance}>{children}</AuthProvider>
          </FirebaseAppProvider>
        ),
      });
      expect(result.current).toEqual(authInstance);
    });
  });
});
