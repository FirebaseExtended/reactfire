import * as React from 'react';
import { Observable, timer, from } from 'rxjs';
import { first, startWith, shareReplay, takeUntil } from 'rxjs/operators';
import { ActiveObservable } from './ActiveObservable';

const PRELOAD_SUBSCRIBE_TIME = 5 /*seconds*/ * 1000;
const observableCache = new Map<string, ActiveObservable>();

export function preloadPromise(getPromise, requestId: string): Promise<any> {
  const activeObservable = preloadObservable(from(getPromise()), requestId);

  return activeObservable.getPromise();
}

// Registers an Observable and starts listening to it to prime it for when a real
// subscriber starts listening
export function preloadObservable(
  observable$: Observable<any>,
  observableId: string,
  startWithValue?
): ActiveObservable {
  // If we already have something in the cache with that ID, re-use it
  if (observableCache.has(observableId)) {
    return observableCache.get(observableId);
  }

  const activeObservable = new ActiveObservable(observable$, startWithValue);
  observableCache.set(observableId, activeObservable);

  // subscribe to the observable so that we can get a value
  // this subscription cleans itself up after PRELOAD_SUBSCRIBE_TIME passes
  activeObservable.subscribeTemporarily(PRELOAD_SUBSCRIBE_TIME, () => {
    if (activeObservable.subscribers === 0) {
      console.log(`CLEANING UP ${observableId}`);
      observableCache.delete(observableId);
    }
  });

  return activeObservable;
}

export function usePreloadedObservable(observableId: string) {
  if (!observableCache.has(observableId)) {
    throw new Error(`Observable "${observableId}" doesn't exist!`);
  }

  const activeObservable = observableCache.get(observableId);

  // Suspend if we're not ready yet
  if (!activeObservable.isReady) {
    throw activeObservable.getPromise();
  }

  if (activeObservable.error) {
    throw activeObservable.error;
  }

  return activeObservable.value;
}

export function useObservable(
  observable$: Observable<any>,
  observableId: string,
  startWithValue?: any
) {
  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }

  // register observable in the cache
  const activeObservable = preloadObservable(
    observable$,
    observableId,
    startWithValue
  );

  if (activeObservable.isReady === false) {
    // this will Suspend until the Promise resolves
    usePreloadedObservable(observableId);
  }

  if (activeObservable.error) {
    throw activeObservable.error;
  }

  const [latestValue, setValue] = React.useState(activeObservable.value);

  React.useEffect(() => {
    const subscription = activeObservable.subscribe({
      next: newVal => {
        setValue(newVal);
      },
      error: error => {
        throw error;
      },
      complete: () => {}
    });

    return () => {
      subscription.unsubscribe();

      // if we were the last subscriber, remove the observable from the cache
      if (activeObservable.subscribers === 0) {
        observableCache.delete(observableId);
      }
    };
  }, [activeObservable]);

  return latestValue;
}

export function clearCache() {
  observableCache.clear();
}

export function getCache() {
  return observableCache;
}
