export interface ReactFireOptions<T = unknown> {
  startWithValue?: T;
  idField?: string;
}

export function checkOptions(options: ReactFireOptions, field: string) {
  return options ? options[field] : undefined;
}

export function checkStartWithValue(options: ReactFireOptions) {
  return checkOptions(options, 'startWithValue');
}

export function checkIdField(options: ReactFireOptions) {
  return checkOptions(options, 'idField');
}

export * from './auth';
export * from './database';
export * from './firebaseApp';
export * from './firestore';
export * from './performance';
export * from './remote-config';
export * from './storage';
export * from './useObservable';
