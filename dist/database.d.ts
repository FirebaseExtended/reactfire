import { QueryChange } from 'rxfire/database';
import { ReactFireOptions, ObservableStatus } from './';
import type { Query as DatabaseQuery, DatabaseReference } from 'firebase/database';
/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */
export declare function useDatabaseObject<T = unknown>(ref: DatabaseReference, options?: ReactFireOptions<T>): ObservableStatus<QueryChange | T>;
export declare function useDatabaseObjectData<T>(ref: DatabaseReference, options?: ReactFireOptions<T>): ObservableStatus<T>;
/**
 * Subscribe to a Realtime Database list
 *
 * @param ref - Reference to the DB List you want to listen to
 * @param options
 */
export declare function useDatabaseList<T = {
    [key: string]: unknown;
}>(ref: DatabaseReference | DatabaseQuery, options?: ReactFireOptions<T[]>): ObservableStatus<QueryChange[] | T[]>;
export declare function useDatabaseListData<T = {
    [key: string]: unknown;
}>(ref: DatabaseReference | DatabaseQuery, options?: ReactFireOptions<T[]>): ObservableStatus<T[] | null>;
