import * as React from 'react';
import { Observable } from 'rxjs';
import { first, startWith } from 'rxjs/operators';
import { ActiveRequest, ObservablePromiseCache } from './requestCache';

const requestCache = new ObservablePromiseCache();

export function preloadRequest(
  getPromise,
  requestId: string
): { requestId: string; request: ActiveRequest } {
  const request = requestCache.createDedupedRequest(getPromise, requestId);

  return {
    requestId: requestId,
    request
  };
}

// Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable
export function preloadObservable(
  observable$: Observable<any>,
  observableId: string
): { requestId: string; request: ActiveRequest } {
  return preloadRequest(
    () => observable$.pipe(first()).toPromise(),
    observableId
  );
}

export function usePreloadedRequest(preloadResult: { requestId: string }) {
  const request = requestCache.getRequest(preloadResult.requestId);

  // Suspend if we're not ready yet
  if (!request.isComplete) {
    throw request.promise;
  }

  if (request.error) {
    throw request.error;
  }

  return request.value;
}

export function useObservable(
  observable$: Observable<any>,
  observableId: string,
  startWithValue?: any
) {
  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }

  const result = preloadObservable(observable$, observableId);

  let initialValue = startWithValue;
  if (initialValue === undefined) {
    // this will Suspend until the Promise resolves
    initialValue = usePreloadedRequest(result);
  }

  const [latestValue, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    const subscription = observable$.pipe(startWith(initialValue)).subscribe(
      newVal => {
        // update the value in requestCache
        result.request.setValue(newVal);

        // update state
        setValue(newVal);
      },
      error => {
        console.error('There was an error', error);
        throw error;
      }
    );

    return () => {
      subscription.unsubscribe();
      requestCache.removeRequest(observableId);
    };
  }, [observableId]);

  return latestValue;
}
