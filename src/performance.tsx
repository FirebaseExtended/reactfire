import * as React from 'react';

export interface SuspensePerfProps {
  children: React.ReactNode;
  traceId: string;
  fallback: React.ReactNode;
}

export function SuspenseWithPerf({ children, traceId, fallback }: SuspensePerfProps): React.ReactElement {
  // TODO: Should this import firebase/performance?

  const perf = typeof globalThis !== 'undefined' ? globalThis.performance : undefined;
  const entries = perf?.getEntriesByName?.(traceId, 'measure') || [];
  const startMarkName = `_${traceId}Start[${entries.length}]`;
  const endMarkName = `_${traceId}End[${entries.length}]`;

  const Fallback = () => {
    React.useEffect(() => {
      perf?.mark?.(startMarkName);

      return () => {
        perf?.mark?.(endMarkName);
        perf?.measure?.(traceId, startMarkName, endMarkName);
      };
    }, []);

    return <>{fallback}</>;
  };

  // TODO: `Fallback` is a new component type on every render, so React remounts it (re-running its
  // effect and recording an extra measure) if SuspenseWithPerf re-renders while suspended.
  // oxlint-disable-next-line react/static-components
  return <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;
}
