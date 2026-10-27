import * as React from 'react';

import type { AppCheck } from 'firebase/app-check';
import type { Auth } from 'firebase/auth';
import type { Analytics } from 'firebase/analytics';
import type { Database } from 'firebase/database';
import type { Firestore } from 'firebase/firestore';
import type { Functions } from 'firebase/functions';
import type { FirebasePerformance } from 'firebase/performance';
import type { FirebaseStorage } from 'firebase/storage';
import type { RemoteConfig } from 'firebase/remote-config';
import { useFirebaseApp } from './firebaseApp.js';
import { FirebaseApp } from 'firebase/app';
import { InstrumentedPromise, ObservableStatus, ReactFireOptions, instrumentPromise, useFirebaseStream } from './useFirebaseStream.js';

/** @deprecated Pass Firebase SDK instances or references directly instead of using Context Providers. Will be removed in v5.0.0. */
export const AppCheckSdkContext = React.createContext<AppCheck | undefined>(undefined);
/** @deprecated Pass `auth` directly to `useUser(auth)`, `useIdTokenResult(auth)`, or `<AuthCheck auth={auth}>`. Will be removed in v5.0.0. */
export const AuthSdkContext = React.createContext<Auth | undefined>(undefined);
/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const AnalyticsSdkContext = React.createContext<Analytics | undefined>(undefined);
/** @deprecated Pass Realtime Database references directly to `useDatabaseObject` / `useDatabaseList`. Will be removed in v5.0.0. */
export const DatabaseSdkContext = React.createContext<Database | undefined>(undefined);
/** @deprecated Pass Firestore references directly to `useFirestoreDoc` / `useFirestoreCollection`. Will be removed in v5.0.0. */
export const FirestoreSdkContext = React.createContext<Firestore | undefined>(undefined);
/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const FunctionsSdkContext = React.createContext<Functions | undefined>(undefined);
/** @deprecated Pass Storage references directly to `useStorageDownloadURL`. Will be removed in v5.0.0. */
export const StorageSdkContext = React.createContext<FirebaseStorage | undefined>(undefined);
/** @deprecated Pass `perf` directly to `<SuspenseWithPerf perf={perf}>`. Will be removed in v5.0.0. */
export const PerformanceSdkContext = React.createContext<FirebasePerformance | undefined>(undefined);
/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const RemoteConfigSdkContext = React.createContext<RemoteConfig | undefined>(undefined);

type FirebaseSdks = Analytics | AppCheck | Auth | Database | Firestore | FirebasePerformance | FirebaseStorage | Functions | RemoteConfig;

function getSdkProvider<Sdk extends FirebaseSdks>(SdkContext: React.Context<Sdk | undefined>) {
  return function SdkProvider(props: React.PropsWithChildren<{ sdk: Sdk }>): React.ReactElement {
    if (!props.sdk) throw new Error('no sdk provided');

    const contextualAppName = useFirebaseApp().name;
    const sdkAppName = props?.sdk?.app?.name;
    if (sdkAppName !== contextualAppName) throw new Error('sdk was initialized with a different firebase app');

    return <SdkContext.Provider value={props.sdk} {...props} />;
  };
}

function useSdk<Sdk extends FirebaseSdks>(SdkContext: React.Context<Sdk | undefined>): Sdk {
  const sdk = React.useContext(SdkContext);

  if (!sdk) {
    throw new Error('SDK not found. useSdk must be called from within a provider');
  }

  return sdk;
}

const inFlightInitSdk = new Map<string, InstrumentedPromise<any>>();

function useInitSdk<Sdk extends FirebaseSdks>(
  sdkName: string,
  SdkContext: React.Context<Sdk | undefined>,
  sdkInitializer: (firebaseApp: FirebaseApp) => Promise<Sdk>,
  options?: ReactFireOptions
) {
  const firebaseApp = useFirebaseApp();

  // Some initialization functions (like Firestore's `enableIndexedDbPersistence`)
  // can only be called before anything else. So if an sdk is already available in context,
  // it isn't safe to call initialization functions again.
  if (React.useContext(SdkContext)) {
    throw new Error(`Cannot initialize SDK ${sdkName} because it already exists in Context`);
  }

  const key = `firebase-sdk:${sdkName}:${firebaseApp.name}`;
  const getOrStart = () => {
    let p = inFlightInitSdk.get(key) as InstrumentedPromise<Sdk> | undefined;
    if (!p) {
      p = instrumentPromise(sdkInitializer(firebaseApp));
      inFlightInitSdk.set(key, p);
    }
    return p;
  };

  return useFirebaseStream<string, Sdk>({
    ref: key,
    peekInFlight: () => inFlightInitSdk.get(key) as InstrumentedPromise<Sdk> | undefined,
    getOrStartInFlight: getOrStart,
    clearInFlight: (expected) => {
      if (!expected || inFlightInitSdk.get(key) === expected) {
        inFlightInitSdk.delete(key);
      }
    },
    subscribe: (onNext, onError, inFlightPromise) => {
      const p = inFlightPromise ?? getOrStart();
      p.then(
        (sdk) => onNext(sdk, true),
        (err) => onError(err)
      );
      return () => {};
    },
    options,
    defaultIsComplete: true,
  });
}

