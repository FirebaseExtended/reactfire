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

function preloadObject(ref: DatabaseReference): InFlightRead<QueryChange> {
  return listenUntilReleased<QueryChange>((onNext, onError) =>
    onValue(
      ref,
      (snapshot) => {
        onNext({ snapshot, prevKey: undefined, event: ListenEvent.value });
      },
      onError
    )
  );
}

const objectCache = createInFlightCache<DatabaseReference, QueryChange>((a, b) => a.isEqual(b));

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
  return useFirebaseStream<DatabaseReference, QueryChange | T>({
    ref,
    isEqual: (a, b) => a.isEqual(b),
    inFlight: objectCache.handle(ref, () => preloadObject(ref)),
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

function preloadList(ref: DatabaseReference | DatabaseQuery): InFlightRead<QueryChange[]> {
  return listenUntilReleased<QueryChange[]>((onNext, onError) =>
    onValue(
      ref,
      (snapshot) => {
        onNext(snapshotToChanges(snapshot));
      },
      onError
    )
  );
}

const listCache = createInFlightCache<DatabaseReference | DatabaseQuery, QueryChange[]>((a, b) => a.isEqual(b));

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
    inFlight: listCache.handle(ref, () => preloadList(ref)),
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
