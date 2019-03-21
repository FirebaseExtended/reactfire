import * as React from 'react';
import { user } from 'rxfire/auth';
import { auth, User, firestore } from 'firebase/app';
import { collection, doc } from 'rxfire/firestore';
import { first, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

const ongoingPromises = new Map();

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
  let request = ongoingPromises.get(observableId);

  if (!request) {
    request = {
      promise: observable$.pipe(first()).toPromise(),
      isComplete: false
    };
    ongoingPromises.set(observableId, request);
  }

  if (request.isComplete === false) {
    throw request.promise
      .then(dataSnapShot => {
        request.isComplete = true;
        request.value = dataSnapShot;
      })
      .catch(err => {
        request.isComplete = true;
        request.error = err;
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
        console.warn('There was an error', error);
        throw new Error(JSON.stringify(error));
      }
    );

    // need to wrap unsubscribe in a function to avoid weird context stuff
    return () => subscription.unsubscribe();
  }, [observableId]);

  return latestValue;
}
