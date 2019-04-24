import * as React from 'react';
import { auth } from 'firebase/app';
import { useUser } from './index';
const { Suspense, useState, useLayoutEffect } = React;

export interface SuspensePerfProps {
  children: React.Component;
  traceId: string;
  fallback: React.Component;
  firePerf: any; // TODO(jeff): Add firePerf here when it's available
}

export function SuspenseWithPerf({
  children,
  traceId,
  fallback,
  firePerf
}: SuspensePerfProps) {
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
        console.log(`started trace ${traceId}`);
        setTraceStarted(true);
      }
    });

    return <>{fallback}</>;
  };

  const Children = () => {
    useLayoutEffect(() => {
      if (trace && traceStarted && !traceCompleted) {
        trace.stop();
        console.log(`stopped trace ${traceId}`);
        setTraceCompleted(true);
      }
    });

    return <>{children}</>;
  };
  return <Suspense fallback={<Fallback />}>{<Children />}</Suspense>;
}

export interface AuthCheckProps {
  auth: auth.Auth;
  fallback: React.Component;
  children: React.Component;
  requiredClaims?: Object;
}

export function AuthCheck({
  auth,
  fallback,
  children,
  requiredClaims
}: AuthCheckProps): React.Component {
  const user = useUser(auth);

  useLayoutEffect(() => {
    // TODO(jeff) see if this actually works
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
