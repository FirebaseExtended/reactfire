import { useRemoteConfig } from '../firebaseApp';
import { useObservable } from '../useObservable';
import { getValue } from './getValue';

type RemoteConfig = import('firebase/app').remoteConfig.RemoteConfig;

export function useRemoteConfigValue(key: string, remoteConfig?: RemoteConfig) {
  remoteConfig = remoteConfig || useRemoteConfig()();
  const $value = getValue(remoteConfig, key);
  return useObservable($value, `remoteconfig:${key}`);
}
