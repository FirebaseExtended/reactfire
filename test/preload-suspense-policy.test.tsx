import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Observable, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { preloadObservable, useObservable } from '../src/index';

// A preload helper cannot read the Suspense context, so it creates its entry with Suspense off.
// Once a Suspense-mode hook reads that entry, a first-load error must stay cached like a hook-created
// entry's: evicting it lets a later Suspense read suspend and refetch instead of reaching the boundary.
describe('preload-created entry read by a Suspense hook', () => {
  afterEach(() => cleanup());

  class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
    state: { error: Error | null } = { error: null };
    static getDerivedStateFromError(error: Error) {
      return { error };
    }
    render() {
      return this.state.error ? <div data-testid="err">{this.state.error.message}</div> : this.props.children;
    }
  }

  // readDelay 0: the hook reads before the error arrives. 200: the error arrives first and the 1s timer is already running.
  for (const readDelay of [0, 200]) {
    it(`keeps a first-load error cached past the 1s eviction (Suspense read after ${readDelay}ms)`, async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        let subscriptions = 0;
        const source$ = new Observable<string>((subscriber) => {
          subscriptions++;
          return timer(50)
            .pipe(mergeMap(() => throwError(() => new Error('permission-denied'))))
            .subscribe(subscriber);
        });
        const observableId = `preload-suspense-${readDelay}-${Math.random()}`;

        preloadObservable(source$, observableId);
        await new Promise((resolve) => setTimeout(resolve, readDelay));

        const Obs = () => {
          const { data } = useObservable(observableId, source$, { suspense: true });
          return <div data-testid="val">{data}</div>;
        };
        const tree = () => (
          <Boundary>
            <React.Suspense fallback={<div data-testid="fallback">loading</div>}>
              <Obs />
            </React.Suspense>
          </Boundary>
        );

        const first = render(tree());
        await waitFor(() => expect(first.getByTestId('err')).toHaveTextContent('permission-denied'));
        first.unmount();

        await new Promise((resolve) => setTimeout(resolve, 1300));

        const second = render(tree());
        expect(second.queryByTestId('fallback')).toBeNull();
        expect(second.getByTestId('err')).toHaveTextContent('permission-denied');
        expect(subscriptions).toBe(1);
      } finally {
        consoleError.mockRestore();
      }
    }, 10000);
  }
});
