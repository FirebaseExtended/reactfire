import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';
import * as React from 'react';
import { RemoteConfigProvider, useRemoteConfigString, useInitRemoteConfig, SuspenseWithPerf, useFirebaseApp } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

export const RcString = ({ messageKey }) => {
  const { data: messageValue } = useRemoteConfigString(messageKey);

  return (
    <CardSection title="Retrieve string 'message'">
      <span>{messageValue}</span>
    </CardSection>
  );
};

const RemoteConfigWrapper = ({ children }) => {
  const app = useFirebaseApp();
  return <RemoteConfigProvider sdk={getRemoteConfig(app)}>{children}</RemoteConfigProvider>;
};

export const RemoteConfig = () => {
  useInitRemoteConfig(async (firebaseApp) => {
    const remoteConfig = getRemoteConfig(firebaseApp);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 10000,
      fetchTimeoutMillis: 10000,
    };

    const result = await fetchAndActivate(remoteConfig);
    console.debug(performance.now(), `Fetch and Active result: ${result}`);
    return remoteConfig;
  }, {suspense: false});
  return (
    <SuspenseWithPerf traceId={'remote-config-message'} fallback={<LoadingSpinner />}>
      <RemoteConfigWrapper>
        <RcString messageKey="message" />
      </RemoteConfigWrapper>
    </SuspenseWithPerf>
  );
};
