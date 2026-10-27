import { useRemoteConfig } from './sdk.js';
import { ObservableStatus, createInFlightCache, useFirebaseStream } from './useFirebaseStream.js';
import {
  ensureInitialized,
  getValue,
  getString,
  getBoolean,
  getNumber,
  getAll,
  RemoteConfig,
  Value as RemoteConfigValue,
} from 'firebase/remote-config';

/**
 * @deprecated Use `getAll(remoteConfig)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
 */
export type AllParameters = {
  [key: string]: RemoteConfigValue;
};

type Getter<T> = (remoteConfig: RemoteConfig, key: string) => T;

const initializedRemoteConfigs = new WeakSet<RemoteConfig>();
const remoteConfigCache = createInFlightCache<{ remoteConfig: RemoteConfig; key: string }, any>(
  (a, b) => a.remoteConfig === b.remoteConfig && a.key === b.key
);

/**
 * Helper function to construct type safe functions. Since Remote Config has
 * methods that return different types for values, we need to be extra safe
 * to make sure we are not returning improper types by accident.
 * @param key
 * @param getter
 * @param remoteConfig
 */
function useRemoteConfigValue_INTERNAL<T>(key: string, getter: Getter<T>): ObservableStatus<T> {
  const remoteConfig = useRemoteConfig();
  const ref = { remoteConfig, key };

  return useFirebaseStream<{ remoteConfig: RemoteConfig; key: string }, T>({
    ref,
    isEqual: (a, b) => a.remoteConfig === b.remoteConfig && a.key === b.key,
    inFlight: remoteConfigCache.handle(ref, () =>
      ensureInitialized(remoteConfig).then(() => {
        initializedRemoteConfigs.add(remoteConfig);
        return getter(remoteConfig, key);
      })
    ),
    getSyncInitialValue: () =>
      initializedRemoteConfigs.has(remoteConfig)
        ? { hasValue: true, value: getter(remoteConfig, key), isComplete: true }
        : { hasValue: false, value: undefined as unknown as T },
    subscribe: (onNext, onError) => {
      if (initializedRemoteConfigs.has(remoteConfig)) {
        onNext(getter(remoteConfig, key), true);
        return () => {};
      }
      ensureInitialized(remoteConfig).then(
        () => {
          initializedRemoteConfigs.add(remoteConfig);
          onNext(getter(remoteConfig, key), true);
        },
        (err) => onError(err)
      );
      return () => {};
    },
    defaultIsComplete: true,
  });
}

/**
 * Accepts a key and optionally a Remote Config instance. Returns a
 * Remote Config Value.
 *
 * @deprecated Call `fetchAndActivate(remoteConfig)` and synchronous getters (`getValue(remoteConfig, key)`) from `firebase/remote-config` directly. Will be removed in v5.0.0.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigValue(key: string): ObservableStatus<RemoteConfigValue> {
  return useRemoteConfigValue_INTERNAL<RemoteConfigValue>(key, getValue);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.
 *
 * @deprecated Call `fetchAndActivate(remoteConfig)` and `getString(remoteConfig, key)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigString(key: string): ObservableStatus<string> {
  return useRemoteConfigValue_INTERNAL<string>(key, getString);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.
 *
 * @deprecated Call `fetchAndActivate(remoteConfig)` and `getNumber(remoteConfig, key)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigNumber(key: string): ObservableStatus<number> {
  return useRemoteConfigValue_INTERNAL<number>(key, getNumber);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.
 *
 * @deprecated Call `fetchAndActivate(remoteConfig)` and `getBoolean(remoteConfig, key)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigBoolean(key: string): ObservableStatus<boolean> {
  return useRemoteConfigValue_INTERNAL<boolean>(key, getBoolean);
}

/**
 * Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.
 *
 * @deprecated Call `fetchAndActivate(remoteConfig)` and `getAll(remoteConfig)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
 * @param key The parameter key in Remote Config
 */
export function useRemoteConfigAll(key: string): ObservableStatus<AllParameters> {
  return useRemoteConfigValue_INTERNAL<AllParameters>(key, (rc) => getAll(rc));
}
