import {
  InFlightRead,
  ObservableStatus,
  ReactFireOptions,
  checkIdField,
  createInFlightCache,
  hasInitialDataOption,
  listenUntilReleased,
  useFirebaseStream,
  useMappedObservableStatus,
} from './useFirebaseStream.js';

import {
  Query as FirestoreQuery,
  QuerySnapshot,
  DocumentReference,
  queryEqual,
  refEqual,
  DocumentData,
  DocumentSnapshot,
  getDocFromCache,
  getDocsFromCache,
  onSnapshot,
} from 'firebase/firestore';

const ignore = () => undefined;

function preloadDoc<T = DocumentData>(ref: DocumentReference<T>): InFlightRead<DocumentSnapshot<T>> {
  return listenUntilReleased<DocumentSnapshot<T>>((onNext, onError) => {
    const unsubscribe = onSnapshot(ref, onNext, onError);
    getDocFromCache(ref).then(onNext, ignore);
    return unsubscribe;
  });
}

function preloadCollection<T = DocumentData>(query: FirestoreQuery<T>): InFlightRead<QuerySnapshot<T>> {
  return listenUntilReleased<QuerySnapshot<T>>((onNext, onError) => {
    const unsubscribe = onSnapshot(query, onNext, onError);
    getDocsFromCache(query).then((snap) => {
      if (!snap.empty) {
        onNext(snap);
      }
    }, ignore);
    return unsubscribe;
  });
}

function listenOnce<S>(start: (onNext: (snap: S) => void, onError: (err: Error) => void) => () => void): Promise<S> {
  return new Promise<S>((resolve, reject) => {
    let settled = false;
    const unsubscribe = start(
      (snap) => {
        if (!settled) {
          settled = true;
          unsubscribe?.();
          resolve(snap);
        }
      },
      (err) => {
        if (!settled) {
          settled = true;
          unsubscribe?.();
          reject(err);
        }
      }
    );
    if (settled) {
      unsubscribe();
    }
  });
}

function fetchDocOnce<T = DocumentData>(ref: DocumentReference<T>): Promise<DocumentSnapshot<T>> {
  return getDocFromCache(ref).catch(() => listenOnce<DocumentSnapshot<T>>((onNext, onError) => onSnapshot(ref, onNext, onError)));
}

function fetchCollectionOnce<T = DocumentData>(query: FirestoreQuery<T>): Promise<QuerySnapshot<T>> {
  return listenOnce<QuerySnapshot<T>>((onNext, onError) => onSnapshot(query, onNext, onError));
}

// Keyed by the reference/query itself (`refEqual` / `queryEqual` compare the Firestore instance, path, and converter),
// so the same path in another database, or read through another converter, never shares an initial read.
const docCache = createInFlightCache<DocumentReference<any>, DocumentSnapshot<any>>(refEqual);
const docOnceCache = createInFlightCache<DocumentReference<any>, DocumentSnapshot<any>>(refEqual);
const collectionCache = createInFlightCache<FirestoreQuery<any>, QuerySnapshot<any>>(queryEqual);
const collectionOnceCache = createInFlightCache<FirestoreQuery<any>, QuerySnapshot<any>>(queryEqual);

/**
 * Preload a subscription to a Firestore document reference.
 *
 * Use this to warm up `useFirestoreDoc` for a specific document
 *
 * @deprecated Unwrap `useFirestoreDoc(ref).experimental_usable` with `React.use()` instead. Will be removed in v5.0.0.
 */
export async function preloadFirestoreDoc(refProvider: () => Promise<DocumentReference>) {
  const ref = await refProvider();
  return docCache.handle(ref, () => preloadDoc(ref)).getOrStart();
}

/**
 * Subscribe to Firestore Document changes
 *
 * You can preload data for this hook by calling `preloadFirestoreDoc`
 */
export function useFirestoreDoc<T = DocumentData>(
  ref: DocumentReference<T>,
  options?: ReactFireOptions<T>
): ObservableStatus<DocumentSnapshot<T>> {
  const once = Boolean(options?.once);
  const includeMetadataChanges = options?.includeMetadataChanges;

  return useFirebaseStream<DocumentReference<T>, DocumentSnapshot<T>>({
    ref,
    isEqual: refEqual,
    deps: [once, includeMetadataChanges],
    inFlight: (once ? docOnceCache : docCache).handle(ref, () => (once ? fetchDocOnce(ref) : preloadDoc(ref))),
    subscribe: (onNext, onError, inFlightPromise) => {
      if (once) {
        let active = true;
        const reqPromise = inFlightPromise ?? fetchDocOnce(ref);
        reqPromise.then(
          (snap) => {
            if (active) onNext(snap, true);
          },
          (error: unknown) => {
            if (active) onError(error);
          }
        );
        return () => {
          active = false;
        };
      }

      let active = true;

      const onSnapNext = (snap: DocumentSnapshot<T>) => {
        if (active) {
          onNext(snap, false);
        }
      };
      const onSnapError = (error: unknown) => {
        if (active) {
          onError(error);
        }
      };

      const unsubscribe =
        includeMetadataChanges !== undefined
          ? onSnapshot(ref, { includeMetadataChanges }, onSnapNext, onSnapError)
          : onSnapshot(ref, onSnapNext, onSnapError);

      return () => {
        active = false;
        unsubscribe();
      };
    },
    options,
    defaultIsComplete: once,
  });
}

