import firebase from 'firebase/app';
import { collectionData, doc, docData, fromCollectionRef } from 'rxfire/firestore';
import { preloadFirestore, ReactFireOptions, useObservable, checkIdField, ReactFireGlobals } from './';
import { preloadObservable, ObservableStatus } from './useObservable';
import { first } from 'rxjs/operators';
import { useFirebaseApp } from './firebaseApp';

// Since we're side-effect free, we need to ensure our observableId cache is global
const cachedQueries: Array<firebase.firestore.Query> = ((globalThis as any) as ReactFireGlobals)._reactFireFirestoreQueryCache || [];

if (!((globalThis as any) as ReactFireGlobals)._reactFireFirestoreQueryCache) {
  ((globalThis as any) as ReactFireGlobals)._reactFireFirestoreQueryCache = cachedQueries;
}

function getUniqueIdForFirestoreQuery(query: firebase.firestore.Query) {
  const index = cachedQueries.findIndex(cachedQuery => cachedQuery.isEqual(query));
  if (index > -1) {
    return index;
  }
  return cachedQueries.push(query) - 1;
}

// starts a request for a firestore doc.
// imports the firestore SDK automatically
// if it hasn't been imported yet.
//
// there's a decent chance this gets called before the Firestore SDK
// has been imported, so it takes a refProvider instead of a ref
export function preloadFirestoreDoc(
  refProvider: (firestore: firebase.firestore.Firestore) => firebase.firestore.DocumentReference,
  options?: { firebaseApp?: firebase.app.App }
) {
  // TODO: Find an alternative that doesn't break the rules of hooks (conditional hook call)
  const firebaseApp = options?.firebaseApp || useFirebaseApp();

  return preloadFirestore({ firebaseApp }).then(firestore => {
    const ref = refProvider(firestore());
    return preloadObservable(doc(ref), `firestore:doc:${firebaseApp.name}:${ref.path}`);
  });
}

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export function useFirestoreDoc<T = unknown>(
  ref: firebase.firestore.DocumentReference,
  options?: ReactFireOptions<T>
): ObservableStatus<T extends {} ? T : firebase.firestore.DocumentSnapshot> {
  const observableId = `firestore:doc:${ref.firestore.app.name}:${ref.path}`;
  const observable$ = doc(ref);

  return useObservable(observableId, observable$, options);
}

/**
 * Get a firestore document and don't subscribe to changes
 *
 * @param ref - Reference to the document you want to get
 * @param options
 */
export function useFirestoreDocOnce<T = unknown>(
  ref: firebase.firestore.DocumentReference,
  options?: ReactFireOptions<T>
): ObservableStatus<T extends {} ? T : firebase.firestore.DocumentSnapshot> {
  const observableId = `firestore:docOnce:${ref.firestore.app.name}:${ref.path}`;
  const observable$ = doc(ref).pipe(first());

  return useObservable(observableId, observable$, options);
}

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export function useFirestoreDocData<T>(ref: firebase.firestore.DocumentReference, options?: ReactFireOptions<T>): ObservableStatus<T> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';

  const observableId = `firestore:docData:${ref.firestore.app.name}:${ref.path}:idField=${idField}`;
  const observable = docData(ref, idField);

  return useObservable(observableId, observable, options);
}

/**
 * Get a firestore document and don't subscribe to changes
 *
 * @param ref - Reference to the document you want to get
 * @param options
 */
export function useFirestoreDocDataOnce<T = unknown>(ref: firebase.firestore.DocumentReference, options?: ReactFireOptions<T>): ObservableStatus<T> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';

  const observableId = `firestore:docDataOnce:${ref.firestore.app.name}:${ref.path}:idField=${idField}`;
  const observable$ = docData(ref, idField).pipe(first());

  return useObservable(observableId, observable$, options);
}

/**
 * Subscribe to a Firestore collection
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollection<T = { [key: string]: unknown }>(
  query: firebase.firestore.Query,
  options?: ReactFireOptions<T[]>
): ObservableStatus<T extends {} ? T[] : firebase.firestore.QuerySnapshot> {
  const observableId = `firestore:collection:${getUniqueIdForFirestoreQuery(query)}`;
  const observable$ = fromCollectionRef(query);

  return useObservable(observableId, observable$, options);
}

/**
 * Subscribe to a Firestore collection and unwrap the snapshot.
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollectionData<T = { [key: string]: unknown }>(
  query: firebase.firestore.Query,
  options?: ReactFireOptions<T[]>
): ObservableStatus<T[]> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  const observableId = `firestore:collectionData:${getUniqueIdForFirestoreQuery(query)}:idField=${idField}`;
  const observable$ = collectionData(query, idField);

  return useObservable(observableId, observable$, options);
}
