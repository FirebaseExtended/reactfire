import { Observable } from 'rxjs';

type RemoteConfig = import('firebase/app').default.remoteConfig.RemoteConfig;
type RemoteConfigValue = import('firebase/app').default.remoteConfig.Value;

export type AllParameters = {
  [key: string]: RemoteConfigValue;
};

interface ParameterSettings<T> {
  remoteConfig: RemoteConfig;
  key: string;
  getter: (key: string) => T;
}

// TODO(davideast): Replace with RxFire functions when they land
function parameter$<T>({ remoteConfig, key, getter }: ParameterSettings<T>): Observable<T> {
  return new Observable(subscriber => {
    remoteConfig.ensureInitialized().then(() => {
      // 'this' for the getter loses context in the next()
      // call, so it needs to be bound.
      subscriber.next(getter.bind(remoteConfig)(key));
    });
  });
}

export function getValue(remoteConfig: RemoteConfig, key: string) {
  const getter = remoteConfig.getValue;
  return parameter$({ remoteConfig, key, getter });
}

export function getString(remoteConfig: RemoteConfig, key: string) {
  const getter = remoteConfig.getString;
  return parameter$<string>({ remoteConfig, key, getter });
}

export function getNumber(remoteConfig: RemoteConfig, key: string) {
  const getter = remoteConfig.getNumber;
  return parameter$<number>({ remoteConfig, key, getter });
}

export function getBoolean(remoteConfig: RemoteConfig, key: string) {
  const getter = remoteConfig.getBoolean;
  return parameter$<boolean>({ remoteConfig, key, getter });
}

export function getAll(remoteConfig: RemoteConfig) {
  const getter = remoteConfig.getAll;
  // No key is needed for getAll()
  return parameter$<AllParameters>({ remoteConfig, key: '', getter });
}
