import * as React from 'react';
import { user } from 'rxfire/auth';
import { auth, User, firestore } from 'firebase/app';
import { collection, doc } from 'rxfire/firestore';
import { first, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

const ongoingPromises = new Map();

function isPromise(obj: any) {
  return obj && obj.then;
}

export function useUser(auth: auth.Auth): User {
  return useObservable(user(auth), 'user');
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
    throw request.promise.then(dataSnapShot => {
      request.isComplete = true;
      request.value = dataSnapShot;
    });
  }

  return request.value;
}

export function useFirestoreDoc(ref: firestore.DocumentReference) {
  return useObservable(doc(ref), ref.path);
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
        if (newVal === null) {
          console.log('NULL VALUE RECEIVED');
        }
        console.log('NEW VALUE', newVal);
        console.log('NEW VALUE', newVal.data);

        setValue(newVal);
      },
      error => {
        console.warn('There was an error', error);
        throw new Error(JSON.stringify(error));
      }
    );

    return subscription.unsubscribe;
  }, [observableId]);

  return latestValue;
}
