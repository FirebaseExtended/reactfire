import { useEffect, useState } from 'react';
import {
  onValue,
  type DataSnapshot,
  type Query as DatabaseQuery,
} from 'firebase/database';
import {
  errorStatus,
  idleStatus,
  loadingStatus,
  successStatus,
  useStableRef,
  type ListenOptions,
  type ListenResult,
} from './core.js';

export type DatabaseOptions<T> = ListenOptions<T>;

const sameDbQuery = (a: DatabaseQuery, b: DatabaseQuery) => a.isEqual(b);

export function useDatabaseObject(
  query: DatabaseQuery | null | undefined,
  options?: DatabaseOptions<DataSnapshot>
): ListenResult<DataSnapshot> {
  const stableQuery = useStableRef(query, sameDbQuery);
  const [state, setState] = useState<ListenResult<DataSnapshot>>(() =>
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
    return onValue(
      stableQuery,
      (snap) => setState(successStatus(snap)),
      (err) => setState((prev) => errorStatus(err, prev.data))
    );
  }, [stableQuery]);

  return state;
}

export function useDatabaseList(
  query: DatabaseQuery | null | undefined,
  options?: DatabaseOptions<DataSnapshot[]>
): ListenResult<DataSnapshot[]> {
  const stableQuery = useStableRef(query, sameDbQuery);
  const [state, setState] = useState<ListenResult<DataSnapshot[]>>(() =>
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
    return onValue(
      stableQuery,
      (snap) => {
        const items: DataSnapshot[] = [];
        snap.forEach((child) => {
          items.push(child);
        });
        setState(successStatus(items));
      },
      (err) => setState((prev) => errorStatus(err, prev.data))
    );
  }, [stableQuery]);

  return state;
}
