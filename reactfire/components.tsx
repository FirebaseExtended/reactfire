import * as React from 'react';
import { firebase, auth, performance, User } from 'firebase/app';
import { useUser, useFirebaseApp } from './index';
const { Suspense, useState, useLayoutEffect } = React;

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
  firePerf?: firebase.performance.Performance; // TODO(jeff): Add firePerf here when it's available
}

function getPerfFromContext(): performance.Performance {
  const firebaseApp = useFirebaseApp();

  if (!firebaseApp) {
    throw new Error(
      'Firebase not found in context. Either pass it directly to a reactfire hook, or wrap your component in a FirebaseAppProvider'
    );
  }

  const perfFunc = firebaseApp.performance;

  if (!perfFunc || !perfFunc()) {
    throw new Error(
      "No auth object off of Firebase. Did you forget to import 'firebase/performance' in a component?"
    );
  }

  return perfFunc();
}

export function SuspenseWithPerf({
  children,
  traceId,
  fallback,
  firePerf
}: SuspensePerfProps) {
  firePerf = firePerf || getPerfFromContext();
  const trace = React.useMemo(() => firePerf.trace(traceId), [traceId]);

  const Fallback = () => {
    useLayoutEffect(() => {
      trace.start();

      return () => {
        trace.stop();
      };
    }, []);

    return <>{fallback}</>;
  };

  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}

export interface AuthCheckProps {
  auth?: auth.Auth;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims?: Object;
}

export function AuthCheck({
  auth,
  fallback,
  children,
  requiredClaims
}: AuthCheckProps): React.ReactNode {
  const user = useUser<User>(auth);

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
