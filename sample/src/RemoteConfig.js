import React from 'react';
import {
  useRemoteConfigValue,
  SuspenseWithPerf,
  useRemoteConfig
} from 'reactfire';

const RemoteConfig = props => {
  const remoteConfig = useRemoteConfig()();
  remoteConfig.settings = {
    minimumFetchIntervalMillis: props.fetchInterval || 3600 * 1000 // one hr
  };
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
      <RemoteConfig rcKey="message" fetchInterval={3600 * 10} />
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
