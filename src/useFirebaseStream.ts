import * as React from 'react';
import { registerVersion } from 'firebase/app';
import { useSuspenseEnabledFromConfigAndContext, version } from './firebaseApp.js';

/**
 * Report the React and ReactFire versions to the Firebase SDK so they show up
 * in Firebase usage telemetry. `registerVersion` is idempotent and order-independent inside
 * `@firebase/app`, so it is safe to call before or after `initializeApp`; we still only call it once.
 */
let versionRegistered = false;
export function registerReactFireVersion(): void {
  if (versionRegistered) {
    return;
  }
  versionRegistered = true;
  registerVersion('react', React.version || 'unknown');
  registerVersion('reactfire', version || 'unknown');
}

/**
 * A thenable compatible with React 19's `React.use()` while remaining structurally valid
 * under `@types/react` 16, 17, 18, and 19.
 */
export type ReactFireUsable<T> = Promise<T>;

export type InstrumentedPromise<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: unknown;
};

/**
 * @deprecated Error class used only by the deprecated `useSigninCheck` hook. Will be removed in v5.0.0.
 */
export class ReactFireError extends Error {
  readonly name = 'ReactFireError';

  constructor(readonly code: string, message: string, public customData?: Record<string, unknown>) {
    super(message);

    // Fix For ES5
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ReactFireError.prototype);
  }
}

export interface ReactFireOptions<T = unknown> {
  /**
   * @deprecated `*Data` hooks and `idField` are deprecated and will be removed in v5.0.0. Use snapshot hooks (`useFirestoreDoc`, `useFirestoreCollection`, `useDatabaseObject`, `useDatabaseList`) and read `doc.id` or `child.key` directly.
   */
  idField?: string;
  initialData?: T | any;
  /**
   * @deprecated use `initialData` instead
   */
  startWithValue?: T | any;
  /**
   * @deprecated Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense: true`.
   */
  suspense?: boolean;
  /**
   * Resolve the initial read once and do not keep a real-time listener open (`useFirestoreDoc` / `useFirestoreCollection`).
   */
  once?: boolean;
  /**
   * Emit when snapshot metadata (`hasPendingWrites`, `fromCache`) changes (`useFirestoreDoc` / `useFirestoreCollection`).
   */
  includeMetadataChanges?: boolean;
}

/**
 * @deprecated Internal option helper. Will be removed in v5.0.0.
 */
export function checkOptions(options: ReactFireOptions, field: string) {
  // make sure the field passed in is a valid key of ReactFire Options
  if (field === 'idField' || field === 'initialData' || field === 'suspense') {
    return options ? (options[field] as ReactFireOptions['idField'] | ReactFireOptions['initialData'] | ReactFireOptions['suspense']) : undefined;
  }

  throw new Error(`Field "${field}" is not a valid key in ReactFireOptions`);
}

/**
 * @deprecated Internal option helper. Will be removed in v5.0.0.
 */
export function checkinitialData(options: ReactFireOptions) {
  return checkOptions(options, 'initialData');
}

/**
 * @deprecated Internal option helper. Will be removed in v5.0.0.
 */
export function checkIdField(options: ReactFireOptions) {
  return checkOptions(options, 'idField');
}

export interface ObservableStatus<T> {
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
   *
   * @deprecated Check `status === 'success'` or pass `.experimental_usable` to `React.use()` instead. Will be removed in v5.0.0.
   */
  hasEmitted: boolean; // has received at least one value
  /**
   * If this is `true`, the hook will be emitting no further items.
   *
   * @deprecated Will be removed in v5.0.0.
   */
  isComplete: boolean;
  /**
   * The most recent value.
   *
   * If `initialData` is passed in, the first value of `data` will be the value provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.
   */
  data: T;
  /**
   * Any error that may have occurred in the underlying observable
   */
  error: Error | undefined;
  /**
   * Promise that resolves after first emit from observable
   *
   * @deprecated Pass `.experimental_usable` (or `.usable`) to `React.use()` instead. Will be removed in v5.0.0.
   */
  firstValuePromise: Promise<void>;
  /**
   * A React 19 `Usable<T>` that can be passed directly into `React.use()`
   * (`const data = use(useFirestoreDoc(ref).usable)`).
   *
   * Suspends on initial load when no data is available yet, and synchronously
   * unwraps the latest live value on all subsequent renders without re-suspending.
   */
  readonly usable: ReactFireUsable<T>;
  /**
   * A React 19 `Usable<T>` that can be passed directly into `React.use()`
   * (`const data = use(useFirestoreDoc(ref).experimental_usable)`).
   *
   * Suspends on initial load when no data is available yet, and synchronously
   * unwraps the latest live value on all subsequent renders without re-suspending.
   */
  readonly experimental_usable: ReactFireUsable<T>;
}

