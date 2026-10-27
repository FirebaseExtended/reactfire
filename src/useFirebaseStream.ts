import * as React from 'react';
import { registerVersion } from 'firebase/app';
import { useSuspenseEnabledFromConfigAndContext, version } from './firebaseApp.js';

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

export function unwrapOrSuspend<T>(promise: InstrumentedPromise<T>): T {
  if (promise.status === 'fulfilled') {
    return promise.value as T;
  }
  if (promise.status === 'rejected') {
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
  peekInFlight: () => InstrumentedPromise<T> | undefined;
  getOrStartInFlight: () => InstrumentedPromise<T>;
  clearInFlight: (promise?: InstrumentedPromise<T>) => void;
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
  registerVersion('react', React.version || 'unknown');
  registerVersion('reactfire', version);

  const {
    ref,
    isEqual = Object.is,
    peekInFlight,
    getOrStartInFlight,
    clearInFlight,
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
      reqRef.current && isEqual(reqRef.current.ref, ref) ? reqRef.current.promise : peekInFlight();
    if (suspenseEnabled && (!syncInit?.hasValue || existingForRef)) {
      reqRef.current = { ref, promise: existingForRef ?? getOrStartInFlight() };
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
      ? unwrapOrSuspend(reqPromise)
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

    setTimeout(() => {
      clearInFlight(currentPromise);
    }, 0);

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

    return () => {
      active = false;
      unsubscribe();
    };
  }, [canonicalRef]);

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
      reqRef.current = { ref, promise: getOrStartInFlight() };
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
