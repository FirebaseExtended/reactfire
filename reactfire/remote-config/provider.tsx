import * as firebase from 'firebase/app';
import * as React from 'react';
import { useRemoteConfig } from '../firebaseApp';

type RemoteConfig = firebase.remoteConfig.RemoteConfig;
type RemoteConfigContextValue = RemoteConfig;

const RemoteConfigContext = React.createContext<
  RemoteConfigContextValue | undefined
>(undefined);

interface RemoteConfigProviderOptions {
  activate: boolean;
  fetchInterval?: number;
  fetchTimeout?: number;
  remoteConfig?: RemoteConfig;
}

/**
 * Initialize an instance of RemoteConfig with custom settings
 * @param props `{
    activate: boolean;
    fetchInterval?: number;
    fetchTimeout?: number;
    remoteConfig?: RemoteConfig;
  }`
 *  
 */
export function RemoteConfigProvider(props: RemoteConfigProviderOptions) {
  let { activate, fetchInterval, fetchTimeout, remoteConfig } = props;
  activate = activate || true;

  // use the provided remoteConfig or initialize a new one
  remoteConfig = remoteConfig || useRemoteConfig()();

  // No need to reactivate rc for each render, memoize instead
  React.useMemo(() => {
    if (activate) {
      remoteConfig.activate();
    }
    remoteConfig.settings = {
      minimumFetchIntervalMillis: fetchInterval,
      fetchTimeoutMillis: fetchTimeout
    };
    return remoteConfig;
  }, [activate, fetchInterval, fetchTimeout, remoteConfig]);

  return <RemoteConfigContext.Provider value={remoteConfig} {...props} />;
}
