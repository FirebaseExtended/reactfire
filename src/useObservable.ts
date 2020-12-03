import * as React from 'react';
import { Observable } from 'rxjs';
import { SuspenseSubject } from './SuspenseSubject';
import { useSuspenseEnabledFromConfigAndContext } from './firebaseApp';
import { ReactFireGlobals, ReactFireOptions } from './';

const DEFAULT_TIMEOUT = 30_000;

// Since we're side-effect free, we need to ensure our observable cache is global
const preloadedObservables: Map<string, SuspenseSubject<any>> = ((globalThis as any) as ReactFireGlobals)._reactFirePreloadedObservables || new Map();

if (!((globalThis as any) as ReactFireGlobals)._reactFirePreloadedObservables) {
  ((globalThis as any) as ReactFireGlobals)._reactFirePreloadedObservables = preloadedObservables;
}

// Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable
export function preloadObservable<T>(source: Observable<T>, id: string) {
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id) as SuspenseSubject<T>;
  } else {
    const observable = new SuspenseSubject(source, DEFAULT_TIMEOUT);
    preloadedObservables.set(id, observable);
    return observable;
  }
}

export interface ObservableStatus<T> {
  status:
    | 'loading' // waiting for first value from observable
    | 'error'
    | 'success'; // has received at least one value
  hasEmitted: boolean; // has received at least one value
  isComplete: boolean; // observable has triggered onComplete event
  data: T; // latest data from observable
  error: Error | undefined;
  firstValuePromise: Promise<void>; // promise that resolves after first emit from observable
}

export function useObservable<T>(observableId: string, source: Observable<T | any>, config: ReactFireOptions = {}): ObservableStatus<T> {
  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }
  const observable = preloadObservable(source, observableId);

  const hasInitialData = Object.keys(config).includes('initialData');

  const suspenseEnabled = useSuspenseEnabledFromConfigAndContext(config.suspense);

  if (!observable.hasValue && !config?.initialData) {
    if (suspenseEnabled === true) {
      throw observable.firstEmission;
    }
  }

  const [latest, setValue] = React.useState(() => (observable.hasValue ? observable.value : config.initialData));
  React.useEffect(() => {
    const subscription = observable.subscribe(
      v => {
        setValue(() => v);
      },
      e => {
        throw e;
      }
    );
    return () => subscription.unsubscribe();
  }, [observable]);

  let status: ObservableStatus<T>['status'];

  if (observable.hasError) {
    status = 'error';
  } else if (observable.hasValue || hasInitialData) {
    status = 'success';
  } else {
    status = 'loading';
  }

  return {
    status,
    hasEmitted: observable.hasValue,
    isComplete: observable.isStopped,
    data: latest,
    error: observable.ourError,
    firstValuePromise: observable.firstEmission
  };
}
