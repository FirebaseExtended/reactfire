import '@testing-library/jest-dom/extend-expect';
import { act, cleanup, render, waitForElement } from '@testing-library/react';
import { act as actOnHook, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import { of, Subject, BehaviorSubject, throwError } from 'rxjs';
import { useObservable } from '.';

describe('useObservable', () => {
  afterEach(cleanup);

  it('throws a promise if the observable has no initial value', () => {
    const observable$: Subject<any> = new Subject();

    try {
      useObservable(observable$, 'test');
    } catch (thingThatWasThrown) {
      expect(thingThatWasThrown).toBeInstanceOf(Promise);
    }
  });

  it('throws an error if no observableId is provided', () => {
    const observable$: Subject<any> = new Subject();

    try {
      useObservable(observable$, undefined);
    } catch (thingThatWasThrown) {
      expect(thingThatWasThrown).toBeInstanceOf(Error);
    }
  });

  it('can return a startval and then the observable once it is ready', () => {
    const startVal = 'howdy';
    const observableVal = "y'all";
    const observable$: Subject<any> = new Subject();

    const { result, waitForNextUpdate } = renderHook(() =>
      useObservable(observable$, 'test', startVal)
    );

    expect(result.current).toEqual(startVal);

    // prove that it actually does emit the value from the observable too
    actOnHook(() => observable$.next(observableVal));
    expect(result.current).toEqual(observableVal);
  });

  it('throws an error if there is an error on initial fetch', async () => {
    const error = new Error('I am an error');
    const observable$ = throwError(error);

    // stop a nasty-looking console error
    // https://github.com/facebook/react/issues/11098#issuecomment-523977830
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
      }

      componentDidCatch(newError, errorInfo) {
        expect(newError).toEqual(error);
      }

      render() {
        if (this.state.hasError) {
          return <h1 data-testid="error-component">Error</h1>;
        } else {
          return this.props.children;
        }
      }
    }

    const Component = () => {
      const val = useObservable(observable$, 'test-error');
      return <h1 data-testid="thing">{val}</h1>;
    };

    const { queryByTestId, getByTestId } = render(
      <ErrorBoundary>
        <React.Suspense fallback={null}>
          <Component />
        </React.Suspense>
      </ErrorBoundary>
    );

    await waitForElement(() => getByTestId('error-component'));
    expect(queryByTestId('error-component')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('returns the provided startWithValue first even if the observable is ready right away', () => {
    // This behavior is a consequense of how observables work. There is
    // not a synchronous way to ask an observable if it has a value to emit.

    const startVal = 'howdy';
    const observableVal = "y'all";
    const observable$ = of(observableVal);
    let hasReturnedStartWithValue = false;

    const Component = () => {
      const val = useObservable(observable$, 'test', startVal);

      if (hasReturnedStartWithValue) {
        expect(val).toEqual(observableVal);
      } else {
        expect(val).toEqual(startVal);
        hasReturnedStartWithValue = true;
      }

      return <h1>Hello</h1>;
    };

    render(<Component />);
  });

  it('works with Suspense', async () => {
    const observableFinalVal = "y'all";
    const observable$ = new BehaviorSubject(undefined);
    const actualComponentId = 'actual-component';
    const fallbackComponentId = 'fallback-component';

    const FallbackComponent = () => (
      <h1 data-testid={fallbackComponentId}>Fallback</h1>
    );

    const Component = () => {
      const val = useObservable(observable$, 'test-suspense');
      return <h1 data-testid={actualComponentId}>{val}}</h1>;
    };

    const { queryByTestId, getByTestId } = render(
      <React.Suspense fallback={<FallbackComponent />}>
        <Component />
      </React.Suspense>
    );

    // make sure Suspense renders the fallback component if the observable has not emitted a value
    expect(getByTestId(fallbackComponentId)).toBeInTheDocument();
    expect(queryByTestId(actualComponentId)).toBeNull();

    act(() => observable$.next(observableFinalVal));
    await waitForElement(() => getByTestId(actualComponentId));

    // make sure Suspense correctly renders its child after the observable emits a value
    expect(getByTestId(actualComponentId)).toBeInTheDocument();
    expect(getByTestId(actualComponentId)).toHaveTextContent(
      observableFinalVal
    );
    expect(queryByTestId(fallbackComponentId)).toBeNull();
  });

  it('emits new values as the observable changes', async () => {
    const startVal = 'start';
    const values = ['a', 'b', 'c'];
    const observable$ = new Subject();

    const { result } = renderHook(() =>
      useObservable(observable$, 'test', startVal)
    );

    expect(result.current).toEqual(startVal);

    values.forEach(value => {
      actOnHook(() => observable$.next(value));
      expect(result.current).toEqual(value);
    });
  });

  it('returns the most recent value of an observable to all subscribers of an observableId', async () => {
    const values = ['a', 'b', 'c'];
    const observable$ = new Subject();
    const observableId = 'my-observable-id';
    const firstComponentId = 'first';
    const secondComponentId = 'second';

    const ObservableConsumer = props => {
      const val = useObservable(observable$, observableId);

      return <h1 {...props}>{val}</h1>;
    };

    const Component = ({ renderSecondComponent }) => {
      return (
        <React.Suspense fallback="loading">
          <ObservableConsumer data-testid={firstComponentId} />
          {renderSecondComponent ? (
            <ObservableConsumer data-testid={secondComponentId} />
          ) : null}
        </React.Suspense>
      );
    };

    const { getByTestId, rerender } = render(
      <Component renderSecondComponent={false} />
    );

    // emit one value to the first component (second one isn't rendered yet)
    act(() => observable$.next(values[0]));
    const comp = await waitForElement(() => getByTestId(firstComponentId));
    expect(comp).toHaveTextContent(values[0]);

    // emit a second value to the first component (second one still isn't rendered)
    act(() => observable$.next(values[1]));
    expect(comp).toHaveTextContent(values[1]);

    // keep the original component around, but now render the second one.
    // they both use the same observableId
    rerender(<Component renderSecondComponent={true} />);

    // the second component should start by receiving the latest value
    // since the first component has already been subscribed
    const comp2 = await waitForElement(() => getByTestId(secondComponentId));
    expect(comp2).toHaveTextContent(values[1]);
  });
});
