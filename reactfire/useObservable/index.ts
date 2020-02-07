import * as React from 'react';
import { Observable } from 'rxjs';
import { BehaviorReplaySubject } from './behaviorReplaySubject';

const DEFAULT_TIMEOUT = 30_000;
const preloadedObservables = new Map<string, BehaviorReplaySubject<unknown>>();

// Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable
export function preloadObservable<T>(source: Observable<T>, id: string) {
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id) as BehaviorReplaySubject<T>;
  } else {
    const observable = new BehaviorReplaySubject(source, DEFAULT_TIMEOUT);
    preloadedObservables.set(id, observable);
    return observable;
  }
}

export function useObservable<T>(
  source: Observable<T | any>,
  observableId: string,
  startWithValue?: T | any
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
  }, [observableId]);
  return latest;
}
