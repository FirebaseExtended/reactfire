import { SuspenseSubject } from './SuspenseSubject.js';

import type { Query as FirestoreQuery } from 'firebase/firestore';
import type { Query as DatabaseQuery } from 'firebase/database';

export type ReactFireGlobals = {
  _reactFireDatabaseCachedQueries: Array<DatabaseQuery>;
  _reactFireFirestoreQueryCache: Array<FirestoreQuery>;
  _reactFirePreloadedObservables: Map<string, SuspenseSubject<any>>;
};

export interface ReactFireOptions<T = unknown> {
  idField?: string;
  initialData?: T | any;
  /**
   * @deprecated use initialData instead
   */
  startWithValue?: T | any;
  suspense?: boolean;
}

export { ReactFireError, checkOptions, checkinitialData, checkIdField } from './utils.js';
export * from './auth.js';
export * from './database.js';
export * from './firebaseApp.js';
export * from './firestore.js';
export * from './functions.js';
export * from './performance.js';
export * from './remote-config.js';
export * from './storage.js';
export * from './useObservable.js';
export * from './sdk.js';
