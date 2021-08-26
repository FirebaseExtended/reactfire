import { list, object, QueryChange, listVal, objectVal } from 'rxfire/database';
import { ReactFireOptions, useObservable, checkIdField, ObservableStatus, ReactFireGlobals } from './';

import type { Query as DatabaseQuery, DatabaseReference } from 'firebase/database';

// Since we're side-effect free, we need to ensure our observableId cache is global
const cachedQueries: Array<DatabaseQuery> = (globalThis as any as ReactFireGlobals)._reactFireDatabaseCachedQueries || [];

if (!(globalThis as any as ReactFireGlobals)._reactFireDatabaseCachedQueries) {
  (globalThis as any as ReactFireGlobals)._reactFireDatabaseCachedQueries = cachedQueries;
}

function getUniqueIdForDatabaseQuery(query: DatabaseQuery) {
  const index = cachedQueries.findIndex((cachedQuery) => cachedQuery.isEqual(query));
  if (index > -1) {
    return index;
  }
  return cachedQueries.push(query) - 1;
}

/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */
export function useDatabaseObject<T = unknown>(ref: DatabaseReference, options?: ReactFireOptions<T>): ObservableStatus<QueryChange | T> {
  const observableId = `database:object:${ref.toString()}`;
  const observable$ = object(ref);

  return useObservable(observableId, observable$, options);
}

export function useDatabaseObjectData<T>(ref: DatabaseReference, options?: ReactFireOptions<T>): ObservableStatus<T> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  const observableId = `database:objectVal:${ref.toString()}:idField=${idField}`;
  const observable$ = objectVal<T>(ref, { keyField: idField });

  return useObservable(observableId, observable$, options);
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
  const hash = `database:list:${getUniqueIdForDatabaseQuery(ref)}`;
  const observable$ = list(ref);

  return useObservable(hash, observable$, options);
}

export function useDatabaseListData<T = { [key: string]: unknown }>(
  ref: DatabaseReference | DatabaseQuery,
  options?: ReactFireOptions<T[]>
): ObservableStatus<T[] | null> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  const observableId = `database:listVal:${getUniqueIdForDatabaseQuery(ref)}:idField=${idField}`;
  const observable$ = listVal<T>(ref, { keyField: idField });
  return useObservable(observableId, observable$, options);
}
