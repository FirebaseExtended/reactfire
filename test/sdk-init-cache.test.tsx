import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, waitFor } from '@testing-library/react';
import { deleteApp, getApps, initializeApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import * as React from 'react';
import { FirebaseAppProvider, useInitFirestore } from '../src/index';
import { baseConfig } from './appConfig';

// SDK initializers have side effects that can only run once per app (Firestore persistence
// rejects a second `initializeFirestore`). The initialized SDK must outlive the observable
// cache entry, which the 30s warm-up release can evict while a Suspense boundary never commits.
describe('useInit* initializer', () => {
  afterEach(async () => {
    cleanup();
    await Promise.all(getApps().map((app) => deleteApp(app)));
  });

  class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
    state: { error: Error | null } = { error: null };
    static getDerivedStateFromError(error: Error) {
      return { error };
    }
    render() {
      return this.state.error ? <div data-testid="err">{this.state.error.message}</div> : this.props.children;
    }
  }

  it('does not run again after the warm-up release while a sibling keeps the boundary suspended', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const app = initializeApp(baseConfig, `init-cache-${Math.random()}`);
      let calls = 0;
      const initializer = async () => {
        calls++;
        if (calls > 1) {
          throw new Error('Firestore has already been started');
        }
        return { app } as unknown as Firestore;
      };

      const Init = () => {
        useInitFirestore(initializer, { suspense: true });
        return <div data-testid="ready">ready</div>;
      };
      const never = new Promise<void>(() => {});
      const Forever = () => {
        throw never;
      };

      const first = render(
        <FirebaseAppProvider firebaseApp={app}>
          <Boundary>
            <React.Suspense fallback={<div data-testid="fallback">loading</div>}>
              <Init />
              <Forever />
            </React.Suspense>
          </Boundary>
        </FirebaseAppProvider>
      );
      expect(first.getByTestId('fallback')).toBeInTheDocument();
      // Past the 30s warm-up release; the boundary never committed, so nothing subscribed.
      await new Promise((resolve) => setTimeout(resolve, 31_500));
      first.unmount();

      const second = render(
        <FirebaseAppProvider firebaseApp={app}>
          <Boundary>
            <React.Suspense fallback={<div data-testid="fallback">loading</div>}>
              <Init />
            </React.Suspense>
          </Boundary>
        </FirebaseAppProvider>
      );
      await waitFor(() => expect(second.queryByTestId('ready') ?? second.queryByTestId('err')).not.toBeNull());
      expect(second.queryByTestId('err')).toBeNull();
      expect(second.getByTestId('ready')).toBeInTheDocument();
      expect(calls).toBe(1);
    } finally {
      consoleError.mockRestore();
    }
  }, 45_000);
});
