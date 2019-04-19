import * as React from 'react';
import '@firebase/performance';
import { useUser } from './index';
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

export function AuthCheck({ auth, fallback, children, requiredClaims }) {
  const user = useUser(auth);

  useLayoutEffect(() => {
    if (requiredClaims) {
      throw user.getIdTokenResult().then(idTokenResult => {
        const { claims } = idTokenResult;
        const missingClaims = {};
        Object.keys(requiredClaims).forEach(claim => {
          if (requiredClaims[claim] !== claims[claim]) {
            missingClaims[claim] = {
              expected: requiredClaims[claim],
              actual: claims[claim]
            };
          }
        });

        if (Object.keys(missingClaims).length > 0) {
          throw new Error(
            `Mismatched Claims: ${JSON.stringify(missingClaims)}`
          );
        }
      });
    }
  });

  if (!user) {
    return fallback;
  } else {
    return children;
  }
}
