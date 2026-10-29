import { useEffect, useMemo, useState } from 'react';
import {
  documentSnapshotFromJSON,
  onSnapshot,
  onSnapshotResume,
  queryEqual,
  querySnapshotFromJSON,
  refEqual,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  type Firestore,
  type FirestoreDataConverter,
  type FirestoreError,
  type Query,
  type QuerySnapshot,
} from 'firebase/firestore';
import {
  errorStatus,
  idleStatus,
  loadingStatus,
  successStatus,
  useStableRef,
  type ListenOptions,
  type ListenResult,
  type SeededListenResult,
} from './core.js';

export interface FirestoreOptions<T> extends ListenOptions<T> {
  includeMetadataChanges?: boolean | undefined;
}

export interface SerializedOptions<
  AppModelType,
  DbModelType extends DocumentData = DocumentData,
> {
  converter?: FirestoreDataConverter<AppModelType, DbModelType> | undefined;
  includeMetadataChanges?: boolean | undefined;
}

const warnedConverters = /*#__PURE__*/ new WeakSet<object>();

function checkConverterWarning(
  a: Query<unknown, DocumentData> | DocumentReference<unknown, DocumentData>,
  b: Query<unknown, DocumentData> | DocumentReference<unknown, DocumentData>,
  equalFn: (x: any, y: any) => boolean
): void {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
    .process?.env?.NODE_ENV;
  if (
    env !== 'production' &&
    a.converter !== b.converter &&
    a.converter !== null &&
    b.converter !== null &&
    !warnedConverters.has(b.converter) &&
    equalFn(a.withConverter(null), b.withConverter(null))
  ) {
    warnedConverters.add(b.converter);
    console.warn(
      '[reactfire] Inline `.withConverter({...})` detected during render. ' +
        'Because `queryEqual`/`refEqual` compares converter references with `===`, ' +
        'creating a new converter object on every render forces Firestore to re-subscribe. ' +
        'Hoist your converter to module scope or wrap it in `useMemo`.'
    );
  }
}

function safeRefEqual(
  a: DocumentReference<any, any>,
  b: DocumentReference<any, any>
): boolean {
  if (refEqual(a, b)) return true;
  checkConverterWarning(a, b, refEqual);
  return false;
}

function safeQueryEqual(a: Query<any, any>, b: Query<any, any>): boolean {
  if (queryEqual(a, b)) return true;
  checkConverterWarning(a, b, queryEqual);
  return false;
}

function sameSerializedSnapshot(a: object, b: object): boolean {
  if (a === b) return true;
  const aj = a as { bundle?: unknown; bundleName?: unknown };
  const bj = b as { bundle?: unknown; bundleName?: unknown };
  return (
    typeof aj?.bundle === 'string' &&
    aj.bundleName === bj?.bundleName &&
    aj.bundle === bj?.bundle
  );
}

// --- Document & Collection Hooks ---

export function useFirestoreDoc<T = DocumentData>(
  ref: DocumentReference<T, any> | DocumentReference<DocumentData, any> | null | undefined,
  options?: FirestoreOptions<DocumentSnapshot<T>>
): ListenResult<DocumentSnapshot<T>> {
  const stableRef = useStableRef(ref, safeRefEqual);
  const includeMetadataChanges = !!options?.includeMetadataChanges;

  const [state, setState] = useState<ListenResult<DocumentSnapshot<T>>>(() =>
    !stableRef
      ? idleStatus()
      : options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
  );

  useEffect(() => {
    if (!stableRef) {
      setState(idleStatus());
      return;
    }
    setState(
      options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
    );
    return onSnapshot(
      stableRef as DocumentReference<T, any>,
      { includeMetadataChanges },
      (snap) => setState(successStatus(snap)),
      (err) => setState((prev) => errorStatus(err, prev.data))
    );
  }, [stableRef, includeMetadataChanges]);

  return state;
}