/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const AppCheckProvider = getSdkProvider<AppCheck>(AppCheckSdkContext);
/** @deprecated Pass `auth` directly to `useUser(auth)`, `useIdTokenResult(auth)`, or `<AuthCheck auth={auth}>`. Will be removed in v5.0.0. */
export const AuthProvider = getSdkProvider<Auth>(AuthSdkContext);
/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const AnalyticsProvider = getSdkProvider<Analytics>(AnalyticsSdkContext);
/** @deprecated Pass Realtime Database references directly to `useDatabaseObject` / `useDatabaseList`. Will be removed in v5.0.0. */
export const DatabaseProvider = getSdkProvider<Database>(DatabaseSdkContext);
/** @deprecated Pass Firestore references directly to `useFirestoreDoc` / `useFirestoreCollection`. Will be removed in v5.0.0. */
export const FirestoreProvider = getSdkProvider<Firestore>(FirestoreSdkContext);
/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const FunctionsProvider = getSdkProvider<Functions>(FunctionsSdkContext);
/** @deprecated Pass `perf` directly to `<SuspenseWithPerf perf={perf}>`. Will be removed in v5.0.0. */
export const PerformanceProvider = getSdkProvider<FirebasePerformance>(PerformanceSdkContext);
/** @deprecated Pass Storage references directly to `useStorageDownloadURL`. Will be removed in v5.0.0. */
export const StorageProvider = getSdkProvider<FirebaseStorage>(StorageSdkContext);
/** @deprecated Pass Firebase SDK instances directly instead of using Context Providers. Will be removed in v5.0.0. */
export const RemoteConfigProvider = getSdkProvider<RemoteConfig>(RemoteConfigSdkContext);

/** @deprecated Initialize AppCheck at module scope instead of reading from Context. Will be removed in v5.0.0. */
export const useAppCheck = () => useSdk<AppCheck>(AppCheckSdkContext);
/** @deprecated Initialize Auth at module scope (`getAuth(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const useAuth = () => useSdk<Auth>(AuthSdkContext);
/** @deprecated Initialize Analytics at module scope instead of reading from Context. Will be removed in v5.0.0. */
export const useAnalytics = () => useSdk<Analytics>(AnalyticsSdkContext);
/** @deprecated Initialize Database at module scope (`getDatabase(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const useDatabase = () => useSdk<Database>(DatabaseSdkContext);
/** @deprecated Initialize Firestore at module scope (`getFirestore(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const useFirestore = () => useSdk<Firestore>(FirestoreSdkContext);
/** @deprecated Initialize Functions at module scope (`getFunctions(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const useFunctions = () => useSdk<Functions>(FunctionsSdkContext);
/** @deprecated Initialize Performance at module scope (`getPerformance(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const usePerformance = () => useSdk<FirebasePerformance>(PerformanceSdkContext);
/** @deprecated Initialize Storage at module scope (`getStorage(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const useStorage = () => useSdk<FirebaseStorage>(StorageSdkContext);
/** @deprecated Initialize RemoteConfig at module scope (`getRemoteConfig(app)`) instead of reading from Context. Will be removed in v5.0.0. */
export const useRemoteConfig = () => useSdk<RemoteConfig>(RemoteConfigSdkContext);

type InitSdkHook<Sdk extends FirebaseSdks> = (
  initializer: (firebaseApp: FirebaseApp) => Promise<Sdk>,
  options?: ReactFireOptions<Sdk>
) => ObservableStatus<Sdk>;

/** @deprecated Initialize Firebase SDKs at module scope (`initializeFirestore`, etc.) instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitAppCheck: InitSdkHook<AppCheck> = (initializer, options) => useInitSdk<AppCheck>('appcheck', AppCheckSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope (`initializeAuth`, etc.) instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitAuth: InitSdkHook<Auth> = (initializer, options) => useInitSdk<Auth>('auth', AuthSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitAnalytics: InitSdkHook<Analytics> = (initializer, options) => useInitSdk<Analytics>('analytics', AnalyticsSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitDatabase: InitSdkHook<Database> = (initializer, options) => useInitSdk<Database>('database', DatabaseSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope (`initializeFirestore`) instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitFirestore: InitSdkHook<Firestore> = (initializer, options) => useInitSdk<Firestore>('firestore', FirestoreSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitFunctions: InitSdkHook<Functions> = (initializer, options) => useInitSdk<Functions>('functions', FunctionsSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitPerformance: InitSdkHook<FirebasePerformance> = (initializer, options) =>
  useInitSdk<FirebasePerformance>('performance', PerformanceSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitRemoteConfig: InitSdkHook<RemoteConfig> = (initializer, options) =>
  useInitSdk<RemoteConfig>('remoteconfig', RemoteConfigSdkContext, initializer, options);
/** @deprecated Initialize Firebase SDKs at module scope instead of `useInit*`. Will be removed in v5.0.0. */
export const useInitStorage: InitSdkHook<FirebaseStorage> = (initializer, options) =>
  useInitSdk<FirebaseStorage>('storage', StorageSdkContext, initializer, options);