export function instrumentPromise<T>(promise: Promise<T>): InstrumentedPromise<T> {
  const instrumented = promise as InstrumentedPromise<T>;
  if (!instrumented.status) {
    instrumented.status = 'pending';
    instrumented.then(
      (value) => {
        instrumented.status = 'fulfilled';
        instrumented.value = value;
      },
      (reason) => {
        instrumented.status = 'rejected';
        instrumented.reason = reason;
      }
    );
  }
  return instrumented;
}

export function createFulfilledUsable<T>(value: T): InstrumentedPromise<T> {
  const p = Promise.resolve(value) as InstrumentedPromise<T>;
  p.status = 'fulfilled';
  p.value = value;
  return p;
}

export function unwrapOrSuspend<T>(promise: InstrumentedPromise<T>, onRejected?: (failed: InstrumentedPromise<T>) => void): T {
  if (promise.status === 'fulfilled') {
    return promise.value as T;
  }
  if (promise.status === 'rejected') {
    onRejected?.(promise);
    throw promise.reason;
  }
  throw promise;
}

export function attachUsable<T>(
  target: Omit<ObservableStatus<T>, 'usable' | 'experimental_usable'>,
  getUsable: () => ReactFireUsable<T>
): ObservableStatus<T> {
  Object.defineProperties(target, {
    usable: {
      get: getUsable,
      enumerable: false,
      configurable: true,
    },
    experimental_usable: {
      get: getUsable,
      enumerable: false,
      configurable: true,
    },
  });
  return target as ObservableStatus<T>;
}

/**
 * The initial read for a single stream key. Shared by every component rendering the same
 * reference so that concurrent renders, `<StrictMode>` double-mounts, and Suspense retries all see the
 * exact same promise instance.
 */
export interface InFlightHandle<T> {
  peek(): InstrumentedPromise<T> | undefined;
  getOrStart(): InstrumentedPromise<T>;
  /** Called once a committed component's live subscription is attached; hands the read off to it. */
  clear(promise?: InstrumentedPromise<T>): void;
}

/**
 * An initial read that may keep a resource warm after it resolves, e.g. the listener that produced the first
 * snapshot. `release` runs once the live subscription has taken over (or the read is abandoned), so the
 * listener stays attached until then and the SDK never drops and re-downloads the data in between.
 */
export interface InFlightRead<T> {
  promise: Promise<T>;
  release?: () => void;
}

export interface InFlightCache<K, T> {
  handle(key: K, start: () => Promise<T> | InFlightRead<T>): InFlightHandle<T>;
  /** Drop every entry so the next render starts fresh reads. */
  clearAll(): void;
}

interface InFlightEntry<K, T> {
  key: K;
  promise: InstrumentedPromise<T>;
  release: () => void;
}

const allInFlightCaches = new Set<InFlightCache<unknown, unknown>>();

/**
 * Forget every in-flight initial read, across all caches. Called by the Auth hooks when the signed-in user changes,
 * so a read that was started for the previous user (and never committed) can't be served to the next render.
 */
export function clearAllInFlight(): void {
  allInFlightCaches.forEach((cache) => cache.clearAll());
}

function isPromise<T>(value: Promise<T> | InFlightRead<T>): value is Promise<T> {
  return typeof (value as Promise<T>).then === 'function';
}

/**
 * Creates a module-level cache of in-flight initial reads keyed by `K`.
 *
 * Entries are handed off (and their `release` called) when a committed component's live subscription has attached,
 * or evicted `evictAfterMs` after settling if no component ever commits (an abandoned render).
 */
