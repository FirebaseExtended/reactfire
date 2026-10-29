import { useEffect, useState } from 'react';
import {
  ensureInitialized,
  getValue,
  type RemoteConfig,
  type Value as RemoteConfigValue,
} from 'firebase/remote-config';
import {
  errorStatus,
  loadingStatus,
  successStatus,
  type ListenOptions,
  type ListenResult,
} from './core.js';

export function useRemoteConfigValue(
  remoteConfig: RemoteConfig,
  key: string,
  options?: ListenOptions<RemoteConfigValue>
): ListenResult<RemoteConfigValue> {
  const [state, setState] = useState<ListenResult<RemoteConfigValue>>(() =>
    options?.initialData !== undefined
      ? successStatus(options.initialData)
      : loadingStatus()
  );

  useEffect(() => {
    setState(
      options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
    );
    let active = true;
    ensureInitialized(remoteConfig).then(
      () => active && setState(successStatus(getValue(remoteConfig, key))),
      (e) => {
        if (active) {
          const err = e instanceof Error ? e : new Error(String(e));
          setState((prev) => errorStatus(err, prev.data));
        }
      }
    );
    return () => {
      active = false;
    };
  }, [remoteConfig, key]);

  return state;
}
