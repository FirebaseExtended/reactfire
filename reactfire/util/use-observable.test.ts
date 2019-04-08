import { useObservable } from './use-observable';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import { of, Subject, observable } from 'rxjs';
import { delay } from 'rxjs/operators';

afterEach(cleanup);

it('throws a promise if the observable has no value', () => {
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
