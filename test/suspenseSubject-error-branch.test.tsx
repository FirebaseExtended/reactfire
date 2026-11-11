import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { concat, EmptyError, lastValueFrom, Observable, of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { preloadObservable, useObservable } from '../src/index';

// `catchError(() => EMPTY)` turns a source error into a completion. `_subscribeToStore` reports it to
// `useObservable` without completing, because completing auto-unsubscribes the mounted subscriber and a
// mounted hook with `initialData` then resubscribes in a loop. `_subscribe` completes a direct subscriber.
describe('SuspenseSubject source errors', () => {
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

  it('surfaces a source error to a mounted initialData hook once, without resubscribing', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      let subscriptions = 0;
      const source$ = new Observable<string>((subscriber) => {
        subscriptions++;
        return timer(50)
          .pipe(mergeMap(() => throwError(() => new Error('permission-denied'))))
          .subscribe(subscriber);
      });
      const observableId = `error-branch-${Math.random()}`;

      const Obs = () => {
        const { data } = useObservable(observableId, source$, { initialData: 'seed' });
        return <div data-testid="val">{data}</div>;
      };

      const { getByTestId } = render(
        <Boundary>
          <Obs />
        </Boundary>
      );
      expect(getByTestId('val')).toHaveTextContent('seed');

      await waitFor(() => expect(getByTestId('err')).toHaveTextContent('permission-denied'));
      // Give a resubscribe loop time to show itself.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      expect(subscriptions).toBe(1);
    } finally {
      consoleError.mockRestore();
    }
  }, 10000);

  // A direct subscriber of a `preload*` result completes, as in 4.3.0.
  it('completes a direct subscriber of a preloaded observable when the source errors', async () => {
    const source$ = timer(50).pipe(mergeMap(() => throwError(() => new Error('permission-denied'))));
    const preloaded$ = preloadObservable(source$, `error-branch-direct-${Math.random()}`);

    const events: string[] = [];
    const observer = {
      next: (value: unknown) => events.push(`next:${String(value)}`),
      error: () => events.push('error'),
      complete: () => events.push('complete'),
    };

    preloaded$.subscribe(observer);
    await waitFor(() => expect(events).toEqual(['complete']));

    // A subscriber that arrives after the error completes too.
    events.length = 0;
    preloaded$.subscribe(observer);
    expect(events).toEqual(['complete']);
    await expect(lastValueFrom(preloaded$)).rejects.toBeInstanceOf(EmptyError);
  });

  it('delivers a value to a direct subscriber before completing it on a later error', async () => {
    const source$ = concat(of('first'), timer(50).pipe(mergeMap(() => throwError(() => new Error('permission-denied')))));
    const events: string[] = [];
    preloadObservable(source$, `error-branch-value-${Math.random()}`).subscribe({
      next: (value) => events.push(`next:${String(value)}`),
      error: () => events.push('error'),
      complete: () => events.push('complete'),
    });

    await waitFor(() => expect(events).toEqual(['next:first', 'complete']));
  });

  it('keeps the errored entry for a suspended reader when a direct subscriber completes', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      let subscriptions = 0;
      const source$ = new Observable<string>((subscriber) => {
        subscriptions++;
        return timer(50)
          .pipe(mergeMap(() => throwError(() => new Error('permission-denied'))))
          .subscribe(subscriber);
      });
      const observableId = `error-branch-render-${Math.random()}`;

      const Reader = () => {
        void lastValueFrom(preloadObservable(source$, observableId)).catch(() => undefined);
        const { data } = useObservable(observableId, source$, { suspense: true });
        return <div data-testid="val">{data}</div>;
      };

      const { getByTestId } = render(
        <Boundary>
          <React.Suspense fallback={<div data-testid="fallback" />}>
            <Reader />
          </React.Suspense>
        </Boundary>
      );

      await waitFor(() => expect(getByTestId('err')).toHaveTextContent('permission-denied'));
      expect(subscriptions).toBe(1);
    } finally {
      consoleError.mockRestore();
    }
  });
});
