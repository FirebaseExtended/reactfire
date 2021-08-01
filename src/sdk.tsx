import * as React from 'react';

import type { Auth } from 'firebase/auth';
import type { Database } from 'firebase/database';
import type { Firestore } from 'firebase/firestore';
import type { FirebasePerformance } from 'firebase/performance';
import type { FirebaseStorage } from 'firebase/storage';
import type { RemoteConfig } from 'firebase/remote-config';
import { useFirebaseApp } from './firebaseApp';
import { FirebaseApp } from 'firebase/app';
import { ObservableStatus, useObservable } from './useObservable';
import { from } from 'rxjs';
import { ReactFireOptions } from '.';

const AuthSdkContext = React.createContext<Auth | undefined>(undefined);
const DatabaseSdkContext = React.createContext<Database | undefined>(undefined);
const FirestoreSdkContext = React.createContext<Firestore | undefined>(undefined);
const StorageSdkContext = React.createContext<FirebaseStorage | undefined>(undefined);
const PerformanceSdkContext = React.createContext<FirebasePerformance | undefined>(undefined);
const RemoteConfigSdkContext = React.createContext<RemoteConfig | undefined>(undefined);

type FirebaseSdks = Auth | Database | Firestore | FirebasePerformance | FirebaseStorage | RemoteConfig;

function getSdkProvider<Sdk extends FirebaseSdks>(SdkContext: React.Context<Sdk | undefined>) {
  return function SdkProvider(props: React.PropsWithChildren<{ sdk: Sdk }>) {
    const contextualAppName = useFirebaseApp().name;
    let sdkAppName;

    // @ts-ignore Auth doesn't have field 'app'
    if (props.sdk.app) {
      // @ts-ignore Auth doesn't have field 'app'
      sdkAppName = props.sdk.app.name;

      // @ts-ignore only Auth has field 'name'
    } else if (props.sdk.name) {
      // @ts-ignore only Auth has field 'name'
      sdkAppName = props.sdk.name;
    }

    if (sdkAppName !== contextualAppName) {
      throw new Error('sdk was initialized with a different firebase app');
    }

    if (!props.sdk) {
      throw new Error('no sdk provided');
    }

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

  const initializeSdk = React.useMemo(() => sdkInitializer(firebaseApp), [firebaseApp]);

  return useObservable<Sdk>(`firebase-sdk:${sdkName}:${firebaseApp.name}`, from(initializeSdk), options);
}

export const AuthProvider = getSdkProvider<Auth>(AuthSdkContext);
export const DatabaseProvider = getSdkProvider<Database>(DatabaseSdkContext);
export const FirestoreProvider = getSdkProvider<Firestore>(FirestoreSdkContext);
export const PerformanceProvider = getSdkProvider<FirebasePerformance>(PerformanceSdkContext);
export const StorageProvider = getSdkProvider<FirebaseStorage>(StorageSdkContext);
export const RemoteConfigProvider = getSdkProvider<RemoteConfig>(RemoteConfigSdkContext);

export const useAuth = () => useSdk<Auth>(AuthSdkContext);
export const useDatabase = () => useSdk<Database>(DatabaseSdkContext);
export const useFirestore = () => useSdk<Firestore>(FirestoreSdkContext);
export const usePerformance = () => useSdk<FirebasePerformance>(PerformanceSdkContext);
export const useStorage = () => useSdk<FirebaseStorage>(StorageSdkContext);
export const useRemoteConfig = () => useSdk<RemoteConfig>(RemoteConfigSdkContext);

type InitSdkHook<Sdk extends FirebaseSdks> = (
  initializer: (firebaseApp: FirebaseApp) => Promise<Sdk>,
  options?: ReactFireOptions<Sdk>
) => ObservableStatus<Sdk>;

export const useInitAuth: InitSdkHook<Auth> = (initializer, options) => useInitSdk<Auth>('auth', AuthSdkContext, initializer, options);
export const useInitDatabase: InitSdkHook<Database> = (initializer, options) => useInitSdk<Database>('database', DatabaseSdkContext, initializer, options);
export const useInitFirestore: InitSdkHook<Firestore> = (initializer, options) => useInitSdk<Firestore>('firestore', FirestoreSdkContext, initializer, options);
export const useInitPerformance: InitSdkHook<FirebasePerformance> = (initializer, options) =>
  useInitSdk<FirebasePerformance>('performance', PerformanceSdkContext, initializer, options);
export const useInitRemoteConfig: InitSdkHook<RemoteConfig> = (initializer, options) =>
  useInitSdk<RemoteConfig>('remoteconfig', RemoteConfigSdkContext, initializer, options);
export const useInitStorage: InitSdkHook<FirebaseStorage> = (initializer, options) =>
  useInitSdk<FirebaseStorage>('storage', StorageSdkContext, initializer, options);
