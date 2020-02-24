import { database } from 'firebase/app';
import { list, object, QueryChange, listVal } from 'rxfire/database';
import {
  ReactFireOptions,
  useObservable,
  checkIdField,
  checkStartWithValue
} from '..';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */
export function useDatabaseObject<T = unknown>(
  ref: database.Reference,
  options?: ReactFireOptions<T>
): QueryChange | T {
  return useObservable(
    object(ref),
    `database:object:${ref.toString()}`,
    options ? options.startWithValue : undefined
  );
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

export function useDatabaseObjectData<T>(
  ref: database.Reference,
  options?: ReactFireOptions<T>
): T {
  const idField = checkIdField(options);
  return useObservable(
    objectVal(ref, idField),
    `database:objectVal:${ref.toString()}:idField=${idField}`,
    checkStartWithValue(options)
  );
}

// Realtime Database has an undocumented method
// that helps us build a unique ID for the query
// https://github.com/firebase/firebase-js-sdk/blob/aca99669dd8ed096f189578c47a56a8644ac62e6/packages/database/src/api/Query.ts#L601
interface _QueryWithId extends database.Query {
  queryIdentifier(): string;
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
): QueryChange[] | T[] {
  const hash = `database:list:${ref.toString()}|${(ref as _QueryWithId).queryIdentifier()}`;

  return useObservable(
    list(ref),
    hash,
    options ? options.startWithValue : undefined
  );
}

export function useDatabaseListData<T = { [key: string]: unknown }>(
  ref: database.Reference | database.Query,
  options?: ReactFireOptions<T[]>
): T[] {
  const idField = checkIdField(options);
  return useObservable(
    listVal(ref, idField),
    `database:listVal:${ref.toString()}|${(ref as _QueryWithId).queryIdentifier()}:idField=${idField}`,
    checkStartWithValue(options)
  );
}
