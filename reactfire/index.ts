export interface ReactFireOptions<T = unknown> {
  startWithValue?: T;
  idField?: string;
}

export * from './auth';
export * from './database';
export * from './firebaseApp';
export * from './firestore';
export * from './performance';
export * from './remote-config';
export * from './storage';
export * from './useObservable';
