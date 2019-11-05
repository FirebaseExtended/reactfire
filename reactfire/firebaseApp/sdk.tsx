import { useFirebaseApp, preloadRequest, usePreloadedRequest } from '..';
enum SDK {
  AUTH = 'auth',
  DATABASE = 'database',
  FIRESTORE = 'firestore',
  STORAGE = 'storage',
  PERFORMANCE = 'performance'
}

function fetchSDK(
  sdk: SDK,
  firebaseApp: firebase.app.App
): Promise<
  () =>
    | firebase.firestore.Firestore
    | firebase.auth.Auth
    | firebase.database.Database
    | firebase.storage.Storage
    | firebase.performance.Performance
> {
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

export function preloadFirestore(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.FIRESTORE, firebaseApp);
}

export function useFirestore(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.FIRESTORE, firebaseApp);
}

export function preloadAuth(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.AUTH, firebaseApp);
}

export function useAuth(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.AUTH, firebaseApp);
}

export function preloadDatabase(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.DATABASE, firebaseApp);
}

export function useDatabase(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.DATABASE, firebaseApp);
}

export function preloadStorage(firebaseApp: firebase.app.App) {
  return fetchSDK(SDK.STORAGE, firebaseApp);
}

export function useStorage(firebaseApp?: firebase.app.App) {
  return useSDK(SDK.STORAGE, firebaseApp);
}
