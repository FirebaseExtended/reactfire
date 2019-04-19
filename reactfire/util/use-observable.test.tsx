import { useObservable } from './use-observable';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import { of, Subject, observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  render,
  waitForElement,
  getByTestId,
  queryByTestId
} from 'react-testing-library';
import { ReactFireOptions } from '..';
import React from 'react';
import 'jest-dom/extend-expect';

afterEach(cleanup);

it('throws a promise if the observable has no initial value', () => {
  const observable$ = new Subject();

  try {
    useObservable(observable$, 'test');
  } catch (thingThatWasThrown) {
    expect(thingThatWasThrown).toBeInstanceOf(Promise);
  }
});

it('can return a startval and then the observable once it is ready', () => {
  const startVal = 'howdy';
  const observableVal = "y'all";
  const observable$ = new Subject();

  const { result, waitForNextUpdate } = renderHook(() =>
    useObservable(observable$, 'test', startVal)
  );

  expect(result.current).toEqual(startVal);

  // just to prove that it actually does emit the value from the observable too
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

  expect(getByTestId(fallbackComponentId)).toBeInTheDocument();
  expect(queryByTestId(actualComponentId)).toBeNull();

  observable$.next(observableFinalVal);

  await waitForElement(() => getByTestId(actualComponentId));

  expect(getByTestId(actualComponentId)).toBeInTheDocument();
  expect(getByTestId(actualComponentId)).toHaveTextContent(observableFinalVal);
  expect(queryByTestId(fallbackComponentId)).toBeNull();
});
