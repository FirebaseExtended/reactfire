import { cleanup, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as firebase from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { useFirebaseApp } from '.';
import { FirebaseAppProvider } from './index';

afterEach(cleanup);

const DEFAULT_APP_CONFIG = { appId: '12345' };

describe('FirebaseAppProvider', () => {
  it('calls firebase.initializeApp with the provided config', () => {
    const spy = jest.spyOn(firebase, 'initializeApp');

    render(<FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG} />);
    expect(spy).toBeCalledWith(DEFAULT_APP_CONFIG, undefined);

    spy.mockRestore();
  });

  it('does not call firebase.initializeApp if the firebaseApp is provided', () => {
    const spy = jest.spyOn(firebase, 'initializeApp');
    const app: firebase.app.App = {} as any;
    render(<FirebaseAppProvider firebaseApp={app} />);
    expect(spy).not.toBeCalled();

    spy.mockRestore();
  });

});

describe('useFirebaseApp', () => {
  it('finds firebase from Context', () => {
    const firebaseApp: firebase.app.App = { a: 1 } as any;

    const wrapper = ({ children }) => (
      <FirebaseAppProvider firebaseApp={firebaseApp}>
        {children}
      </FirebaseAppProvider>
    );

    const { result } = renderHook(() => useFirebaseApp(), { wrapper });
    expect(result.error).toBeUndefined();
    expect(result.current).toBe(firebaseApp);
  });

  it('can initialize more than one firebase app', () => {
    const config = { a: 1 };

    const initializeApp = jest.spyOn(firebase, 'initializeApp');

    const wrapper = ({ children }) => (
      <div>
        <FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG}>
          {children}
        </FirebaseAppProvider>
        <FirebaseAppProvider firebaseConfig={config} appName="app-2">
          appA
        </FirebaseAppProvider>
      </div>
    );

    const { result } = renderHook(() => useFirebaseApp(), { wrapper });

    expect(initializeApp).toBeCalledWith(config, 'app-2');
    initializeApp.mockRestore();

    expect(result.error).toBeUndefined();
  });

  it('will throw if configs dont match, and same name', () => {
    const config = { a: 1 };

    const initializeApp = jest.spyOn(firebase, 'initializeApp');

    const wrapper = ({ children }) => (
      <div>
        <FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG}>
          {children}
        </FirebaseAppProvider>
        <FirebaseAppProvider firebaseConfig={config}>appA</FirebaseAppProvider>
      </div>
    );

    try {
      const { result } = renderHook(() => useFirebaseApp(), { wrapper });
      fail('expected a throw');
    } catch (e) {
      expect(e).toEqual(
        'Does not match the options already provided to the default firebase app instance, give this new instance a different appName.'
      );
    }

    expect(initializeApp).not.toBeCalled();
    initializeApp.mockRestore();
  });

  it('throws an error if Firebase is not in context', () => {
    const { result } = renderHook(() => useFirebaseApp());

    expect(result.error).toBeDefined();
  });
});
