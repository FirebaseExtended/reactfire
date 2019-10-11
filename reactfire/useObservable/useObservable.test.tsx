import { useObservable } from '.';
import { renderHook, act } from '@testing-library/react-hooks';
import { of, Subject, Observable, observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { render, waitForElement, cleanup } from '@testing-library/react';
import { ReactFireOptions } from '..';
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';

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

  it('can return a startval and then the observable once it is ready', () => {
    const startVal = 'howdy';
    const observableVal = "y'all";
    const observable$: Subject<any> = new Subject();

    const { result, waitForNextUpdate } = renderHook(() =>
      useObservable(observable$, 'test', startVal)
    );

    expect(result.current).toEqual(startVal);

    // prove that it actually does emit the value from the observable too
    act(() => observable$.next(observableVal));
    expect(result.current).toEqual(observableVal);
  });

  it('ignores provided initial value if the observable is ready right away', () => {
    const startVal = 'howdy';
    const observableVal = "y'all";
    const observable$ = of(observableVal);

    const { result, waitForNextUpdate } = renderHook(() =>
      useObservable(observable$, 'test', startVal)
    );

    expect(result.current).toEqual(observableVal);
  });

  it('works with Suspense', async () => {
    const observableFinalVal = "y'all";
    const observable$ = new Subject();
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
    const observableSecondValue = 'b';
    const observable$ = new Subject();

    const { result } = renderHook(() =>
      useObservable(observable$, 'test', startVal)
    );

    expect(result.current).toEqual(startVal);

    values.forEach(value => {
      act(() => observable$.next(value));
      expect(result.current).toEqual(value);
    });
  });
});
