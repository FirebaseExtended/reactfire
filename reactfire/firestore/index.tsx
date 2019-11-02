import { firestore } from 'firebase/app';
import {
  collectionData,
  doc,
  docData,
  fromCollectionRef
} from 'rxfire/firestore';
import {
  ReactFireOptions,
  useObservable,
  useFirebaseApp,
  useSDK,
  fetchSDK,
  SDK
} from '..';
import { preloadObservable, usePreloadedRequest } from '../useObservable';
import { concat, from } from 'rxjs';

// starts a request for a firestore doc.
// imports the firestore SDK automatically
// if it hasn't been imported yet.
//
// there's a decent chance this gets called before the Firestore SDK
// has been imported, so it takes a refProvider instead of a ref
export function preloadFirestoreDoc(
  refProvider: (
    firestore: firebase.firestore.Firestore
  ) => firestore.DocumentReference,
  firebaseApp: firebase.app.App
) {
  return fetchSDK(SDK.FIRESTORE, firebaseApp).then(firestore => {
    if (!firestore) {
      throw new Error('Something went wrong with the firestore dynamic import');
    }
    const ref = refProvider(firestore() as firebase.firestore.Firestore);
    return preloadObservable(doc(ref), ref.path);
  });
}

export function useFirestore(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.FIRESTORE, firebaseApp);
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
  const firestore = useFirestore();

  return useObservable(
    doc(ref),
    'firestore doc: ' + ref.path,
    options ? options.startWithValue : undefined
  );
}

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export function useFirestoreDocData<T = unknown>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<T>
): T {
  return useObservable(
    docData(ref, checkIdField(options)),
    'firestore docdata: ' + ref.path,
    checkStartWithValue(options)
  );
}

/**
 * Subscribe to a Firestore collection
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollection<T = { [key: string]: unknown }>(
  query: firestore.Query,
  options?: ReactFireOptions<T[]>
): firestore.QuerySnapshot | T[] {
  const queryId = getHashFromFirestoreQuery(query);

  return useObservable(
    fromCollectionRef(query, checkIdField(options)),
    queryId,
    options ? options.startWithValue : undefined
  );
}

// The Firestore SDK has an undocumented _query
// object that has a method to generate a hash for a query,
// which we need for useObservable
// https://github.com/firebase/firebase-js-sdk/blob/5beb23cd47312ffc415d3ce2ae309cc3a3fde39f/packages/firestore/src/core/query.ts#L221
interface _QueryWithId extends firestore.Query {
  _query: {
    canonicalId(): string;
  };
}

function getHashFromFirestoreQuery(query: firestore.Query) {
  const hash = (query as _QueryWithId)._query.canonicalId();
  return `firestore: ${hash}`;
}

/**
 * Subscribe to a Firestore collection and unwrap the snapshot.
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollectionData<T = { [key: string]: unknown }>(
  query: firestore.Query,
  options?: ReactFireOptions<T[]>
): T[] {
  const queryId = getHashFromFirestoreQuery(query);

  return useObservable(
    collectionData(query, checkIdField(options)),
    queryId,
    checkStartWithValue(options)
  );
}

function checkOptions(options: ReactFireOptions, field: string) {
  return options ? options[field] : undefined;
}

function checkStartWithValue(options: ReactFireOptions) {
  return checkOptions(options, 'startWithValue');
}

function checkIdField(options: ReactFireOptions) {
  return checkOptions(options, 'idField');
}
