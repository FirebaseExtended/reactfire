import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';
import * as React from 'react';
import { RemoteConfigProvider, useRemoteConfigString, useInitRemoteConfig, SuspenseWithPerf } from 'reactfire';
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
  const { data: remoteConfigInstance } = useInitRemoteConfig(async (firebaseApp) => {
    const remoteConfig = getRemoteConfig(firebaseApp);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 10000,
      fetchTimeoutMillis: 10000,
    };
    await fetchAndActivate(remoteConfig);
    return remoteConfig;
  });

  return <RemoteConfigProvider sdk={remoteConfigInstance}>{children}</RemoteConfigProvider>;
};

export const RemoteConfig = () => {
  return (
    <SuspenseWithPerf traceId={'remote-config-message'} fallback={<LoadingSpinner />}>
      <RemoteConfigWrapper>
        <RcString messageKey="message" />
      </RemoteConfigWrapper>
    </SuspenseWithPerf>
  );
};
