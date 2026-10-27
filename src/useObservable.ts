import * as React from 'react';
import { registerVersion } from 'firebase/app';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { Observable } from 'rxjs';
import { SuspenseSubject } from './SuspenseSubject.js';
import { useSuspenseEnabledFromConfigAndContext, version } from './firebaseApp.js';
import { attachUsable, createFulfilledUsable } from './useFirebaseStream.js';
import type { ObservableStatus, ReactFireOptions, ReactFireUsable } from './useFirebaseStream.js';
import type { ReactFireGlobals } from './index.js';

export type { ObservableStatus, ReactFireUsable };

const DEFAULT_TIMEOUT = 30_000;

function getPreloadedObservables(): Map<string, SuspenseSubject<any>> {
  const globals = globalThis as unknown as ReactFireGlobals;
  if (!globals._reactFirePreloadedObservables) {
    globals._reactFirePreloadedObservables = new Map();
  }
  return globals._reactFirePreloadedObservables;
}

/**
 * Starts listening to an Observable.
 * Call this once you know you're going to render a
 * child that will consume the observable.
 *
 * @deprecated RxJS integration (`preloadObservable`, `useObservable`, `SuspenseSubject`) is deprecated and will be removed in v5.0.0.
 */
export function preloadObservable<T>(source: Observable<T>, id: string, suspenseEnabled = false) {
  const preloadedObservables = getPreloadedObservables();
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id) as SuspenseSubject<T>;
  } else {
    const observable = new SuspenseSubject(source, DEFAULT_TIMEOUT, suspenseEnabled);
    preloadedObservables.set(id, observable);
    return observable;
  }
}

/**
 * Subscribe to an RxJS `Observable`.
 *
 * @deprecated RxJS integration (`useObservable`, `preloadObservable`, `SuspenseSubject`) is deprecated and will be removed in v5.0.0.
 */
export function useObservable<T = unknown>(observableId: string, source: Observable<T>, config: ReactFireOptions = {}): ObservableStatus<T> {
  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }

  registerVersion('react', React.version || 'unknown');
  registerVersion('reactfire', version);

  const suspenseEnabled = useSuspenseEnabledFromConfigAndContext(config.suspense);

  // Register the observable with the cache
  const observable = preloadObservable(source, observableId, suspenseEnabled);

  // Suspend if suspense is enabled and no initial data exists
  const hasInitialData = config.hasOwnProperty('initialData') || config.hasOwnProperty('startWithValue');
  const hasData = observable.hasValue || hasInitialData;
  if (suspenseEnabled === true && !hasData) {
    throw observable.firstEmission;
  }

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
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
      };
    },
    [observable]
  );

  const getSnapshot = React.useCallback<() => ObservableStatus<T>>(() => {
    return observable.immutableStatus;
  }, [observable]);

  // Reads only `config`, never `observable.immutableStatus`: `preloadedObservables` is a
  // `globalThis` cache keyed only by `observableId`, so a server shares it across concurrent
  // requests, and seeding from it would render one request's data into another's HTML.
  // React 18 and up only: below that the shim's server path ignores this function and returns
  // `getSnapshot()`, so the cached value still reaches the markup there.
  // Held in a ref because React requires a stable value across renders.
  const serverSnapshotRef = React.useRef<ObservableStatus<T> | undefined>(undefined);
  const getServerSnapshot = React.useCallback<() => ObservableStatus<T>>(() => {
    if (serverSnapshotRef.current === undefined) {
      const initialDataValue = config?.initialData ?? config?.startWithValue;

      serverSnapshotRef.current = attachUsable(
        {
          status: hasInitialData ? 'success' : 'loading',
          hasEmitted: hasInitialData,
          isComplete: false,
          data: initialDataValue,
          error: undefined,
          firstValuePromise: observable.firstEmission,
        },
        () => createFulfilledUsable(initialDataValue)
      );
    }

    return serverSnapshotRef.current;
    // Callers pass a fresh `config` literal each render, so the fields read above are kept
    // out of the deps; the ref computes the value once per instance anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable, hasInitialData]);

  const update = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Return a new object with initialData overlaid rather than mutating the shared
  // _immutableStatus reference, which is the same object across all components
  // using the same observableId.
  if (!observable.hasValue && hasData) {
    const initialDataValue = config?.initialData ?? config?.startWithValue;

    // In suspense mode, throw errors so React Error Boundaries can catch them.
    // In non-suspense mode, surface errors via status so consumers can handle them locally.
    if (suspenseEnabled && update.error) {
      throw update.error;
    }

    return attachUsable(
      {
        ...update,
        data: initialDataValue,
        status: 'success',
        hasEmitted: true,
      },
      () => createFulfilledUsable(initialDataValue)
    );
  }

  // throw an error if there is an error
  // TODO(jhuleatt) this is the current, tested-for, behavior. But do we actually want it?
  if (update.error) {
    throw update.error;
  }

  return update;
}
