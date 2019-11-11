import { act, cleanup, render, waitForElement } from '@testing-library/react';
import { performance } from 'firebase/app';
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

const mockPerf = jest.fn(() => {
  return { trace: createTrace };
});

const mockFirebase = {
  performance: mockPerf
};

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
      useObservable(o$, 'test');

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
          <PromiseThrower />
        </SuspenseWithPerf>
      </Provider>
    );

    expect(mockPerf).toHaveBeenCalled();
  });

  it('can use firePerf from props', () => {
    const propPerf = mockPerf();
    propPerf.trace = jest.fn(() => ({
      start: traceStart,
      stop: traceEnd
    }));
    render(
      <SuspenseWithPerf
        traceId={'hello'}
        fallback={'loading'}
        firePerf={(propPerf as unknown) as performance.Performance}
      >
        <PromiseThrower />
      </SuspenseWithPerf>
    );

    // call the createTrace provided, not the one in context
    expect(propPerf.trace).toHaveBeenCalled();
    expect(createTrace).not.toHaveBeenCalled();
  });

  it('Does not reuse a trace object', async () => {
    // traces throw if you call start() twice,
    // even if you've called stop() in between:
    // https://github.com/firebase/firebase-js-sdk/blob/dd098c6a87f23ddf54a7f9b21b87f7bb3fd56bdd/packages/performance/src/resources/trace.test.ts#L52
    //
    // this test covers the scenario where a component
    // is rendered, and uses suspenseWithPerf, is then
    // hidden, and then re-rendered, triggering another
    // suspenseWithPerf
    //
    // I ran into this when I loaded a site while logged
    // in, rendering a component that used a reactfire hook,
    // then logged out, hiding that component. When I logged
    // back in without reloading the page, perfmon threw an error
    // because SuspenseWithPerf tried to reuse a trace.

    const o$ = new Subject();

    const Comp = () => {
      const val = useObservable(o$, 'test');

      if (val === 'throw') {
        throw new Promise(() => {});
      }

      return <h1 data-testid="child">Actual</h1>;
    };

    const Component = () => {
      return (
        <SuspenseWithPerf
          traceId={'hello'}
          fallback={'loading'}
          firePerf={(mockPerf() as unknown) as performance.Performance}
        >
          <Comp />
        </SuspenseWithPerf>
      );
    };

    // render SuspenseWithPerf and go through normal trace start -> trace stop
    const { getByTestId, rerender } = render(<Component />);
    expect(createTrace).toHaveBeenCalledTimes(1);
    act(() => o$.next('some value'));
    await waitForElement(() => getByTestId('child'));

    // this is a magic value that will cause the child to throw a Promise again
    act(() => o$.next('throw'));

    // if createTrace is only called once, the firebase SDK will throw
    expect(createTrace).toHaveBeenCalledTimes(2);
  });
});
