import * as React from 'react';
import { preloadPerformance } from '../firebaseApp';

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
  firePerf?: import('firebase/app').performance.Performance;
}

export function SuspenseWithPerf({
  children,
  traceId,
  fallback,
  firePerf
}: SuspensePerfProps): JSX.Element {
  if (!firePerf) {
    preloadPerformance();
  }

  const startMarkName = `${traceId}[${Math.random().toString(36)}]`;
  const endMarkName = `${traceId}[${Math.random().toString(36)}]`;

  const Fallback = () => {
    React.useLayoutEffect(() => {
      performance?.mark(startMarkName);

      return () => {
        performance?.mark(endMarkName);
        performance?.measure(traceId, startMarkName, endMarkName);
      };
    }, [traceId]);

    return <>{fallback}</>;
  };

  return <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;
}
