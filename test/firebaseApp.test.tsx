import { cleanup, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as firebase from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { useFirebaseApp, FirebaseAppProvider, version } from '..';
const pkg = require('../package.json');

afterEach(() => {
  cleanup();

  // clean up the initialized firebase app so each test starts fresh
  try {
    firebase.app().delete();
  } catch (e) {
    // swallow the error - if the default app wasn't initialized in a test, app().delete() will throw
  }
});

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

    const wrapper = ({ children }: { children: React.ReactNode }) => <FirebaseAppProvider firebaseApp={firebaseApp}>{children}</FirebaseAppProvider>;

    const { result } = renderHook(() => useFirebaseApp(), { wrapper });
    expect(result.error).toBeUndefined();
    expect(result.current).toBe(firebaseApp);
  });

  it('can initialize more than one firebase app', () => {
    const config = { a: 1 };

    const initializeApp = jest.spyOn(firebase, 'initializeApp');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <div>
        <FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG}>{children}</FirebaseAppProvider>
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

    // stop a nasty-looking console error
    // https://github.com/facebook/react/issues/11098#issuecomment-523977830
    const errorLog = jest.spyOn(console, 'error');
    errorLog.mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <div>
        <FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG}>{children}</FirebaseAppProvider>
        <FirebaseAppProvider firebaseConfig={config}>appA</FirebaseAppProvider>
      </div>
    );

    try {
      renderHook(() => useFirebaseApp(), { wrapper });
      fail('expected a throw');
    } catch (e) {
      expect(e.message).toEqual(
        'Does not match the options already provided to the default firebase app instance, give this new instance a different appName.'
      );
    }

    // initializeApp should be called the first time, but not the second time
    expect(initializeApp).toBeCalledTimes(1);
    expect(initializeApp).toBeCalledWith(DEFAULT_APP_CONFIG, undefined);

    initializeApp.mockRestore();
    errorLog.mockRestore();
  });

  it('throws an error if Firebase is not in context', () => {
    // stop a nasty-looking console error
    // https://github.com/facebook/react/issues/11098#issuecomment-523977830
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    const { result } = renderHook(() => useFirebaseApp());
    expect(result.error).toBeDefined();

    spy.mockRestore();
  });
});

describe('reactfire version', () => {
  it(`should match version ${pkg.version}`, () => {
    expect(pkg.version).toEqual(version);
  });
});
