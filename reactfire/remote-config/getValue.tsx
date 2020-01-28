import { remoteConfig } from 'firebase/app';
import { Observable } from 'rxjs';

type AllParameters = {
  [key: string]: remoteConfig.Value;
};

// TODO(davideast): Replace with RxFire functions when they land
export function getValue(remoteConfig: remoteConfig.RemoteConfig, key: string) {
  return new Observable(subscriber => {
    remoteConfig.ensureInitialized().then(() => {
      subscriber.next(remoteConfig.getValue(key));
    });
  });
}

interface ParameterSettings<T> {
  remoteConfig: remoteConfig.RemoteConfig;
  key: string;
  getter: (key: string) => T;
}

function parameter$<T>({ remoteConfig, key, getter }: ParameterSettings<T>) {
  return new Observable(subscriber => {
    remoteConfig.ensureInitialized().then(() => {
      subscriber.next(getter(key));
    });
  });
}

export function getString(
  remoteConfig: remoteConfig.RemoteConfig,
  key: string
) {
  const getter = remoteConfig.getString;
  return parameter$<string>({ remoteConfig, key, getter });
}

export function getNumber(
  remoteConfig: remoteConfig.RemoteConfig,
  key: string
) {
  const getter = remoteConfig.getNumber;
  return parameter$<number>({ remoteConfig, key, getter });
}

export function getBoolean(
  remoteConfig: remoteConfig.RemoteConfig,
  key: string
) {
  const getter = remoteConfig.getBoolean;
  return parameter$<boolean>({ remoteConfig, key, getter });
}

export function getObject(
  remoteConfig: remoteConfig.RemoteConfig,
  key: string
) {
  const getter = remoteConfig.getAll;
  return parameter$<AllParameters>({ remoteConfig, key, getter });
}
