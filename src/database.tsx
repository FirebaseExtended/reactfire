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
import { onValue, Query as DatabaseQuery, DatabaseReference, DataSnapshot } from 'firebase/database';

/**
 * @deprecated Legacy rxfire change event enum. In v5.0.0, `useDatabaseObject` returns `DataSnapshot` and `useDatabaseList` returns `DataSnapshot[]`.
 */
export enum ListenEvent {
  added = 'child_added',
  removed = 'child_removed',
  changed = 'child_changed',
  moved = 'child_moved',
  value = 'value',
}

/**
 * @deprecated Legacy rxfire change wrapper. In v5.0.0, `useDatabaseObject` returns `DataSnapshot` and `useDatabaseList` returns `DataSnapshot[]`.
 */
export interface QueryChange {
  snapshot: DataSnapshot;
  prevKey: string | null | undefined;
  event: ListenEvent;
}

function createInitialObjectPromise(ref: DatabaseReference): Promise<QueryChange> {
  return new Promise<QueryChange>((resolve, reject) => {
    onValue(
      ref,
      (snapshot) => {
        resolve({ snapshot, prevKey: undefined, event: ListenEvent.value });
      },
      (err) => {
        reject(err);
      },
      { onlyOnce: true }
    );
  });
}

const IN_FLIGHT_EVICT_MS = 30_000;
const inFlightObjectPromises = new Map<string, InstrumentedPromise<QueryChange>>();

function getOrStartInFlightObject(ref: DatabaseReference): InstrumentedPromise<QueryChange> {
  const key = ref.toString();
  let promise = inFlightObjectPromises.get(key);
  if (!promise) {
    promise = instrumentPromise(createInitialObjectPromise(ref));
    inFlightObjectPromises.set(key, promise);
    const cleanup = () =>
      setTimeout(() => {
        if (inFlightObjectPromises.get(key) === promise) {
          inFlightObjectPromises.delete(key);
        }
      }, IN_FLIGHT_EVICT_MS);
    promise.then(cleanup, cleanup);
  }
  return promise;
}

/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */
export function useDatabaseObject<T = unknown>(
  ref: DatabaseReference,
  options?: ReactFireOptions<T>
): ObservableStatus<QueryChange | T> {
  const key = ref.toString();

  return useFirebaseStream<DatabaseReference, QueryChange | T>({
    ref,
    isEqual: (a, b) => a.isEqual(b),
    peekInFlight: () => inFlightObjectPromises.get(key),
    getOrStartInFlight: () => getOrStartInFlightObject(ref),
    clearInFlight: (expectedPromise) => {
      if (!expectedPromise || inFlightObjectPromises.get(key) === expectedPromise) {
        inFlightObjectPromises.delete(key);
      }
    },
    subscribe: (onNext, onError) => {
      return onValue(
        ref,
        (snapshot: DataSnapshot) => {
          onNext({ snapshot, prevKey: undefined, event: ListenEvent.value }, false);
        },
        (error: Error) => {
          onError(error);
        }
      );
    },
    options,
  });
}

function snapshotToData<T>(snapshot: DataSnapshot, idField?: string): T {
  const val = snapshot.val();
  if (!snapshot.exists() || typeof val !== 'object' || val === null || !idField) {
    return val;
  }
  return {
    ...val,
    [idField]: snapshot.key,
  };
}

/**
 * Subscribe to a Realtime Database object and unwrap the snapshot into a plain object.
 *
 * @deprecated Use `useDatabaseObject` and read `snapshot.val()` / `snapshot.key` directly. Will be removed in v5.0.0.
 */
export function useDatabaseObjectData<T>(ref: DatabaseReference, options?: ReactFireOptions<T>): ObservableStatus<T> {
  const idField = options ? checkIdField(options) : undefined;
  const hasInitialData = hasInitialDataOption(options);
  const status = useDatabaseObject<QueryChange>(ref, {
    suspense: hasInitialData ? false : options?.suspense,
  });
  return useMappedObservableStatus(status, (change) => snapshotToData<T>(change.snapshot, idField), idField ?? '', options);
}

