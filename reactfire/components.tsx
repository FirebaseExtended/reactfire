import * as React from 'react';
import '@firebase/performance';

const { Suspense, useState, useLayoutEffect } = React;

export function SuspenseWithPerf({
  children,
  traceId,
  fallback,
  firePerf
}): React.Component {
  const [trace, setTrace] = useState(null);
  const [traceStarted, setTraceStarted] = useState(false);
  const [traceCompleted, setTraceCompleted] = useState(false);

  const Fallback = () => {
    useLayoutEffect(() => {
      if (!trace) {
        setTrace(firePerf.trace(traceId));
      }

      if (trace && !traceStarted) {
        trace.start();
        setTraceStarted(true);
      }
    });

    return <>{fallback}</>;
  };

  const Children = () => {
    useLayoutEffect(() => {
      if (trace && traceStarted && !traceCompleted) {
        trace.stop();
        setTraceCompleted(true);
      }
    });

    return <>{children}</>;
  };
  return <Suspense fallback={<Fallback />}>{<Children />}</Suspense>;
}
