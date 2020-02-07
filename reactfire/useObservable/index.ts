import * as React from 'react';
import { Observable } from 'rxjs';
import { first, tap, startWith } from 'rxjs/operators';
import { BehaviorReplaySubject } from './behaviorReplaySubject';

// TODO why can't I use underscore? 30_000
const DEFAULT_TIMEOUT = 30000;
const preloadedObservables = new Map<string, BehaviorReplaySubject<unknown>>();

// Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable
export function preloadObservable<T>(
  source: Observable<T>,
  id: string,
  defaultValue?: T
) {
  // TODO wrap in our own Subject implementation
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id) as BehaviorReplaySubject<T>;
  } else {
    const observable = new BehaviorReplaySubject(
      source,
      DEFAULT_TIMEOUT,
      id,
      defaultValue
    );
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
  const observable = preloadObservable(source, observableId, startWithValue);
  if (!observable.hasValue && !startWithValue) {
    throw observable.firstEmission;
  }
  const [latest, setValue] = React.useState(
    observable.hasValue ? observable.value : startWithValue
  );
  React.useEffect(() => {
    const subscription = observable.subscribe(
      v => setValue(v),
      e => {
        throw e;
      }
    );
    return () => subscription.unsubscribe();
  }, [observableId]);
  return latest;
}
