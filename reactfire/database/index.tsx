import { database } from 'firebase/app';
import { list, object, QueryChange } from 'rxfire/database';
import { ReactFireOptions, useObservable } from '..';

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
    `RTDB: ${ref.toString()}`,
    options ? options.startWithValue : undefined
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
  const hash = `RTDB: ${ref.toString()}|${(ref as _QueryWithId).queryIdentifier()}`;

  return useObservable(
    list(ref),
    hash,
    options ? options.startWithValue : undefined
  );
}
