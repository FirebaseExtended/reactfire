import * as React from 'react';
import { preloadPerformance } from './';
import { useFirebaseApp } from './firebaseApp';

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
  firePerf?: import('firebase/app').default.performance.Performance;
}

export function SuspenseWithPerf({ children, traceId, fallback, firePerf }: SuspensePerfProps): JSX.Element {
  if (!firePerf) {
    const firebaseApp = useFirebaseApp();
    preloadPerformance({ firebaseApp }).then(perf => perf());
  }

  const entries = performance?.getEntriesByName(traceId, 'measure') || [];
  const startMarkName = `_${traceId}Start[${entries.length}]`;
  const endMarkName = `_${traceId}End[${entries.length}]`;

  const Fallback = () => {
    React.useLayoutEffect(() => {
      performance?.mark(startMarkName);

      return () => {
        performance?.mark(endMarkName);
        performance?.measure(traceId, startMarkName, endMarkName);
      };
    }, []);

    return <>{fallback}</>;
  };

  return <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;
}
