import {
  InstrumentedPromise,
  ObservableStatus,
  ReactFireOptions,
  checkIdField,
  hasInitialDataOption,
  instrumentPromise,
  useMappedObservableStatus,
  useFirebaseStream,
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
  onSnapshot,
} from 'firebase/firestore';

const IN_FLIGHT_EVICT_MS = 30_000;
const inFlightDocPromises = new Map<string, InstrumentedPromise<DocumentSnapshot<any>>>();

function getOrStartInFlightDoc<T = DocumentData>(
  key: string,
  factory: () => Promise<DocumentSnapshot<T>>
): InstrumentedPromise<DocumentSnapshot<T>> {
  let promise = inFlightDocPromises.get(key) as InstrumentedPromise<DocumentSnapshot<T>> | undefined;
  if (!promise) {
    promise = instrumentPromise(factory());
    inFlightDocPromises.set(key, promise);
    const cleanup = () =>
      setTimeout(() => {
        if (inFlightDocPromises.get(key) === promise) {
          inFlightDocPromises.delete(key);
        }
      }, IN_FLIGHT_EVICT_MS);
    promise.then(cleanup, cleanup);
  }
  return promise;
}

function fetchDocOnce<T = DocumentData>(ref: DocumentReference<T>): Promise<DocumentSnapshot<T>> {
  return getDocFromCache(ref).catch(
    () =>
      new Promise<DocumentSnapshot<T>>((resolve, reject) => {
        let settled = false;
        const unsubscribe = onSnapshot(
          ref,
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
      })
  );
}

function fetchCollectionOnce<T = DocumentData>(query: FirestoreQuery<T>): Promise<QuerySnapshot<T>> {
  return new Promise<QuerySnapshot<T>>((resolve, reject) => {
    let settled = false;
    const unsubscribe = onSnapshot(
      query,
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

/**
 * Preload a subscription to a Firestore document reference.
 *
 * Use this to warm up `useFirestoreDoc` for a specific document
 *
 * @deprecated Unwrap `useFirestoreDoc(ref).experimental_usable` with `React.use()` instead. Will be removed in v5.0.0.
 */
export async function preloadFirestoreDoc(refProvider: () => Promise<DocumentReference>) {
  const ref = await refProvider();
  const key = `firestore:doc:${ref.firestore.app.name}:${ref.path}`;
  return getOrStartInFlightDoc(key, () => fetchDocOnce(ref));
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
  const docKey = `firestore:${once ? 'docOnce' : 'doc'}:${ref.firestore.app.name}:${ref.path}`;

  return useFirebaseStream<DocumentReference<T>, DocumentSnapshot<T>>({
    ref,
    isEqual: refEqual,
    peekInFlight: () => inFlightDocPromises.get(docKey) as InstrumentedPromise<DocumentSnapshot<T>> | undefined,
    getOrStartInFlight: () => getOrStartInFlightDoc(docKey, () => fetchDocOnce(ref)),
    clearInFlight: (expectedPromise) => {
      if (!expectedPromise || inFlightDocPromises.get(docKey) === expectedPromise) {
        inFlightDocPromises.delete(docKey);
      }
    },
    subscribe: (onNext, onError, inFlightPromise) => {
      if (once) {
        const reqPromise = inFlightPromise ?? fetchDocOnce(ref);
        reqPromise.then(
          (snap) => onNext(snap, true),
          (error: unknown) => onError(error)
        );
        return () => {};
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

const inFlightCollectionEntries: Array<{ query: FirestoreQuery<any>; promise: InstrumentedPromise<QuerySnapshot<any>> }> = [];

function getOrStartInFlightCollection<T = DocumentData>(
  query: FirestoreQuery<T>,
  factory: () => Promise<QuerySnapshot<T>>
): InstrumentedPromise<QuerySnapshot<T>> {
  const existing = inFlightCollectionEntries.find((entry) => queryEqual(entry.query, query));
  if (existing) {
    return existing.promise as InstrumentedPromise<QuerySnapshot<T>>;
  }
  const promise = instrumentPromise(factory());
  const entry = { query, promise };
  inFlightCollectionEntries.push(entry);
  const cleanup = () =>
    setTimeout(() => {
      const idx = inFlightCollectionEntries.indexOf(entry);
      if (idx > -1) inFlightCollectionEntries.splice(idx, 1);
    }, IN_FLIGHT_EVICT_MS);
  promise.then(cleanup, cleanup);
  return promise;
}

function removeInFlightCollection<T = DocumentData>(
  query: FirestoreQuery<T>,
  expectedPromise?: InstrumentedPromise<QuerySnapshot<T>>
) {
  const idx = inFlightCollectionEntries.findIndex(
    (entry) => queryEqual(entry.query, query) && (!expectedPromise || entry.promise === expectedPromise)
  );
  if (idx > -1) {
    inFlightCollectionEntries.splice(idx, 1);
  }
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
    peekInFlight: () =>
      inFlightCollectionEntries.find((entry) => queryEqual(entry.query, query))?.promise as
        | InstrumentedPromise<QuerySnapshot<T>>
        | undefined,
    getOrStartInFlight: () => getOrStartInFlightCollection(query, () => fetchCollectionOnce(query)),
    clearInFlight: (expectedPromise) => removeInFlightCollection(query, expectedPromise),
    subscribe: (onNext, onError, inFlightPromise) => {
      if (once) {
        const reqPromise = inFlightPromise ?? fetchCollectionOnce(query);
        reqPromise.then(
          (snap) => onNext(snap, true),
          (error: unknown) => onError(error)
        );
        return () => {};
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
