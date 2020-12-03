import * as React from 'react';
import { useEffect, useState } from 'react';
import { preloadRemoteConfig, SuspenseWithPerf, useFirebaseApp, useRemoteConfigString } from 'reactfire';
import { WideButton } from '../display/Button';
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

export const RemoteConfig = () => {
  return (
    <SuspenseWithPerf traceId={'remote-config-message'} fallback={<LoadingSpinner />}>
      <RcString messageKey="message" />
    </SuspenseWithPerf>
  );
};
