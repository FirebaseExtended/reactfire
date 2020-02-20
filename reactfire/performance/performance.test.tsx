import { act, cleanup, render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Subject } from 'rxjs';
import { SuspenseWithPerf } from '.';
import { FirebaseAppProvider, useObservable } from '..';

const traceStart = jest.fn();
const traceEnd = jest.fn();

const createTrace = jest.fn(() => ({
  start: traceStart,
  stop: traceEnd
}));

const mockPerf = (jest.fn(() => {
  return { trace: createTrace };
}) as any) as () => firebase.performance.Performance;

const mockFirebase: firebase.app.App = {
  performance: mockPerf
} as any;

const mark = jest.fn();
const measure = jest.fn();

window.performance.mark = mark;
window.performance.measure = measure;

const PromiseThrower = () => {
  throw new Promise((resolve, reject) => {});
  return <h1>Hello world</h1>;
};

const Provider = ({ children }) => (
  <FirebaseAppProvider firebaseApp={mockFirebase}>
    {children}
  </FirebaseAppProvider>
);

describe('SuspenseWithPerf', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('behaves the same as Suspense (render fallback until thrown promise resolves)', async () => {
    const o$ = new Subject();

    const Fallback = () => <h1 data-testid="fallback">Fallback</h1>;

    const Comp = () => {
      useObservable(o$, 'perf-test-1');

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
          <SuspenseWithPerf
            fallback={<Fallback />}
            traceId="test"
            firePerf={mockPerf()}
          >
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
    await waitForElement(() => getAllByTestId('child'));

    expect(queryAllByTestId('fallback').length).toEqual(0);
    expect(queryAllByTestId('child').length).toEqual(2);
  });

  it('creates a trace with the correct name', () => {
    const traceName = 'trace';

    render(
      <Provider>
        <SuspenseWithPerf
          traceId={traceName}
          fallback={'loading'}
          firePerf={mockPerf()}
        >
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

    const promise = new Promise((resolve, reject) => {
      o$.subscribe(() => {
        shouldThrow = false;
        resolve();
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
        <SuspenseWithPerf
          fallback={<Fallback />}
          traceId="test lifecycle"
          firePerf={mockPerf()}
        >
          <Comp />
        </SuspenseWithPerf>
      </Provider>
    );

    expect(getByTestId('fallback')).toBeInTheDocument();

    expect(mark).toBeCalledWith('_test lifecycleStart[0]');
    expect(mark).toHaveBeenCalledTimes(1);
    expect(measure).toHaveBeenCalledTimes(0);

    act(() => o$.next('a'));
    await waitForElement(() => getByTestId('child'));
    expect(getByTestId('child')).toBeInTheDocument();

    expect(mark).toBeCalledWith('_test lifecycleEnd[0]');
    expect(mark).toHaveBeenCalledTimes(2);
    expect(measure).toHaveBeenCalledTimes(1);
    expect(measure).toHaveBeenCalledWith(
      'test lifecycle',
      '_test lifecycleStart[0]',
      '_test lifecycleEnd[0]'
    );
  });

  it.todo('can find fireperf from Context');
  /*
  it('can find fireperf from Context', () => {
    render(
      <Provider>
        <SuspenseWithPerf traceId={'hello'} fallback={'loading'}>
          <PromiseThrower />
        </SuspenseWithPerf>
      </Provider>
    );

    expect(mockPerf).toHaveBeenCalled();
  });
*/
});
