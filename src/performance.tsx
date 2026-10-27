import * as React from 'react';
import { trace } from 'firebase/performance';
import type { FirebasePerformance } from 'firebase/performance';
import { PerformanceSdkContext } from './sdk.js';

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
  /**
   * Optional Firebase Performance Monitoring instance to record the trace with.
   */
  perf?: FirebasePerformance;
}

function TraceWhileMounted({
  perf,
  traceId,
  children,
}: {
  perf?: FirebasePerformance;
  traceId: string;
  children: React.ReactNode;
}): React.ReactElement {
  React.useEffect(() => {
    const perfTrace = perf ? trace(perf, traceId) : undefined;
    perfTrace?.start();

    const browserPerf = typeof globalThis !== 'undefined' ? globalThis.performance : undefined;
    const entries = browserPerf?.getEntriesByName?.(traceId, 'measure') || [];
    const startMarkName = `_${traceId}Start[${entries.length}]`;
    const endMarkName = `_${traceId}End[${entries.length}]`;
    browserPerf?.mark?.(startMarkName);

    return () => {
      perfTrace?.stop();
      browserPerf?.mark?.(endMarkName);
      browserPerf?.measure?.(traceId, startMarkName, endMarkName);
    };
  }, [perf, traceId]);

  return <>{children}</>;
}

export function SuspenseWithPerf({ children, traceId, fallback, perf }: SuspensePerfProps): React.ReactElement {
  const contextPerf = React.useContext(PerformanceSdkContext);
  const resolvedPerf = perf ?? contextPerf;

  return (
    <React.Suspense
      fallback={
        <TraceWhileMounted perf={resolvedPerf} traceId={traceId}>
          {fallback}
        </TraceWhileMounted>
      }
    >
      {children}
    </React.Suspense>
  );
}
