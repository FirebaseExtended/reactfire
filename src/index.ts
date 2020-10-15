export interface ReactFireOptions<T = unknown> {
  idField?: string;
  initialData?: T | any;
  suspense?: boolean;
}

export function checkOptions(options: ReactFireOptions, field: string) {
  // make sure the field passed in is a valid key of ReactFire Options
  if (field === 'idField' || field === 'initialData' || field === 'suspense') {
    return options ? (options[field] as ReactFireOptions['idField'] | ReactFireOptions['initialData'] | ReactFireOptions['suspense']) : undefined;
  }

  throw new Error(`Field "${field}" is not a valid key in ReactFireOptions`);
}

export function checkinitialData(options: ReactFireOptions) {
  return checkOptions(options, 'initialData');
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
