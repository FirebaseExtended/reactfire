import { useFirebaseApp } from '..';
import { preloadObservable, useObservable } from '../useObservable';
import { from } from 'rxjs';

type RemoteConfig = import('firebase/app').remoteConfig.RemoteConfig;
type Storage = import('firebase/app').storage.Storage;
type Firestore = import('firebase/app').firestore.Firestore;
type Performance = import('firebase/app').performance.Performance;
type Messaging = import('firebase/app').messaging.Messaging;
type Functions = import('firebase/app').functions.Functions;
type Database = import('firebase/app').database.Database;
type Auth = import('firebase/app').auth.Auth;

type FirebaseSDK =
  | (() => firebase.analytics.Analytics)
  | (() => firebase.auth.Auth)
  | ((url?: string) => firebase.database.Database)
  | (() => firebase.firestore.Firestore)
  | ((region?: string) => firebase.functions.Functions)
  | (() => firebase.messaging.Messaging)
  | (() => firebase.performance.Performance)
  | (() => firebase.remoteConfig.RemoteConfig)
  | ((url?: string) => firebase.storage.Storage);

enum SDK {
  ANALYTICS = 'analytics',
  AUTH = 'auth',
  DATABASE = 'database',
  FIRESTORE = 'firestore',
  FUNCTIONS = 'functions',
  MESSAGING = 'messaging',
  PERFORMANCE = 'performance',
  REMOTE_CONFIG = 'remoteConfig',
  STORAGE = 'storage'
}

function fetchSDK(
  sdk: SDK,
  firebaseApp: firebase.app.App,
  settingsCallback: (sdk: FirebaseSDK) => Promise<any> | void = () =>
    Promise.resolve()
) {
  if (!firebaseApp) {
    throw new Error('Firebase app was not provided');
  }

  let sdkPromise: Promise<FirebaseSDK>;

  if (firebaseApp[sdk]) {
    // Don't apply settings here. Only needed for lazy loaded SDKs.
    // If not lazy loaded, user can provide settings as normal
    sdkPromise = Promise.resolve(firebaseApp[sdk]);
  } else {
    switch (sdk) {
      case SDK.ANALYTICS:
        sdkPromise = import(
          /* webpackChunkName: "analytics" */ 'firebase/analytics'
        );
        break;
      case SDK.AUTH:
        sdkPromise = import(/* webpackChunkName: "auth" */ 'firebase/auth');
        break;
      case SDK.DATABASE:
        sdkPromise = import(
          /* webpackChunkName: "database" */ 'firebase/database'
        );
        break;
      case SDK.FIRESTORE:
        sdkPromise = import(
          /* webpackChunkName: "firestore" */ 'firebase/firestore'
        );
        break;
      case SDK.FUNCTIONS:
        sdkPromise = import(
          /* webpackChunkName: "functions" */ 'firebase/functions'
        );
        break;
      case SDK.MESSAGING:
        sdkPromise = import(
          /* webpackChunkName: "messaging" */ 'firebase/messaging'
        );
        break;
      case SDK.PERFORMANCE:
        sdkPromise = import(
          /* webpackChunkName: "performance" */ 'firebase/performance'
        );
        break;
      case SDK.REMOTE_CONFIG:
        sdkPromise = import(
          /* webpackChunkName: "remoteConfig" */ 'firebase/remote-config'
        );
        break;
      case SDK.STORAGE:
        sdkPromise = import(
          /* webpackChunkName: "storage" */ 'firebase/storage'
        );
        break;
    }
    sdkPromise = sdkPromise
      .then(() => settingsCallback(firebaseApp[sdk]))
      .then(() => firebaseApp[sdk]);
  }
  preloadObservable(from(sdkPromise), `firebase-sdk-${sdk}`);

  return sdkPromise;
}

function useSDK(sdk: SDK, firebaseApp?: firebase.app.App) {
  firebaseApp = firebaseApp || useFirebaseApp();

  // use the request cache so we don't issue multiple fetches for the sdk
  return useObservable(from(fetchSDK(sdk, firebaseApp)), `firebase-sdk-${sdk}`);
}

export function preloadAuth(
  firebaseApp: firebase.app.App,
  settingsCallback?: (auth: () => Auth) => void
) {
  return fetchSDK(SDK.AUTH, firebaseApp, settingsCallback);
}

export function useAuth(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.AUTH, firebaseApp) as () => firebase.auth.Auth;
}

export function preloadAnalytics(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.ANALYTICS, firebaseApp);
}

export function useAnalytics(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.ANALYTICS, firebaseApp);
}

export function preloadDatabase(
  firebaseApp: firebase.app.App,
  settingsCallback?: (database: () => Database) => void
) {
  return fetchSDK(SDK.DATABASE, firebaseApp, settingsCallback);
}

export function useDatabase(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.DATABASE, firebaseApp);
}

export function preloadFirestore(
  firebaseApp: firebase.app.App,
  settingsCallback?: (firestore: () => Firestore) => Promise<void>
) {
  return fetchSDK(SDK.FIRESTORE, firebaseApp, settingsCallback);
}

export function useFirestore(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.FIRESTORE, firebaseApp);
}

export function preloadFunctions(
  firebaseApp?: firebase.app.App,
  settingsCallback?: (functions: () => Functions) => void
) {
  return fetchSDK(SDK.FUNCTIONS, firebaseApp, settingsCallback);
}

export function useFunctions(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.FUNCTIONS, firebaseApp);
}

export function preloadMessaging(
  firebaseApp: firebase.app.App,
  settingsCallback?: (messaging: () => Messaging) => void
) {
  return fetchSDK(SDK.MESSAGING, firebaseApp, settingsCallback);
}

export function useMessaging(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.MESSAGING, firebaseApp);
}

export function preloadPerformance(
  firebaseApp: firebase.app.App,
  settingsCallback?: (performance: () => Performance) => void
) {
  return fetchSDK(SDK.PERFORMANCE, firebaseApp, settingsCallback);
}

export function usePerformance(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.PERFORMANCE, firebaseApp);
}

export function preloadRemoteConfig(
  firebaseApp: firebase.app.App,
  settingsCallback?: (remoteConfig: () => RemoteConfig) => Promise<any>
) {
  return fetchSDK(SDK.REMOTE_CONFIG, firebaseApp, settingsCallback);
}

export function useRemoteConfig(firebaseApp?: firebase.app.App) {
  return useSDK(
    SDK.REMOTE_CONFIG,
    firebaseApp
  ) as () => firebase.remoteConfig.RemoteConfig;
}

export function preloadStorage(
  firebaseApp: firebase.app.App,
  settingsCallback: (storage: () => Storage) => Promise<void>
) {
  return fetchSDK(SDK.STORAGE, firebaseApp, settingsCallback);
}

export function useStorage(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.STORAGE, firebaseApp);
}
