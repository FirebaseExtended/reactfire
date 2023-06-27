import { act, cleanup, render, waitFor } from '@testing-library/react';
import { FirebaseApp } from 'firebase/app';
import { FirebasePerformance } from 'firebase/performance';
import * as React from 'react';
import { Subject } from 'rxjs';
import { FirebaseAppProvider, useObservable, SuspenseWithPerf } from '../src/index';

const traceStart = vi.fn();
const traceEnd = vi.fn();

const createTrace = vi.fn(() => ({
  start: traceStart,
  stop: traceEnd,
}));

const mockPerf = vi.fn(() => {
  return { trace: createTrace };
}) as any as () => FirebasePerformance;

const mockFirebase: FirebaseApp = {
  performance: mockPerf,
} as any;

const mark = vi.fn();
const measure = vi.fn();
const getEntriesByName = vi.fn(() => []);

Object.defineProperty(window, 'performance', {
  value: { mark, measure, getEntriesByName },
});

const PromiseThrower = () => {
  throw new Promise(() => {});
};

const Provider = ({ children }: { children: React.ReactNode }) => <FirebaseAppProvider firebaseApp={mockFirebase}>{children}</FirebaseAppProvider>;

describe('SuspenseWithPerf', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('behaves the same as Suspense (render fallback until thrown promise resolves)', async () => {
    const o$ = new Subject();

    const Fallback = () => <h1 data-testid="fallback">Fallback</h1>;

    const Comp = () => {
      useObservable('perf-test-1', o$, { suspense: true });

      return <h1 data-testid="child">Actual</h1>;
    };

    const SuspenseComp = () => {
      return (
        <React.Suspense fallback={<Fallback />}>
          <Comp />
        </React.Suspense>
      );
    };

    const SuspenseWithPerfComp = () => {
      return (
        <Provider>
          <SuspenseWithPerf fallback={<Fallback />} traceId="test">
            <Comp />
          </SuspenseWithPerf>
        </Provider>
      );
    };

    const { queryAllByTestId, getAllByTestId } = render(
      <>
        <SuspenseComp />
        <SuspenseWithPerfComp />
      </>
    );

    expect(queryAllByTestId('fallback').length).toEqual(2);
    expect(queryAllByTestId('child').length).toEqual(0);

    act(() => o$.next('a'));
    await waitFor(() => getAllByTestId('child'));

    expect(queryAllByTestId('fallback').length).toEqual(0);
    expect(queryAllByTestId('child').length).toEqual(2);
  });

  it('creates a trace with the correct name', () => {
    const traceName = 'trace';

    render(
      <Provider>
        <SuspenseWithPerf traceId={traceName} fallback={'loading'}>
          <PromiseThrower />
        </SuspenseWithPerf>
      </Provider>
    );

    expect(mark).toBeCalledWith('_traceStart[0]');
    expect(mark).toHaveBeenCalledTimes(1);
  });

  it('starts a trace when a promise is thrown and stops when it resolves', async () => {
    const o$ = new Subject();
    let shouldThrow = true;

    const promise = new Promise((resolve) => {
      o$.subscribe(() => {
        shouldThrow = false;
        resolve(true);
      });
    });

    const Fallback = () => <h1 data-testid="fallback">Fallback</h1>;

    const Comp = () => {
      if (shouldThrow) {
        throw promise;
      }

      return <h1 data-testid="child">Actual</h1>;
    };

    const { getByTestId } = render(
      <Provider>
        <SuspenseWithPerf fallback={<Fallback />} traceId="test lifecycle">
          <Comp />
        </SuspenseWithPerf>
      </Provider>
    );

    expect(getByTestId('fallback')).toBeInTheDocument();

    expect(mark).toBeCalledWith('_test lifecycleStart[0]');
    expect(mark).toHaveBeenCalledTimes(1);
    expect(measure).toHaveBeenCalledTimes(0);

    act(() => o$.next('a'));
    await waitFor(() => getByTestId('child'));
    expect(getByTestId('child')).toBeInTheDocument();

    expect(mark).toBeCalledWith('_test lifecycleEnd[0]');
    expect(mark).toHaveBeenCalledTimes(2);
    expect(measure).toHaveBeenCalledTimes(1);
    expect(measure).toHaveBeenCalledWith('test lifecycle', '_test lifecycleStart[0]', '_test lifecycleEnd[0]');
  });
});
