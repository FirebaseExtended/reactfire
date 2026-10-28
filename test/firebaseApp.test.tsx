import { cleanup, render, waitFor, renderHook } from '@testing-library/react';
import * as firebaseAppModule from 'firebase/app';
import { initializeApp, deleteApp, getApps, FirebaseApp } from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { useFirebaseApp, FirebaseAppProvider, version } from '../src/index';
import pkg from '../package.json';

const _components = (firebaseAppModule as unknown as { _components: Map<string, unknown> })._components;

interface AppWithContainer extends FirebaseApp {
  container: {
    getProvider(name: 'platform-logger'): {
      getImmediate(): { getPlatformInfoString(): string };
    };
  };
}

function getPlatformInfo(app = getApps()[0]): string {
  return (app as AppWithContainer).container.getProvider('platform-logger').getImmediate().getPlatformInfoString();
}

// reactfire registers versions at import time, so start every test from a clean slate
// instead of relying on a previous test's afterEach.
beforeEach(() => {
  _components.delete('react-version');
  _components.delete('reactfire-version');
});

afterEach(() => {
  cleanup();

  getApps().forEach(deleteApp);
  _components.delete('react-version');
  _components.delete('reactfire-version');
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

  it('registers react and reactfire versions at module import time before any component renders', async () => {
    _components.delete('react-version');
    _components.delete('reactfire-version');
    expect(_components.has('react-version')).toBe(false);
    expect(_components.has('reactfire-version')).toBe(false);

    vi.resetModules();
    await import('../src/telemetry');

    const app = initializeApp(DEFAULT_APP_CONFIG, 'module-load-test');
    const info = getPlatformInfo(app);
    expect(info).toContain(`react/${React.version}`);
    expect(info).toContain(`reactfire/${version}`);
  });

  it('registers react and reactfire versions when initializing an app via firebaseConfig', () => {
    expect(_components.has('react-version')).toBe(false);
    expect(_components.has('reactfire-version')).toBe(false);

    render(<FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG} />);

    const info = getPlatformInfo();
    expect(info).toContain(`react/${React.version}`);
    expect(info).toContain(`reactfire/${version}`);
  });

  it('registers react and reactfire versions when passed an existing firebaseApp prop', () => {
    const app = initializeApp(DEFAULT_APP_CONFIG, 'test');
    expect(getPlatformInfo(app)).not.toContain(`reactfire/${version}`);

    render(<FirebaseAppProvider firebaseApp={app} />);

    const info = getPlatformInfo(app);
    expect(info).toContain(`react/${React.version}`);
    expect(info).toContain(`reactfire/${version}`);
  });

  it('registers react and reactfire versions when reusing an already-initialized app via firebaseConfig', () => {
    const app = initializeApp(DEFAULT_APP_CONFIG);
    expect(getPlatformInfo(app)).not.toContain(`reactfire/${version}`);

    render(<FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG} />);

    const info = getPlatformInfo(app);
    expect(info).toContain(`react/${React.version}`);
    expect(info).toContain(`reactfire/${version}`);
  });

  it('registers versions idempotently across multiple FirebaseAppProvider renders', () => {
    const { rerender } = render(<FirebaseAppProvider firebaseConfig={DEFAULT_APP_CONFIG} />);
    rerender(<FirebaseAppProvider firebaseApp={getApps()[0]} />);

    const tokens = getPlatformInfo().split(' ');
    expect(tokens.filter((t) => t === `react/${React.version}`)).toHaveLength(1);
    expect(tokens.filter((t) => t === `reactfire/${version}`)).toHaveLength(1);
  });
});