function snapshotToChanges(snapshot: DataSnapshot): QueryChange[] {
  const changes: QueryChange[] = [];
  if (snapshot.exists()) {
    let prevKey: string | null = null;
    snapshot.forEach((childSnapshot) => {
      changes.push({
        snapshot: childSnapshot,
        prevKey,
        event: ListenEvent.value,
      });
      prevKey = childSnapshot.key;
      return false;
    });
  }
  return changes;
}

function createInitialListPromise(ref: DatabaseReference | DatabaseQuery): Promise<QueryChange[]> {
  return new Promise<QueryChange[]>((resolve, reject) => {
    onValue(
      ref,
      (snapshot) => {
        resolve(snapshotToChanges(snapshot));
      },
      (err) => {
        reject(err);
      },
      { onlyOnce: true }
    );
  });
}

const inFlightListEntries: Array<{
  ref: DatabaseReference | DatabaseQuery;
  promise: InstrumentedPromise<QueryChange[]>;
}> = [];

function getOrStartInFlightList(ref: DatabaseReference | DatabaseQuery): InstrumentedPromise<QueryChange[]> {
  const existing = inFlightListEntries.find((entry) => entry.ref.isEqual(ref));
  if (existing) {
    return existing.promise;
  }
  const promise = instrumentPromise(createInitialListPromise(ref));
  const entry = { ref, promise };
  inFlightListEntries.push(entry);
  const cleanup = () =>
    setTimeout(() => {
      const idx = inFlightListEntries.indexOf(entry);
      if (idx > -1) inFlightListEntries.splice(idx, 1);
    }, IN_FLIGHT_EVICT_MS);
  promise.then(cleanup, cleanup);
  return promise;
}

function removeInFlightList(
  ref: DatabaseReference | DatabaseQuery,
  expectedPromise?: InstrumentedPromise<QueryChange[]>
) {
  const idx = inFlightListEntries.findIndex(
    (entry) => entry.ref.isEqual(ref) && (!expectedPromise || entry.promise === expectedPromise)
  );
  if (idx > -1) {
    inFlightListEntries.splice(idx, 1);
  }
}

/**
 * Subscribe to a Realtime Database list
 *
 * @param ref - Reference to the DB List you want to listen to
 * @param options
 */
export function useDatabaseList<T = { [key: string]: unknown }>(
  ref: DatabaseReference | DatabaseQuery,
  options?: ReactFireOptions<T[]>
): ObservableStatus<QueryChange[] | T[]> {
  return useFirebaseStream<DatabaseReference | DatabaseQuery, QueryChange[] | T[]>({
    ref,
    isEqual: (a, b) => a.isEqual(b),
    peekInFlight: () => inFlightListEntries.find((entry) => entry.ref.isEqual(ref))?.promise,
    getOrStartInFlight: () => getOrStartInFlightList(ref),
    clearInFlight: (expectedPromise) =>
      removeInFlightList(ref, expectedPromise as InstrumentedPromise<QueryChange[]> | undefined),
    subscribe: (onNext, onError) => {
      return onValue(
        ref,
        (snapshot: DataSnapshot) => {
          onNext(snapshotToChanges(snapshot), false);
        },
        (error: Error) => {
          onError(error);
        }
      );
    },
    options,
  });
}

/**
 * Subscribe to a Realtime Database list and unwrap the snapshots into an array.
 *
 * @deprecated Use `useDatabaseList` and read `child.val()` / `child.key` directly. Will be removed in v5.0.0.
 */
export function useDatabaseListData<T = { [key: string]: unknown }>(
  ref: DatabaseReference | DatabaseQuery,
  options?: ReactFireOptions<T[]>
): ObservableStatus<T[] | null> {
  const idField = options ? checkIdField(options) : undefined;
  const hasInitialData = hasInitialDataOption(options);
  const status = useDatabaseList<QueryChange>(ref, {
    suspense: hasInitialData ? false : options?.suspense,
  });
  return useMappedObservableStatus<QueryChange[], T[] | null>(
    status,
    (changes) => changes.map((change) => snapshotToData<T>(change.snapshot, idField)),
    idField ?? '',
    options
  );
}
