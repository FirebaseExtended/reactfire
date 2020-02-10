import { firestore } from 'firebase/app';
import {
  collectionData,
  doc,
  docData,
  fromCollectionRef
} from 'rxfire/firestore';
import {
  preloadFirestore,
  ReactFireOptions,
  useObservable,
  checkIdField,
  checkStartWithValue
} from '..';
import { preloadObservable } from '../useObservable';

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
  return preloadFirestore(firebaseApp).then(firestore => {
    const ref = refProvider(firestore() as firebase.firestore.Firestore);
    return preloadObservable(doc(ref), ref.path);
  });
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
): T extends {} ? T : firestore.DocumentSnapshot {
  return useObservable(
    doc(ref),
    `useFirestoreDoc:${ref.path}`,
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
    `useFirestoreDocData:${ref.path}`,
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
): T extends {} ? T[] : firestore.QuerySnapshot {
  const queryId = `useFirestoreCollection:${getHashFromFirestoreQuery(query)}`;

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
  return (query as _QueryWithId)._query.canonicalId();
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
  const queryId = `useFirestoreCollectionData:${getHashFromFirestoreQuery(
    query
  )}`;

  return useObservable(
    collectionData(query, checkIdField(options)),
    queryId,
    checkStartWithValue(options)
  );
}
