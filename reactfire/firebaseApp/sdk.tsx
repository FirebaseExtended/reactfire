import { useFirebaseApp } from '..';
import { useObservable } from '../useObservable';
import { from } from 'rxjs';
import { DEFAULT_APP_NAME } from '../index';

type App = import('firebase/app').app.App;
type RemoteConfig = Omit<typeof import('firebase/app').remoteConfig, "*"> & import('firebase/app').remoteConfig.RemoteConfig;
type Storage = Omit<typeof import('firebase/app').storage, "*"> & import('firebase/app').storage.Storage;
type Firestore = Omit<typeof import('firebase/app').firestore, "*"> & import('firebase/app').firestore.Firestore;
type Performance = Omit<typeof import('firebase/app').performance, "*"> & import('firebase/app').performance.Performance;
type Messaging = Omit<typeof import('firebase/app').messaging, "*"> & import('firebase/app').messaging.Messaging;
type Functions = Omit<typeof import('firebase/app').functions, "*"> & import('firebase/app').functions.Functions;
type Database = Omit<typeof import('firebase/app').database, "*"> & import('firebase/app').database.Database;
type Auth = Omit<typeof import('firebase/app').auth, "*"> & import('firebase/app').auth.Auth;
type Analytics = Omit<typeof import('firebase/app').analytics, "*"> & import('firebase/app').analytics.Analytics;

type FirebaseNamespace =
  | Analytics
  | Auth
  | Database
  | Firestore
  | Functions
  | Messaging
  | Performance
  | RemoteConfig
  | Storage;

const enum SDK {
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
  firebaseApp: App,
  settingsCallback?: (sdk: FirebaseNamespace) => any
) {
  if (!firebaseApp) {
    throw new Error('Firebase app was not provided');
  }
  if (firebaseApp[sdk]) {
    // Don't apply settings here. Only needed for lazy loaded SDKs.
    // If not lazy loaded, user can provide settings as normal
    if (settingsCallback) { console.warn(`${sdk} was already initialized on ${firebaseApp.name == DEFAULT_APP_NAME ? 'the default app' : firebaseApp.name }, ignoring settingsCallback`) }
    // TODO cleanup types, this is an internal API
    const serviceProps = (firebaseApp as any).container?.providers?.get(sdk)?.component?.serviceProps ?? {};
    const component = firebaseApp[sdk]();
    const proxy = new Proxy(component, { get: (target, p) => serviceProps[p] ?? target[p] }) as FirebaseNamespace;
    return Promise.resolve(proxy);
  } else {
    let sdkPromise: Promise<FirebaseNamespace>;
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
    return sdkPromise
      .then(() => Promise.resolve(settingsCallback && settingsCallback(firebaseApp[sdk].bind(firebaseApp))))
      .then(() => {
        // TODO cleanup types, this is an internal API
        const serviceProps = (firebaseApp as any).container?.providers?.get(sdk)?.component?.serviceProps ?? {};
        const component = firebaseApp[sdk]();
        return new Proxy(component, { get: (target, p) => serviceProps[p] ?? target[p] }) as FirebaseNamespace;
      });
  }
}

function useSDK(sdk: SDK, firebaseApp?: App) {
  firebaseApp = firebaseApp || useFirebaseApp();

  // use the request cache so we don't issue multiple fetches for the sdk
  return useObservable(
    from(fetchSDK(sdk, firebaseApp)),
    `firebase:sdk-${sdk}:${firebaseApp.name}`
  );
}

export function preloadAuth(
  firebaseApp: App,
  settingsCallback?: (auth: Auth) => void
) {
  return fetchSDK(SDK.AUTH, firebaseApp, settingsCallback) as Promise<Auth>;
}

export function useAuth(firebaseApp?: App) {
  return useSDK(SDK.AUTH, firebaseApp) as Auth;
}

export function preloadAnalytics(firebaseApp: App) {
  return fetchSDK(SDK.ANALYTICS, firebaseApp) as Promise<Analytics>;
}

export function useAnalytics(firebaseApp?: App) {
  return useSDK(SDK.ANALYTICS, firebaseApp) as Analytics;
}

export function preloadDatabase(
  firebaseApp: App,
  settingsCallback?: (database: Database) => void
) {
  return fetchSDK(SDK.DATABASE, firebaseApp, settingsCallback) as Promise<Database>;
}

export function useDatabase(firebaseApp?: App) {
  return useSDK(SDK.DATABASE, firebaseApp) as Database;
}

export function preloadFirestore(
  firebaseApp: App,
  settingsCallback?: (firestore: Firestore) => void|Promise<any>
) {
  return fetchSDK(SDK.FIRESTORE, firebaseApp, settingsCallback) as Promise<Firestore>;
}

export function useFirestore(firebaseApp?: App) {
  return useSDK(SDK.FIRESTORE, firebaseApp) as Firestore;
}

export function preloadFunctions(
  firebaseApp?: App,
  settingsCallback?: (functions: Functions) => void
) {
  return fetchSDK(SDK.FUNCTIONS, firebaseApp, settingsCallback) as Promise<Functions>;
}

export function useFunctions(firebaseApp?: App) {
  return useSDK(SDK.FUNCTIONS, firebaseApp) as Functions;
}

export function preloadMessaging(
  firebaseApp: App,
  settingsCallback?: (messaging: Messaging) => void
) {
  return fetchSDK(SDK.MESSAGING, firebaseApp, settingsCallback) as Promise<Messaging>;
}

export function useMessaging(firebaseApp?: App) {
  return useSDK(SDK.MESSAGING, firebaseApp) as Messaging;
}

export function preloadPerformance(
  firebaseApp: App,
  settingsCallback?: (performance: Performance) => void
) {
  return fetchSDK(SDK.PERFORMANCE, firebaseApp, settingsCallback)  as Promise<Performance>;
}

export function usePerformance(firebaseApp?: App) {
  return useSDK(SDK.PERFORMANCE, firebaseApp) as Performance;
}

export function preloadRemoteConfig(
  firebaseApp: App,
  settingsCallback?: (remoteConfig: RemoteConfig) => void|Promise<any>
) {
  return fetchSDK(SDK.REMOTE_CONFIG, firebaseApp, settingsCallback)  as Promise<RemoteConfig>;
}

export function useRemoteConfig(firebaseApp?: App) {
  return useSDK(SDK.REMOTE_CONFIG, firebaseApp) as RemoteConfig;
}

export function preloadStorage(
  firebaseApp: App,
  settingsCallback: (storage: Storage) => void|Promise<any>
) {
  return fetchSDK(SDK.STORAGE, firebaseApp, settingsCallback) as Promise<Storage>;
}

export function useStorage(firebaseApp?: App) {
  return useSDK(SDK.STORAGE, firebaseApp) as Storage;
}