export function useFirestoreCollection<T = DocumentData>(
  query: Query<T, any> | Query<DocumentData, any> | null | undefined,
  options?: FirestoreOptions<QuerySnapshot<T>>
): ListenResult<QuerySnapshot<T>> {
  const stableQuery = useStableRef(query, safeQueryEqual);
  const includeMetadataChanges = !!options?.includeMetadataChanges;

  const [state, setState] = useState<ListenResult<QuerySnapshot<T>>>(() =>
    !stableQuery
      ? idleStatus()
      : options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
  );

  useEffect(() => {
    if (!stableQuery) {
      setState(idleStatus());
      return;
    }
    setState(
      options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
    );
    return onSnapshot(
      stableQuery as Query<T, any>,
      { includeMetadataChanges },
      (snap) => setState(successStatus(snap)),
      (err) => setState((prev) => errorStatus(err, prev.data))
    );
  }, [stableQuery, includeMetadataChanges]);

  return state;
}

// --- SSR / Router Serialized Snapshot Hooks (`querySnapshotFromJSON` + `onSnapshotResume`) ---

export function useFirestoreSerializedQuery<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  db: Firestore,
  serializedSnapshot: object,
  options?: SerializedOptions<AppModelType, DbModelType>
): SeededListenResult<QuerySnapshot<AppModelType, DbModelType>> {
  const stableJson = useStableRef(serializedSnapshot, sameSerializedSnapshot);
  const converter = options?.converter;
  const includeMetadataChanges = !!options?.includeMetadataChanges;

  const initialSnap = useMemo(
    () =>
      converter
        ? querySnapshotFromJSON(db, stableJson, converter)
        : (querySnapshotFromJSON(db, stableJson) as QuerySnapshot<
            AppModelType,
            DbModelType
          >),
    [db, stableJson, converter]
  );

  const [state, setState] = useState<
    SeededListenResult<QuerySnapshot<AppModelType, DbModelType>>
  >(() => successStatus(initialSnap));

  useEffect(() => {
    setState(successStatus(initialSnap));
    return onSnapshotResume(
      db,
      stableJson,
      { includeMetadataChanges },
      (snap: QuerySnapshot<AppModelType, DbModelType>) => {
        if (converter && snap.query.converter !== converter) {
          try {
            (snap as { query: Query<AppModelType, DbModelType> }).query =
              snap.query.withConverter(converter);
          } catch {
            // Ignore if a test mock defines `query` as a getter-only property
          }
        }
        setState(successStatus(snap));
      },
      (err: FirestoreError) => setState((prev) => errorStatus(err, prev.data)),
      undefined,
      converter as FirestoreDataConverter<DbModelType> | undefined
    );
  }, [db, stableJson, converter, includeMetadataChanges, initialSnap]);

  return state;
}

export function useFirestoreSerializedDoc<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  db: Firestore,
  serializedSnapshot: object,
  options?: SerializedOptions<AppModelType, DbModelType>
): SeededListenResult<DocumentSnapshot<AppModelType, DbModelType>> {
  const stableJson = useStableRef(serializedSnapshot, sameSerializedSnapshot);
  const converter = options?.converter;
  const includeMetadataChanges = !!options?.includeMetadataChanges;

  const initialSnap = useMemo(
    () =>
      converter
        ? documentSnapshotFromJSON(db, stableJson, converter)
        : (documentSnapshotFromJSON(db, stableJson) as DocumentSnapshot<
            AppModelType,
            DbModelType
          >),
    [db, stableJson, converter]
  );

  const [state, setState] = useState<
    SeededListenResult<DocumentSnapshot<AppModelType, DbModelType>>
  >(() => successStatus(initialSnap));

  useEffect(() => {
    setState(successStatus(initialSnap));
    return onSnapshotResume(
      db,
      stableJson,
      { includeMetadataChanges },
      (snap: DocumentSnapshot<AppModelType, DbModelType>) => setState(successStatus(snap)),
      (err: FirestoreError) => setState((prev) => errorStatus(err, prev.data)),
      undefined,
      converter as FirestoreDataConverter<DbModelType> | undefined
    );
  }, [db, stableJson, converter, includeMetadataChanges, initialSnap]);

  return state;
}
