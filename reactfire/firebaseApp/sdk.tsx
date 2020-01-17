import { useFirebaseApp, preloadRequest, usePreloadedRequest } from '..';

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

function fetchSDK(sdk: SDK, firebaseApp: firebase.app.App) {
  if (!firebaseApp) {
    throw new Error('Firebase app was not provided');
  }

  let sdkPromise;

  if (firebaseApp[sdk]) {
    sdkPromise = Promise.resolve(firebaseApp[sdk]);
  } else {
    switch (sdk) {
      case SDK.FIRESTORE:
        sdkPromise = import(
          /* webpackChunkName: "firestore" */ 'firebase/firestore'
        );
        break;
      case SDK.DATABASE:
        sdkPromise = import(
          /* webpackChunkName: "database" */ 'firebase/database'
        );
        break;
      case SDK.AUTH:
        sdkPromise = import(/* webpackChunkName: "auth" */ 'firebase/auth');
        break;
      case SDK.STORAGE:
        sdkPromise = import(
          /* webpackChunkName: "storage" */ 'firebase/storage'
        );
        break;
      case SDK.PERFORMANCE:
        sdkPromise = import(
          /* webpackChunkName: "performance" */ 'firebase/performance'
        );
        break;
      case SDK.REMOTE_CONFIG:
        sdkPromise = import(
          /* webpackChunkName: "config" */ 'firebase/remote-config'
        );
        break;
    }
    sdkPromise = sdkPromise.then(() => firebaseApp[sdk]);
  }
  return sdkPromise;
}

function useSDK(sdk: SDK, firebaseApp?: firebase.app.App) {
  firebaseApp = firebaseApp || useFirebaseApp();

  // use the request cache so we don't issue multiple fetches for the sdk
  const result = preloadRequest(
    () => fetchSDK(sdk, firebaseApp),
    `firebase-sdk-${sdk}`
  );

  return usePreloadedRequest(result);
}

export function preloadAuth(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.AUTH, firebaseApp);
}

export function useAuth(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.AUTH, firebaseApp);
}

export function preloadAnalytics(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.ANALYTICS, firebaseApp);
}

export function useAnalytics(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.ANALYTICS, firebaseApp);
}

export function preloadDatabase(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.DATABASE, firebaseApp);
}

export function useDatabase(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.DATABASE, firebaseApp);
}

export function preloadFirestore(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.FIRESTORE, firebaseApp);
}

export function useFirestore(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.FIRESTORE, firebaseApp);
}

export function preloadFunctions(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.FUNCTIONS, firebaseApp);
}

export function useFunctions(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.FUNCTIONS, firebaseApp);
}

export function preloadMessaging(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.MESSAGING, firebaseApp);
}

export function useMessaging(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.MESSAGING, firebaseApp);
}

export function preloadPerformance(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.PERFORMANCE, firebaseApp);
}

export function usePerformance(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.PERFORMANCE, firebaseApp);
}

export function preloadRemoteConfig(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.REMOTE_CONFIG, firebaseApp);
}

export function useRemoteConfig(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.REMOTE_CONFIG, firebaseApp);
}

export function preloadStorage(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.STORAGE, firebaseApp);
}

export function useStorage(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.STORAGE, firebaseApp);
}
