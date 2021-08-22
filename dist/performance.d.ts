import * as React from 'react';
export interface SuspensePerfProps {
    children: React.ReactNode;
    traceId: string;
    fallback: React.ReactNode;
}
export declare function SuspenseWithPerf({ children, traceId, fallback }: SuspensePerfProps): JSX.Element;
