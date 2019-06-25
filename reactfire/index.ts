import { auth, firestore, User, database, storage } from 'firebase/app';
import { user } from 'rxfire/auth';
import { fromCollectionRef, doc } from 'rxfire/firestore';
import { object, list, QueryChange } from 'rxfire/database';
import { useObservable } from './util/use-observable';
import { getDownloadURL } from 'rxfire/storage';
import { Observable, from } from 'rxjs';
import { useFirebaseApp } from './firebaseContext';

export interface ReactFireOptions<T = unknown> {
  startWithValue: T;
}

function getAuthFromContext(): auth.Auth {
  const firebaseApp = useFirebaseApp();

  if (!firebaseApp) {
    throw new Error(
      'Firebase not found in context. Either pass it directly to a reactfire hook, or wrap your component in a FirebaseAppProvider'
    );
  }

  const authFunc = firebaseApp.auth;

  if (!authFunc || !authFunc()) {
    throw new Error(
      "No auth object off of Firebase. Did you forget to import 'firebase/auth' in a component?"
    );
  }

  return authFunc();
}

/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param auth - the [firebase.auth](https://firebase.google.com/docs/reference/js/firebase.auth) object
 * @param options
 */
export function useUser<T = unknown>(
  auth?: auth.Auth,
  options?: ReactFireOptions<T>
): User | T {
  auth = auth || getAuthFromContext();

  return useObservable(
    user(auth),
    'user',
    options ? options.startWithValue : undefined
  );
}

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export function useFirestoreDoc<T = unknown>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<T>
): firestore.DocumentSnapshot | T {
  return useObservable(
    doc(ref),
    ref.path,
    options ? options.startWithValue : undefined
  );
}

/**
 * Subscribe to a Firestore collection
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollection<T = { [key: string]: unknown }>(
  ref: firestore.CollectionReference,
  options?: ReactFireOptions<T[]>
): firestore.QuerySnapshot | T[] {
  return useObservable(
    fromCollectionRef(ref),
    ref.path,
    options ? options.startWithValue : undefined
  );
}

/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */
export function useDatabaseObject<T = unknown>(
  ref: database.Reference,
  options?: ReactFireOptions<T>
): QueryChange | T {
  return useObservable(
    object(ref),
    ref.toString(),
    options ? options.startWithValue : undefined
  );
}

/**
 * Subscribe to a Realtime Database list
 *
 * @param ref - Reference to the DB List you want to listen to
 * @param options
 */
export function useDatabaseList<T = { [key: string]: unknown }>(
  ref: database.Reference | database.Query,
  options?: ReactFireOptions<T[]>
): QueryChange[] | T[] {
  return useObservable(
    list(ref),
    ref.toString(),
    options ? options.startWithValue : undefined
  );
}

/**
 * modified version of rxFire's _fromTask
 *
 * @param task
 */
function _fromTask(task: storage.UploadTask) {
  return new Observable<storage.UploadTaskSnapshot>(subscriber => {
    const progress = (snap: storage.UploadTaskSnapshot) => {
      return subscriber.next(snap);
    };
    const error = e => subscriber.error(e);
    const complete = () => {
      return subscriber.complete();
    };
    task.on('state_changed', progress, error, complete);

    // I REMOVED THE UNSUBSCRIBE RETURN BECAUSE IT CANCELS THE UPLOAD
    // https://github.com/firebase/firebase-js-sdk/issues/1659
  });
}

/**
 * Subscribe to the progress of a storage task
 *
 * @param task - the task you want to listen to
 * @param ref - reference to the blob the task is acting on
 * @param options
 */
export function useStorageTask<T = unknown>(
  task: storage.UploadTask,
  ref: storage.Reference,
  options?: ReactFireOptions<T>
): storage.UploadTaskSnapshot | T {
  return useObservable(
    _fromTask(task),
    'upload' + ref.toString(),
    options ? options.startWithValue : undefined
  );
}

/**
 * Subscribe to a storage ref's download URL
 *
 * @param ref - reference to the blob you want to download
 * @param options
 */
export function useStorageDownloadURL<T = string>(
  ref: storage.Reference,
  options?: ReactFireOptions<T>
): string | T {
  return useObservable(
    getDownloadURL(ref),
    'download' + ref.toString(),
    options ? options.startWithValue : undefined
  );
}

export { SuspenseWithPerf, AuthCheck } from './components';
export { FirebaseAppProvider, useFirebaseApp } from './firebaseContext';
