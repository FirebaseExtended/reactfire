import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { RemoteConfigProvider, useRemoteConfigString, useInitRemoteConfig } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

export const RcString = ({ messageKey }) => {
  const { status, data: messageValue } = useRemoteConfigString(messageKey);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  return (
    <CardSection title="Retrieve string 'message'">
      <span>{messageValue}</span>
    </CardSection>
  );
};

export const RemoteConfig = () => {
  const { status, data: remoteConfigInstance } = useInitRemoteConfig(async (firebaseApp) => {
    const remoteConfig = getRemoteConfig(firebaseApp);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 10000,
      fetchTimeoutMillis: 10000,
    };
    await fetchAndActivate(remoteConfig);
    return remoteConfig;
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <RemoteConfigProvider sdk={remoteConfigInstance}>
      <RcString messageKey="message" />
    </RemoteConfigProvider>
  );
};
