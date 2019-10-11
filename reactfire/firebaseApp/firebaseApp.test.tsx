import { cleanup, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as firebase from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { useFirebaseApp } from '.';
import { FirebaseAppProvider } from './index';

afterEach(cleanup);

describe('FirebaseAppProvider', () => {
  it('calls firebase.initializeApp with the provided config', () => {
    const config = { appId: '12345' };

    const spy = jest.spyOn(firebase, 'initializeApp');

    render(<FirebaseAppProvider firebaseConfig={config} />);
    expect(spy).toBeCalledWith(config);

    spy.mockRestore();
  });

  it('does not call firebase.initializeApp if the firebaseApp is provided', () => {
    const spy = jest.spyOn(firebase, 'initializeApp');
    const app = {};
    render(<FirebaseAppProvider firebaseApp={app} />);
    expect(spy).not.toBeCalled();

    spy.mockRestore();
  });

  it('initializes fireperf if specified', async () => {
    const mockPerf = jest.fn();
    firebase['performance' as any] = mockPerf;
    const app = { performance: mockPerf };

    render(<FirebaseAppProvider firebaseApp={app} initPerformance />);

    expect(mockPerf).toBeCalled();
  });

  it('does not initialize fireperf if not specified', async () => {
    const mockPerf = jest.fn();
    firebase['performance' as any] = mockPerf;
    const app = { performance: mockPerf };

    render(<FirebaseAppProvider firebaseApp={app} />);

    expect(mockPerf).not.toBeCalled();
  });
});

describe('useFirebaseApp', () => {
  it('finds firebase from Context', () => {
    const firebaseApp = { a: 1 };

    const wrapper = ({ children }) => (
      <FirebaseAppProvider firebaseApp={firebaseApp}>
        {children}
      </FirebaseAppProvider>
    );

    const { result } = renderHook(() => useFirebaseApp(), { wrapper });
    expect(result.error).toBeUndefined();
    expect(result.current).toBe(firebaseApp);
  });

  it('throws an error if Firebase is not in context', () => {
    const { result } = renderHook(() => useFirebaseApp());

    expect(result.error).toBeDefined();
  });
});
