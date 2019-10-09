import { act, cleanup, render, waitForElement } from '@testing-library/react';
import { performance } from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Subject } from 'rxjs';
import { SuspenseWithPerf } from '.';
import { FirebaseAppProvider } from '../firebaseApp';

const traceStart = jest.fn();
const traceEnd = jest.fn();

const createTrace = jest.fn(() => ({
  start: traceStart,
  stop: traceEnd
}));

const mockPerf = jest.fn(() => {
  return { trace: createTrace };
});

const mockFirebase = {
  performance: mockPerf
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
    await waitForElement(() => getAllByTestId('child'));

    expect(queryAllByTestId('fallback').length).toEqual(0);
    expect(queryAllByTestId('child').length).toEqual(2);

    // expect(suspense.innerHTML).toEqual('Fallback');
  });

  it('creates a trace with the correct name', () => {
    const traceName = 'trace';
    render(
      <Provider>
        <SuspenseWithPerf traceId={traceName} fallback={'loading'}>
          children
        </SuspenseWithPerf>
      </Provider>
    );

    expect(createTrace).toHaveBeenCalledWith(traceName);
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
        <SuspenseWithPerf fallback={<Fallback />} traceId="test lifecycle">
          <Comp />
        </SuspenseWithPerf>
      </Provider>
    );

    expect(getByTestId('fallback')).toBeInTheDocument();

    expect(traceStart).toHaveBeenCalledTimes(1);
    expect(traceEnd).toHaveBeenCalledTimes(0);

    act(() => o$.next('a'));
    await waitForElement(() => getByTestId('child'));
    expect(getByTestId('child')).toBeInTheDocument();

    expect(traceStart).toHaveBeenCalledTimes(1);
    expect(traceEnd).toHaveBeenCalledTimes(1);
  });

  it('can find fireperf from Context', () => {
    render(
      <Provider>
        <SuspenseWithPerf traceId={'hello'} fallback={'loading'}>
          {'children'}
        </SuspenseWithPerf>
      </Provider>
    );

    expect(mockPerf).toHaveBeenCalled();
  });

  it('can use firePerf from props', () => {
    render(
      <SuspenseWithPerf
        traceId={'hello'}
        fallback={'loading'}
        firePerf={(mockPerf() as unknown) as performance.Performance}
      >
        {'children'}
      </SuspenseWithPerf>
    );

    expect(createTrace).toHaveBeenCalled();
  });
});
