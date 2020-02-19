import { performance } from 'firebase/app';
import * as React from 'react';
import { usePerformance } from '../firebaseApp';

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
  firePerf?: performance.Performance;
}

export function SuspenseWithPerf({
  children,
  traceId,
  fallback,
  firePerf
}: SuspensePerfProps): JSX.Element {
  firePerf = firePerf || usePerformance();

  const Fallback = () => {
    React.useLayoutEffect(() => {
      const trace = firePerf.trace(traceId);
      trace.start();

      return () => {
        trace.stop();
      };
    }, [traceId]);

    return <>{fallback}</>;
  };

  return <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;
}
