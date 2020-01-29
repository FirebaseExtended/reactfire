import React from 'react';
import {
  useRemoteConfigValue,
  SuspenseWithPerf,
  RemoteConfigProvider
} from 'reactfire';

const RemoteConfig = props => {
  const parameter = useRemoteConfigValue(props.rcKey);
  const value = parameter.asString();
  return <div>{value}</div>;
};

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf
      traceId={'remote-config-message'}
      fallback={<p>loading remote config</p>}
    >
      <RemoteConfigProvider fetchInterval={10000} activate={true}>
        <RemoteConfig rcKey="message" />
      </RemoteConfigProvider>
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