/**
 * Get a firestore document and don't subscribe to changes
 *
 * @deprecated Pass `{ once: true }` to `useFirestoreDoc(ref, { once: true })` instead. Will be removed in v5.0.0.
 */
export function useFirestoreDocOnce<T = DocumentData>(
  ref: DocumentReference<T>,
  options?: ReactFireOptions<T>
): ObservableStatus<DocumentSnapshot<T>> {
  return useFirestoreDoc(ref, { ...options, once: true });
}

function snapToData<T>(snap: DocumentSnapshot<T>, idField?: string): T | undefined {
  if (!snap.exists()) {
    return undefined;
  }
  const data = snap.data();
  if (idField && data && typeof data === 'object') {
    const proto = Object.getPrototypeOf(data);
    if (proto && proto !== Object.prototype) {
      return Object.assign(Object.create(proto), data, { [idField]: snap.id });
    }
    return {
      ...data,
      [idField]: snap.id,
    };
  }
  return data;
}

/**
 * Subscribe to Firestore Document changes and unwrap the document into a plain object
 *
 * @deprecated Use `useFirestoreDoc(ref)` and read `snap.data()` / `snap.id` / `snap.exists()` directly. Will be removed in v5.0.0.
 */
export function useFirestoreDocData<T = unknown>(
  ref: DocumentReference<T>,
  options?: ReactFireOptions<T>
): ObservableStatus<T | undefined> {
  const idField = options ? checkIdField(options) : undefined;
  const hasInitialData = hasInitialDataOption(options);
  const docStatus = useFirestoreDoc(ref, {
    suspense: hasInitialData ? false : options?.suspense,
    once: options?.once,
    includeMetadataChanges: options?.includeMetadataChanges,
  });
  return useMappedObservableStatus(docStatus, (snap) => snapToData(snap, idField), idField ?? '', options);
}

/**
 * Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes
 *
 * @deprecated Use `useFirestoreDoc(ref, { once: true })` and read `snap.data()` / `snap.id` directly. Will be removed in v5.0.0.
 */
export function useFirestoreDocDataOnce<T = unknown>(
  ref: DocumentReference<T>,
  options?: ReactFireOptions<T>
): ObservableStatus<T | undefined> {
  const idField = options ? checkIdField(options) : undefined;
  const hasInitialData = hasInitialDataOption(options);
  const docStatus = useFirestoreDocOnce(ref, { suspense: hasInitialData ? false : options?.suspense });
  return useMappedObservableStatus(docStatus, (snap) => snapToData(snap, idField), idField ?? '', options);
}

/**
 * Subscribe to a Firestore collection
 */
export function useFirestoreCollection<T = DocumentData>(
  query: FirestoreQuery<T>,
  options?: ReactFireOptions<T[]>
): ObservableStatus<QuerySnapshot<T>> {
  const once = Boolean(options?.once);
  const includeMetadataChanges = options?.includeMetadataChanges;

  return useFirebaseStream<FirestoreQuery<T>, QuerySnapshot<T>>({
    ref: query,
    isEqual: queryEqual,
    deps: [once, includeMetadataChanges],
    inFlight: (once ? collectionOnceCache : collectionCache).handle(query, () =>
      once ? fetchCollectionOnce(query) : preloadCollection(query)
    ),
    subscribe: (onNext, onError, inFlightPromise) => {
      if (once) {
        let active = true;
        const reqPromise = inFlightPromise ?? fetchCollectionOnce(query);
        reqPromise.then(
          (snap) => {
            if (active) onNext(snap, true);
          },
          (error: unknown) => {
            if (active) onError(error);
          }
        );
        return () => {
          active = false;
        };
      }

      let active = true;

      const onSnapNext = (snap: QuerySnapshot<T>) => {
        if (active) {
          onNext(snap, false);
        }
      };
      const onSnapError = (error: unknown) => {
        if (active) {
          onError(error);
        }
      };

      const unsubscribe =
        includeMetadataChanges !== undefined
          ? onSnapshot(query, { includeMetadataChanges }, onSnapNext, onSnapError)
          : onSnapshot(query, onSnapNext, onSnapError);

      return () => {
        active = false;
        unsubscribe();
      };
    },
    options,
    defaultIsComplete: once,
  });
}

/**
 * Subscribe to a Firestore collection and unwrap the snapshot into an array.
 *
 * @deprecated Use `useFirestoreCollection(query)` and map `snap.docs` directly. Will be removed in v5.0.0.
 */
export function useFirestoreCollectionData<T = DocumentData>(
  query: FirestoreQuery<T>,
  options?: ReactFireOptions<T[]>
): ObservableStatus<T[]> {
  const idField = options ? checkIdField(options) : undefined;
  const hasInitialData = hasInitialDataOption(options);
  const collectionStatus = useFirestoreCollection(query, {
    suspense: hasInitialData ? false : options?.suspense,
    once: options?.once,
    includeMetadataChanges: options?.includeMetadataChanges,
  });
  return useMappedObservableStatus(
    collectionStatus,
    (snap) => snap.docs.map((docSnap) => snapToData(docSnap, idField) as T),
    idField ?? '',
    options
  );
}
