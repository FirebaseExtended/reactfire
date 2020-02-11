import * as React from 'react';
import { Observable } from 'rxjs';
import { SuspenseSubject } from './suspenseSubject';

const DEFAULT_TIMEOUT = 30_000;
const preloadedObservables = new Map<string, SuspenseSubject<unknown>>();

// Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable
export function preloadObservable<T>(source: Observable<T>, id: string) {
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id) as SuspenseSubject<T>;
  } else {
    const observable = new SuspenseSubject(source, DEFAULT_TIMEOUT);
    preloadedObservables.set(id, observable);
    return observable;
  }
}

export function useObservable<T>(
  source: Observable<T | any>,
  observableId: string,
  startWithValue?: T | any,
  deps: React.DependencyList = [observableId]
): T {
  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }
  const observable = preloadObservable(source, observableId);
  if (!observable.hasValue && !startWithValue) {
    throw observable.firstEmission;
  }
  const [latest, setValue] = React.useState(() =>
    observable.hasValue ? observable.value : startWithValue
  );
  React.useEffect(() => {
    const subscription = observable.subscribe(
      v => setValue(() => v),
      e => {
        throw e;
      }
    );
    return () => subscription.unsubscribe();
  }, deps);
  return latest;
}