export function createInFlightCache<K, T>(isEqual: (a: K, b: K) => boolean = Object.is, evictAfterMs = 300): InFlightCache<K, T> {
  const entries: Array<InFlightEntry<K, T>> = [];
  const find = (key: K) => entries.find((entry) => isEqual(entry.key, key));
  const detach = (entry: InFlightEntry<K, T>) => {
    const idx = entries.indexOf(entry);
    if (idx > -1) {
      entries.splice(idx, 1);
    }
    // Never cut a pending read short: a component may still be suspended on it, and React only retries once it settles.
    if (entry.promise.status === 'pending') {
      entry.promise.then(entry.release, entry.release);
    } else {
      entry.release();
    }
  };

  const cache: InFlightCache<K, T> = {
    handle(key, start) {
      return {
        peek: () => find(key)?.promise,
        getOrStart: () => {
          const existing = find(key);
          if (existing) {
            return existing.promise;
          }
          const started = start();
          const read = isPromise(started) ? { promise: started } : started;
          let released = false;
          const entry: InFlightEntry<K, T> = {
            key,
            promise: instrumentPromise(read.promise),
            release: () => {
              if (!released) {
                released = true;
                read.release?.();
              }
            },
          };
          entries.push(entry);
          const evict = () =>
            setTimeout(() => {
              if (entries.includes(entry)) {
                detach(entry);
              }
            }, evictAfterMs);
          entry.promise.then(evict, evict);
          return entry.promise;
        },
        clear: (promise) => {
          const existing = find(key);
          // A still-pending read may have other components suspended on it (e.g. a non-Suspense sibling committed
          // first); leave it for them and let eviction hand it off once it settles.
          if (existing && (!promise || existing.promise === promise) && existing.promise.status !== 'pending') {
            detach(existing);
          }
        },
      };
    },
    clearAll: () => {
      [...entries].forEach(detach);
    },
  };
  allInFlightCaches.add(cache as InFlightCache<unknown, unknown>);
  return cache;
}

/**
 * Starts a listener whose first emission resolves the returned promise, and keeps it attached until `release` is
 * called. Firestore and Realtime Database drop cached data as soon as the last listener detaches, so detaching the
 * preload listener before the component's live listener attaches would download everything twice.
 */
export function listenUntilReleased<S>(listen: (onNext: (value: S) => void, onError: (error: Error) => void) => () => void): InFlightRead<S> {
  let unsubscribe: (() => void) | undefined;
  let released = false;
  const promise = new Promise<S>((resolve, reject) => {
    unsubscribe = listen(resolve, reject);
  });
  return {
    promise,
    release: () => {
      if (!released) {
        released = true;
        unsubscribe?.();
      }
    },
  };
}

export function hasInitialDataOption(options?: ReactFireOptions<any>): boolean {
  return Boolean(options && ('initialData' in options || 'startWithValue' in options));
}

export function getInitialDataOption<T>(options?: ReactFireOptions<T>): T | undefined {
  return (options?.initialData ?? options?.startWithValue) as T | undefined;
}

const derivedUsableCache = new WeakMap<object, Map<string, InstrumentedPromise<any>>>();
const derivedValueCache = new WeakMap<object, Map<string, { value: any }>>();

function projectCached<S, T>(val: S, project: (val: S) => T, key: string): T {
  if (val !== null && typeof val === 'object') {
    let byKey = derivedValueCache.get(val as unknown as object);
    if (!byKey) {
      byKey = new Map();
      derivedValueCache.set(val as unknown as object, byKey);
    }
    const existing = byKey.get(key);
    if (existing) {
      return existing.value as T;
    }
    const computed = project(val);
    byKey.set(key, { value: computed });
    return computed;
  }
  return project(val);
}

export function useMappedObservableStatus<S, T>(
  source: ObservableStatus<S>,
  project: (val: S) => T,
  key = '',
  options?: ReactFireOptions<any>
): ObservableStatus<T> {
  const hasInitialData = hasInitialDataOption(options);
  const initialData = getInitialDataOption<T>(options);
  const initialUsableRef = React.useRef<{ value: T; promise: InstrumentedPromise<T> } | null>(null);
  const memoRef = React.useRef<{ sourceData: S; key: string; mappedData: T } | null>(null);

  if (source.status === 'success') {
    if (
      !memoRef.current ||
      !Object.is(memoRef.current.sourceData, source.data) ||
      memoRef.current.key !== key
    ) {
      memoRef.current = {
        sourceData: source.data,
        key,
        mappedData: projectCached(source.data, project, key),
      };
    }
    const mappedData = memoRef.current.mappedData;
    return attachUsable(
      {
        ...source,
        data: mappedData,
      },
      () => {
        const sourceUsable = source.usable as unknown as InstrumentedPromise<S>;
        let byKey = derivedUsableCache.get(sourceUsable);
        if (!byKey) {
          byKey = new Map();
          derivedUsableCache.set(sourceUsable, byKey);
        }
        let derived = byKey.get(key) as InstrumentedPromise<T> | undefined;
        if (!derived) {
          derived = createFulfilledUsable(mappedData);
          byKey.set(key, derived);
        } else if (derived.status === 'pending') {
          derived.status = 'fulfilled';
          derived.value = mappedData;
        }
        return derived;
      }
    );
  }

  if (hasInitialData) {
    return attachUsable(
      {
        ...source,
        status: 'success',
        hasEmitted: true,
        firstValuePromise: Promise.resolve(),
        data: initialData as T,
      },
      () => {
        const val = initialData as T;
        if (!initialUsableRef.current || !Object.is(initialUsableRef.current.value, val)) {
          initialUsableRef.current = {
            value: val,
            promise: createFulfilledUsable(val),
          };
        }
        return initialUsableRef.current.promise;
      }
    );
  }

  return attachUsable(
    {
      ...source,
      data: undefined as unknown as T,
    },
    () => {
      const sourceUsable = source.usable as unknown as InstrumentedPromise<S>;
      let byKey = derivedUsableCache.get(sourceUsable);
      if (!byKey) {
        byKey = new Map();
        derivedUsableCache.set(sourceUsable, byKey);
      }
      let derived = byKey.get(key) as InstrumentedPromise<T> | undefined;
      if (!derived) {
        if (sourceUsable.status === 'fulfilled') {
          derived = createFulfilledUsable(projectCached(sourceUsable.value as S, project, key));
        } else {
          derived = instrumentPromise(
            sourceUsable.then((val) => projectCached(val, project, key))
          );
        }
        byKey.set(key, derived);
      }
      return derived;
    }
  );
}

