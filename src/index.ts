import { SuspenseSubject } from './SuspenseSubject.js';

import type { Query as FirestoreQuery } from 'firebase/firestore';
import type { Query as DatabaseQuery } from 'firebase/database';

/**
 * @deprecated Internal global cache type. Will be removed in v5.0.0.
 */
export type ReactFireGlobals = {
  _reactFireDatabaseCachedQueries: Array<DatabaseQuery>;
  _reactFireFirestoreQueryCache: Array<FirestoreQuery>;
  _reactFirePreloadedObservables: Map<string, SuspenseSubject<any>>;
};

export {
  ReactFireError,
  ReactFireOptions,
  ReactFireUsable,
  ObservableStatus,
  checkOptions,
  checkinitialData,
  checkIdField,
} from './useFirebaseStream.js';

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
