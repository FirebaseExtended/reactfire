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
import { first } from 'rxjs/operators';

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
    const ref = refProvider(firestore);
    return preloadObservable(
      doc(ref),
      `firestore:doc:${ref.firestore.app.name}:${ref.path}`
    );
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
    `firestore:doc:${ref.firestore.app.name}:${ref.path}`,
    options ? options.startWithValue : undefined
  );
}

/**
 * Get a firestore document and don't subscribe to changes
 *
 * @param ref - Reference to the document you want to get
 * @param options
 */
export function useFirestoreDocOnce<T = unknown>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<T>
): T extends {} ? T : firestore.DocumentSnapshot {
  return useObservable(
    doc(ref).pipe(first()),
    `firestore:docOnce:${ref.firestore.app.name}:${ref.path}`,
    checkStartWithValue(options)
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
  const idField = checkIdField(options);
  return useObservable(
    docData(ref, idField),
    `firestore:docData:${ref.firestore.app.name}:${ref.path}:idField=${idField}`,
    checkStartWithValue(options)
  );
}

/**
 * Get a firestore document and don't subscribe to changes
 *
 * @param ref - Reference to the document you want to get
 * @param options
 */
export function useFirestoreDocDataOnce<T = unknown>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<T>
): T {
  const idField = checkIdField(options);
  return useObservable(
    docData(ref, idField).pipe(first()),
    `firestore:docDataOnce:${ref.firestore.app.name}:${ref.path}:idField=${idField}`,
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
  const queryId = `firestore:collection:${
    query.firestore.app.name
  }:${getHashFromFirestoreQuery(query)}`;

  return useObservable(
    fromCollectionRef(query),
    queryId,
    checkStartWithValue(options)
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
  const idField = checkIdField(options);
  const queryId = `firestore:collectionData:${
    query.firestore.app.name
  }:${getHashFromFirestoreQuery(query)}:idField=${idField}`;

  return useObservable(
    collectionData(query, idField),
    queryId,
    checkStartWithValue(options)
  );
}
