import { cleanup, render, waitFor, renderHook } from '@testing-library/react';
import { initializeApp, deleteApp, getApps } from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { useFirebaseApp, FirebaseAppProvider, version } from '../src/index';
import pkg from '../package.json';

afterEach(() => {
  cleanup();

  getApps().forEach(deleteApp);
});

const DEFAULT_APP_CONFIG = { appId: '12345' };

describe('FirebaseAppProvider', () => {
  it('Initializes an app when passed a config as props', async () => {
    expect(getApps()).toHaveLength(0);

    render(<FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG} />);

    await waitFor(() => expect(getApps().length).toEqual(1));
  });

  it('Does not initialize a new app if the firebaseApp is provided', () => {
    const app = initializeApp(DEFAULT_APP_CONFIG, 'test');
    expect(getApps()).toHaveLength(1);

    render(<FirebaseAppProvider firebaseApp={app} />);

    expect(getApps()).toHaveLength(1);
  });
});

describe('useFirebaseApp', () => {
  it('finds firebase from Context', () => {
    const firebaseApp = initializeApp(DEFAULT_APP_CONFIG, 'context-test');

    const wrapper: React.FunctionComponent<{children: React.ReactNode}> = ({ children }) => <FirebaseAppProvider firebaseApp={firebaseApp}>{children}</FirebaseAppProvider>;

    const { result } = renderHook(() => useFirebaseApp(), { wrapper });
    expect(result.current).toBe(firebaseApp);
  });

  it('can initialize more than one firebase app', async () => {
    const config = { appId: 'another-firebase-app' };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <div>
        <FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG} appName="app-1">
          {children}
        </FirebaseAppProvider>
        <FirebaseAppProvider firebaseConfig={config} appName="app-2">
          appA
        </FirebaseAppProvider>
      </div>
    );

    const { result } = renderHook(() => useFirebaseApp(), { wrapper });
    expect(result.current.name).toEqual('app-1');

    await waitFor(() => expect(getApps().length).toEqual(2));
  });

  it('will throw if configs dont match, and same name', async () => {
    const config = { appId: 'a-different-config' };

    // stop a nasty-looking console error
    // https://github.com/facebook/react/issues/11098#issuecomment-523977830
    const errorLog = vi.spyOn(console, 'error');
    errorLog.mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <div>
        <FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG}>{children}</FirebaseAppProvider>
        <FirebaseAppProvider firebaseConfig={config}>appA</FirebaseAppProvider>
      </div>
    );

    expect(() => renderHook(() => useFirebaseApp(), { wrapper })).toThrow(Error('Does not match the options already provided to the default firebase app instance, give this new instance a different appName.'))

    await waitFor(() => expect(getApps().length).toEqual(1));

    errorLog.mockRestore();
  });

  it('throws an error if Firebase is not in context', () => {
    // stop a nasty-looking console error
    // https://github.com/facebook/react/issues/11098#issuecomment-523977830
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() =>renderHook(() => useFirebaseApp())).toThrow();

    // spy.mockRestore();
  });
});

describe('reactfire version', () => {
  it(`should match version ${pkg.version}`, () => {
    expect(pkg.version).toEqual(version);
  });
});
