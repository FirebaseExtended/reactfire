import * as React from 'react';
import { user } from 'rxfire/auth';
import { auth, User, firestore } from 'firebase/app';
import { collection, doc } from 'rxfire/firestore';
import { first, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

class ActiveRequest {
  promise: Promise<any>;
  isComplete: boolean;
  value: any;
  error: Error;

  constructor(promise) {
    this.promise = promise;
    this.isComplete = false;
  }

  setValue(value) {
    this.value = value;
    this.isComplete = true;
  }
}

class ObservablePromiseCache {
  activeRequests: Map<any, ActiveRequest>;

  constructor() {
    this.activeRequests = new Map();
  }

  getRequest(observable$, observableId) {
    let request = this.activeRequests.get(observableId);

    if (!request) {
      request = new ActiveRequest(observable$.pipe(first()).toPromise());
      this.activeRequests.set(observableId, request);
    }

    return request;
  }

  removeRequest(observableId) {
    this.activeRequests.delete(observableId);
  }
}

const requestCache = new ObservablePromiseCache();

export function useUser(auth: auth.Auth): User {
  return useObservable(user(auth), 'user');
}

export function useFirestoreDoc(ref: firestore.DocumentReference) {
  return useObservable(doc(ref), ref.path);
}

export function useFirestoreCollection(ref: firestore.CollectionReference) {
  return useObservable(collection(ref), ref.path);
}

export function suspendUntilFirst(observable$, observableId) {
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
  observableId: string
) {
  const initialValue = suspendUntilFirst(observable$, observableId);

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

    // need to wrap unsubscribe in a function to avoid weird context stuff
    return () => {
      subscription.unsubscribe();
      requestCache.removeRequest(observableId);
    };
  }, [observableId]);

  return latestValue;
}