export interface FirebaseStreamConfig<Ref, T> {
  ref: Ref;
  isEqual?: (a: Ref, b: Ref) => boolean;
  /** Options that change what `subscribe` does (e.g. `once`, `includeMetadataChanges`); changing one re-subscribes. */
  deps?: React.DependencyList;
  inFlight: InFlightHandle<T>;
  subscribe: (
    onNext: (value: T, isComplete?: boolean) => void,
    onError: (error: unknown) => void,
    inFlightPromise: InstrumentedPromise<T> | undefined
  ) => () => void;
  options?: ReactFireOptions<any>;
  getSyncInitialValue?: () => { hasValue: boolean; value: T; isComplete?: boolean };
  defaultIsComplete?: boolean;
}

export function useFirebaseStream<Ref, T>(config: FirebaseStreamConfig<Ref, T>): ObservableStatus<T> {
  registerReactFireVersion();

  const {
    ref,
    isEqual = Object.is,
    deps = [],
    inFlight,
    subscribe,
    options,
    getSyncInitialValue,
    defaultIsComplete = false,
  } = config;

  const stableRef = React.useRef<Ref>(ref);
  if (!isEqual(stableRef.current, ref)) {
    stableRef.current = ref;
  }
  const canonicalRef = stableRef.current;

  const suspenseEnabled = useSuspenseEnabledFromConfigAndContext(options?.suspense);
  const hasInitialData = hasInitialDataOption(options);
  const initialData = getInitialDataOption<T>(options);
  const syncInit = getSyncInitialValue ? getSyncInitialValue() : undefined;

  const reqRef = React.useRef<{ ref: Ref; promise: InstrumentedPromise<T> } | null>(null);
  if (!hasInitialData) {
    const existingForRef =
      reqRef.current && isEqual(reqRef.current.ref, ref) ? reqRef.current.promise : inFlight.peek();
    if (suspenseEnabled && (!syncInit?.hasValue || existingForRef)) {
      reqRef.current = { ref, promise: existingForRef ?? inFlight.getOrStart() };
    } else if (!syncInit?.hasValue && existingForRef) {
      reqRef.current = { ref, promise: existingForRef };
    } else {
      reqRef.current = null;
    }
  } else {
    reqRef.current = null;
  }

  const reqPromise = reqRef.current && isEqual(reqRef.current.ref, ref) ? reqRef.current.promise : undefined;

  const preloadedValue =
    suspenseEnabled && !hasInitialData && reqPromise
      ? unwrapOrSuspend(reqPromise, (failed) => {
          setTimeout(() => inFlight.clear(failed), 0);
        })
      : reqPromise?.status === 'fulfilled'
        ? (reqPromise.value as T)
        : undefined;
  const preloadedReady =
    (suspenseEnabled && !hasInitialData && Boolean(reqPromise)) ||
    reqPromise?.status === 'fulfilled';

  const [state, setState] = React.useState<{
    ref: Ref;
    hasValue: boolean;
    value: T | undefined;
    isComplete: boolean;
  }>(() => {
    if (syncInit?.hasValue) {
      return {
        ref,
        hasValue: true,
        value: syncInit.value,
        isComplete: syncInit.isComplete ?? defaultIsComplete,
      };
    }
    if (preloadedReady) {
      return {
        ref,
        hasValue: true,
        value: preloadedValue,
        isComplete: defaultIsComplete,
      };
    }
    return {
      ref,
      hasValue: false,
      value: undefined,
      isComplete: false,
    };
  });

  const firstValueDeferredRef = React.useRef<{
    ref: Ref;
    promise: Promise<void>;
    resolve: () => void;
  } | null>(null);
  if (!firstValueDeferredRef.current || !isEqual(firstValueDeferredRef.current.ref, ref)) {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => {
      resolve = r;
    });
    if (syncInit?.hasValue || preloadedReady || hasInitialData) {
      resolve();
    }
    firstValueDeferredRef.current = { ref, promise, resolve };
  }

  React.useEffect(() => {
    let active = true;
    const resolveFirst = firstValueDeferredRef.current?.resolve;
    const currentPromise = reqRef.current && isEqual(reqRef.current.ref, ref) ? reqRef.current.promise : undefined;

    if (currentPromise && currentPromise.status === 'fulfilled') {
      resolveFirst?.();
      setState((prev) =>
        isEqual(prev.ref, ref) && prev.hasValue
          ? prev
          : { ref, hasValue: true, value: currentPromise.value as T, isComplete: defaultIsComplete }
      );
    }

    const unsubscribe = subscribe(
      (nextValue, isComplete = defaultIsComplete) => {
        if (active) {
          resolveFirst?.();
          setState((prev) =>
            isEqual(prev.ref, ref) &&
            prev.hasValue &&
            Object.is(prev.value, nextValue) &&
            prev.isComplete === isComplete
              ? prev
              : {
                  ref,
                  hasValue: true,
                  value: nextValue,
                  isComplete,
                }
          );
        }
      },
      (error: unknown) => {
        if (active) {
          resolveFirst?.();
          setState(() => {
            throw error;
          });
        }
      },
      currentPromise
    );

    if (currentPromise) {
      setTimeout(() => {
        inFlight.clear(currentPromise);
      }, 0);
    }

    return () => {
      active = false;
      unsubscribe();
    };
    // `canonicalRef` only changes when `isEqual` says the reference changed; `deps` are the options `subscribe` reads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalRef, ...deps]);

  const isCurrent = isEqual(state.ref, ref);
  const hasStreamValue = (isCurrent && state.hasValue) || Boolean(syncInit?.hasValue) || preloadedReady;
  const streamValue = (
    isCurrent && state.hasValue
      ? state.value
      : syncInit?.hasValue
        ? syncInit.value
        : preloadedValue
  ) as T;
  const hasResolved = hasStreamValue || hasInitialData;
  const currentValue = (hasStreamValue ? streamValue : initialData) as T;
  const currentIsComplete =
    isCurrent && state.hasValue
      ? state.isComplete
      : syncInit?.hasValue
        ? (syncInit.isComplete ?? defaultIsComplete)
        : hasStreamValue
          ? defaultIsComplete
          : false;

  const usableRef = React.useRef<{ ref: Ref; promise: InstrumentedPromise<T> } | null>(null);
  if (preloadedReady && reqPromise && (!usableRef.current || !isEqual(usableRef.current.ref, ref))) {
    usableRef.current = { ref, promise: reqPromise };
  }

  const getUsable = (): ReactFireUsable<T> => {
    if (reqPromise?.status === 'rejected') {
      const failed = reqPromise;
      setTimeout(() => inFlight.clear(failed), 0);
      return failed;
    }

    if (hasResolved) {
      if (
        !usableRef.current ||
        !isEqual(usableRef.current.ref, ref) ||
        usableRef.current.promise.status !== 'fulfilled' ||
        !Object.is(usableRef.current.promise.value, currentValue)
      ) {
        usableRef.current = {
          ref,
          promise: createFulfilledUsable(currentValue),
        };
      }
      return usableRef.current.promise;
    }

    if (!reqRef.current || !isEqual(reqRef.current.ref, ref)) {
      reqRef.current = { ref, promise: inFlight.getOrStart() };
    }
    usableRef.current = reqRef.current;
    return reqRef.current.promise;
  };

  if (hasStreamValue) {
    return attachUsable(
      {
        status: 'success',
        hasEmitted: true,
        isComplete: currentIsComplete,
        data: streamValue,
        error: undefined,
        firstValuePromise: Promise.resolve(),
      },
      getUsable
    );
  }

  return attachUsable(
    {
      status: hasInitialData ? 'success' : 'loading',
      hasEmitted: hasInitialData,
      isComplete: false,
      data: initialData as T,
      error: undefined,
      firstValuePromise: firstValueDeferredRef.current.promise,
    },
    getUsable
  );
}
