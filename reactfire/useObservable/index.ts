import * as React from 'react';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ObservablePromiseCache } from './requestCache';

const requestCache = new ObservablePromiseCache();

function suspendUntilFirst(observable$, observableId) {
  let request = requestCache.getRequest(observable$, observableId);

  if (request.isComplete === false) {
    throw request.promise
      .then(result => {
        request.setValue(result);
      })
      .catch(err => {
        request.isComplete = true;
        throw err;
      });
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
  const initialValue =
    startWithValue || suspendUntilFirst(observable$, observableId);

  const [latestValue, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    const subscription = observable$.pipe(startWith(initialValue)).subscribe(
      newVal => {
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
