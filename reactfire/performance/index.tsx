import { performance } from 'firebase/app';
import * as React from 'react';
import { useFirebaseApp } from '..';

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
  firePerf?: performance.Performance;
}

function getPerfFromContext(): performance.Performance {
  const firebaseApp = useFirebaseApp();
  console.log('looooool');
  if (!firebaseApp) {
    throw new Error(
      'Firebase not found in context. Either pass it directly to a reactfire hook, or wrap your component in a FirebaseAppProvider'
    );
  }

  const perfFunc = firebaseApp.performance;

  if (!perfFunc || !perfFunc()) {
    throw new Error(
      "No perf object off of Firebase. Did you forget to import 'firebase/performance' in a component?"
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
    React.useLayoutEffect(() => {
      trace.start();

      return () => {
        trace.stop();
      };
    }, []);

    return <>{fallback}</>;
  };

  return <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;
}
