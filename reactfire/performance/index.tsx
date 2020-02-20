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
    preloadPerformance().then(perf => perf());
  }

  const mark = performance?.mark || (() => {});
  const measure = performance?.measure || (() => {});
  const getEntriesByName = performance?.getEntriesByName || (() => []);

  const entries = getEntriesByName(traceId, 'measure');
  const startMarkName = `_${traceId}Start[${entries.length}]`;
  const endMarkName = `_${traceId}End[${entries.length}]`;

  const Fallback = () => {
    React.useLayoutEffect(() => {
      mark(startMarkName);

      return () => {
        mark(endMarkName);
        measure(traceId, startMarkName, endMarkName);
      };
    }, [traceId]);

    return <>{fallback}</>;
  };

  return <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;
}
