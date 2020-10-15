import { database } from 'firebase/app';
import { list, object, QueryChange, listVal } from 'rxfire/database';
import { ReactFireOptions, useObservable, checkIdField, ObservableStatus } from './';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const CACHED_QUERIES = '_reactFireDatabaseCachedQueries';

// Since we're side-effect free, we need to ensure our observableId cache is global
// @ts-ignore: TS doesn't like globalThis
const cachedQueries: Array<database.Query> = globalThis[CACHED_QUERIES] || [];

// @ts-ignore: TS doesn't like globalThis
if (!globalThis[CACHED_QUERIES]) {
  // @ts-ignore: TS doesn't like globalThis
  globalThis[CACHED_QUERIES] = cachedQueries;
}

function getUniqueIdForDatabaseQuery(query: database.Query) {
  const index = cachedQueries.findIndex(cachedQuery => cachedQuery.isEqual(query));
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
export function useDatabaseObject<T = unknown>(ref: database.Reference, options?: ReactFireOptions<T>): ObservableStatus<QueryChange | T> {
  const observableId = `database:object:${ref.toString()}`;
  const observable$ = object(ref);

  return useObservable(observableId, observable$, options);
}

// ============================================================================
// TODO: switch to rxfire's objectVal once this PR is merged:
// https://github.com/firebase/firebase-js-sdk/pull/2352

function objectVal<T>(query: database.Query, keyField?: string): Observable<T> {
  return object(query).pipe(map(change => changeToData(change, keyField) as T));
}

function changeToData(change: QueryChange, keyField?: string): {} {
  const val = change.snapshot.val();

  // don't worry about setting IDs if the value is a primitive type
  if (typeof val !== 'object') {
    return val;
  }

  return {
    ...change.snapshot.val(),
    ...(keyField ? { [keyField]: change.snapshot.key } : null)
  };
}
// ============================================================================

export function useDatabaseObjectData<T>(ref: database.Reference, options?: ReactFireOptions<T>): ObservableStatus<T> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  const observableId = `database:objectVal:${ref.toString()}:idField=${idField}`;
  const observable$ = objectVal(ref, idField);

  return useObservable(observableId, observable$, options);
}

/**
 * Subscribe to a Realtime Database list
 *
 * @param ref - Reference to the DB List you want to listen to
 * @param options
 */
export function useDatabaseList<T = { [key: string]: unknown }>(
  ref: database.Reference | database.Query,
  options?: ReactFireOptions<T[]>
): ObservableStatus<QueryChange[] | T[]> {
  const hash = `database:list:${getUniqueIdForDatabaseQuery(ref)}`;
  const observable$ = list(ref);

  return useObservable(hash, observable$, options);
}

export function useDatabaseListData<T = { [key: string]: unknown }>(
  ref: database.Reference | database.Query,
  options?: ReactFireOptions<T[]>
): ObservableStatus<T[]> {
  const idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  const observableId = `database:listVal:${getUniqueIdForDatabaseQuery(ref)}:idField=${idField}`;
  const observable$ = listVal(ref, idField);
  return useObservable(observableId, observable$, options);
}
