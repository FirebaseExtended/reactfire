import * as firebase from 'firebase/app';
import * as React from 'react';

type RemoteConfig = firebase.remoteConfig.RemoteConfig;
type RemoteConfigSettings = firebase.remoteConfig.Settings;
type RemoteConfigContextValue = RemoteConfig;

const a: RemoteConfigSettings = {
  minimumFetchIntervalMillis: 100,
  fetchTimeoutMillis: 4000
};

const RemoteConfigContext = React.createContext<
  RemoteConfigContextValue | undefined
>(undefined);

interface RemoteConfigProviderOptions {
  activate: boolean;
  fetchInterval?: number;
  fetchTimeout?: number;
  remoteConfig?: RemoteConfig;
}

export function RemoteConfigProvider(props: RemoteConfigProviderOptions) {
  let { activate, fetchInterval, fetchTimeout, remoteConfig } = props;
  activate = activate || true;

  remoteConfig =
    remoteConfig ||
    React.useMemo(() => {
      if (!firebase.remoteConfig) {
        throw new Error(
          'firebase.remoteConfig not found. Did you forget to import it?'
        );
      }
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
