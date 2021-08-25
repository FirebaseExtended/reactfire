import { useRemoteConfig } from './';
import { useObservable, ObservableStatus } from './useObservable';
import { getValue, getString, getBoolean, getNumber, getAll, AllParameters } from 'rxfire/remote-config';
import { Observable } from 'rxjs';
import type { RemoteConfig, Value as RemoteConfigValue } from 'firebase/remote-config';

//TODO: Remove if https://github.com/FirebaseExtended/rxfire/pull/27/ get integrated
import { ensureInitialized, getString as baseGetString } from 'firebase/remote-config';

type Getter$<T> = (remoteConfig: RemoteConfig, key: string) => Observable<T>;

/**
 * Helper function to construct type safe functions. Since Remote Config has
 * methods that return different types for values, we need to be extra safe
 * to make sure we are not returning improper types by accident.
 * @param key
 * @param getter
 * @param remoteConfig
 */
function useRemoteConfigValue_INTERNAL<T>(key: string, getter: Getter$<T>): ObservableStatus<T> {
  const remoteConfig = useRemoteConfig();

  const appName = remoteConfig.app.name;
  const $value = getter(remoteConfig, key);

  const observableId = `remoteConfig:${key}:${getter.name}:${appName}`;
  return useObservable<T>(observableId, $value);
}

/**
 * Accepts a key and optionally a Remote Config instance. Returns a
 * Remote Config Value.
 *
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigValue(key: string): ObservableStatus<RemoteConfigValue> {
  return useRemoteConfigValue_INTERNAL<RemoteConfigValue>(key, getValue);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigString(key: string): ObservableStatus<string> {
  return useRemoteConfigValue_INTERNAL<string>(key, getString);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigNumber(key: string): ObservableStatus<number> {
  return useRemoteConfigValue_INTERNAL<number>(key, getNumber);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigBoolean(key: string): ObservableStatus<boolean> {
  return useRemoteConfigValue_INTERNAL<boolean>(key, getBoolean);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigAll(key: string): ObservableStatus<AllParameters> {
  return useRemoteConfigValue_INTERNAL<AllParameters>(key, getAll);
}

// ============================================================================
// TODO: Remove if https://github.com/FirebaseExtended/rxfire/pull/27/ gets integrated. Replace getJSON with getJSON from rxfire
/**
 * Pulled from rxfire
 * **/
interface ParameterSettings<T> {
  remoteConfig: RemoteConfig;
  key: string;
  getter: (remoteConfig: RemoteConfig, key: string) => T;
}
/**
 * Pulled from rxfire
 * **/
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
/**
 * Modified version of rxfire getter
 * **/
function getJSON<T>(remoteConfig: RemoteConfig, key: string) {
  const getter = (remoteConfig: RemoteConfig, key: string) => JSON.parse(baseGetString(remoteConfig, key)) as T;
  return parameter$<T>({ remoteConfig, key, getter });
}
// ============================================================================

/**
 * Convience method that runs the retrieves remote config value through JSON.parse.
 * Provides no typing checking assurances.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigJSON<T>(key: string): ObservableStatus<T> {
  return useRemoteConfigValue_INTERNAL<T>(key, getJSON);
}
