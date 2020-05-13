import React from 'react';
import { useRemoteConfigValue, SuspenseWithPerf } from 'reactfire';

const RemoteConfig = props => {
  const parameter = useRemoteConfigValue(props.rcKey);

  const status = useRemoteConfigValue(props.rcKey, { suspense: true });

  if (hasEmitted) {
  } else {
    //spinner
  }
  //   status:
  //   | 'loading' // waiting for first value from observable
  //   | 'error'
  //   | 'success'; // has received at least one value
  // hasEmitted: boolean; // has received at least one value
  // isComplete: boolean; // observable has triggered onComplete event
  // data: T; // latest data from observable
  // error: Error | undefined;
  // firstValuePromise: Promise<void>; // promise

  const value = parameter.asString();
  return <div>{value}</div>;
};

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf traceId={'remote-config-message'} fallback={<p>loading remote config</p>}>
      <RemoteConfig rcKey="message" />
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
