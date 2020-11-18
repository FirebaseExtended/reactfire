import * as React from 'react';
import { useEffect, useState } from 'react';
import { preloadRemoteConfig, useFirebaseApp, useRemoteConfigString } from 'reactfire';
import { WideButton } from '../display/Button';
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
  const firebaseApp = useFirebaseApp();
  const [remoteConfigLoaded, setRemoteConfigLoaded] = useState<boolean>(false);
  useEffect(() => {
    preloadRemoteConfig({
      firebaseApp,
      setup: async remoteConfig => {
        remoteConfig().settings = {
          minimumFetchIntervalMillis: 10000,
          fetchTimeoutMillis: 10000
        };
        await remoteConfig().fetchAndActivate();
        setRemoteConfigLoaded(true);
      }
    });
  }, []);

  if (!remoteConfigLoaded) {
    return <LoadingSpinner />;
  }

  return <RcString messageKey="message" />;
};
