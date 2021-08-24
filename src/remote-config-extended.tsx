// @TODO Delete file if https://github.com/FirebaseExtended/rxfire/pull/27/ goes through.
import { Observable } from 'rxjs';

import { ensureInitialized, getString as baseGetString } from 'firebase/remote-config';

import type { RemoteConfig } from 'firebase/remote-config';

interface ParameterSettings<T> {
  remoteConfig: RemoteConfig;
  key: string;
  getter: (remoteConfig: RemoteConfig, key: string) => T;
}

function parameter$<T>({ remoteConfig, key, getter }: ParameterSettings<T>): Observable<T> {
  return new Observable((subscriber) => {
    ensureInitialized(remoteConfig).then(() => {
      // 'this' for the getter loses context in the next()
      // call, so it needs to be bound.
      const boundGetter = getter.bind(remoteConfig);
      subscriber.next(boundGetter(remoteConfig, key));
    });
  });
}

export function getJSON<T>(remoteConfig: RemoteConfig, key: string) {
  const getter = (remoteConfig: RemoteConfig, key: string) => JSON.parse(baseGetString(remoteConfig, key)) as T;
  return parameter$<T>({ remoteConfig, key, getter });
}
