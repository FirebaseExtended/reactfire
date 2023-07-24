import * as React from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { Observable } from 'rxjs';
import { SuspenseSubject } from './SuspenseSubject';
import { useSuspenseEnabledFromConfigAndContext } from './firebaseApp';
import { ReactFireGlobals, ReactFireOptions } from './';

const DEFAULT_TIMEOUT = 30_000;

// Since we're side-effect free, we need to ensure our observable cache is global
const preloadedObservables: Map<string, SuspenseSubject<any>> = (globalThis as any as ReactFireGlobals)._reactFirePreloadedObservables || new Map();

if (!(globalThis as any as ReactFireGlobals)._reactFirePreloadedObservables) {
  (globalThis as any as ReactFireGlobals)._reactFirePreloadedObservables = preloadedObservables;
}

// Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable
export function preloadObservable<T>(source: Observable<T>, id: string, suspenseEnabled = false) {
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id) as SuspenseSubject<T>;
  } else {
    const observable = new SuspenseSubject(source, DEFAULT_TIMEOUT, suspenseEnabled);
    preloadedObservables.set(id, observable);
    return observable;
  }
}

interface ObservableStatusBase<T> {
  /**
   * The loading status.
   *
   * - `loading`: Waiting for the first value from an observable
   * - `error`: Something went wrong. Check `ObservableStatus.error` for more details
   * - `success`: The hook has emitted at least one value
   *
   * If `initialData` is passed in, this will skip `loading` and go straight to `success`.
   */
  status: 'loading' | 'error' | 'success';
  /**
   * Indicates whether the hook has emitted a value at some point
   *
   * If `initialData` is passed in, this will be `true`.
   */
  hasEmitted: boolean; // has received at least one value
  /**
   * If this is `true`, the hook will be emitting no further items.
   */
  isComplete: boolean;
  /**
   * The most recent value.
   *
   * If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.
   */
  data: T | undefined;
  /**
   * Any error that may have occurred in the underlying observable
   */
  error: Error | undefined;
  /**
   * Promise that resolves after first emit from observable
   */
  firstValuePromise: Promise<void>;
}

export interface ObservableStatusSuccess<T> extends ObservableStatusBase<T> {
  status: 'success';
  data: T;
}

export interface ObservableStatusError<T> extends ObservableStatusBase<T> {
  status: 'error';
  isComplete: true;
  error: Error;
}

export interface ObservableStatusLoading<T> extends ObservableStatusBase<T> {
  status: 'loading';
  data: undefined;
  hasEmitted: false;
}

export type ObservableStatus<T> = ObservableStatusLoading<T> | ObservableStatusError<T> | ObservableStatusSuccess<T>;

export function useObservable<T = unknown>(observableId: string, source: Observable<T>, config: ReactFireOptions = {}): ObservableStatus<T> {
  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }

  const suspenseEnabled = useSuspenseEnabledFromConfigAndContext(config.suspense);

  // Register the observable with the cache
  const observable = preloadObservable(source, observableId, suspenseEnabled);

  // Suspend if suspense is enabled and no initial data exists
  const hasInitialData = config.hasOwnProperty('initialData') || config.hasOwnProperty('startWithValue');
  const hasData = observable.hasValue || hasInitialData;
  if (suspenseEnabled === true && !hasData) {
    throw observable.firstEmission;
  }

  const subscribe = React.useCallback((onStoreChange: () => void) => {
      const subscription = observable.subscribe({
        next: () => {
          onStoreChange();
        },
        error: (e) => {
          onStoreChange();
          throw e;
        },
        complete: () => {
          onStoreChange();
        },
      });

      return () => {
        subscription.unsubscribe();
      }
  }, [observable])

  const getSnapshot = React.useCallback<() => ObservableStatus<T>>(() => {
    return observable.immutableStatus;
  }, [observable]);

  const update = useSyncExternalStore(subscribe, getSnapshot);

  // modify the value if initialData exists
  if (!observable.hasValue && hasData) {
    update.data = config?.initialData ?? config?.startWithValue;
    update.status = 'success';
    update.hasEmitted = true;
  }

  // throw an error if there is an error
  // TODO(jhuleatt) this is the current, tested-for, behavior. But do we actually want it?
  if (update.error) {
    throw update.error;
  }

  return update;
}
