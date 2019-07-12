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
    ref.toString(),
    options ? options.startWithValue : undefined
  );
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
  return useObservable(
    list(ref),
    ref.toString(),
    options ? options.startWithValue : undefined
  );
}
