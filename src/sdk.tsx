import { useFirebaseApp, useSuspenseEnabledFromConfigAndContext, preloadObservable } from './';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

type ComponentName = 'analytics' | 'auth' | 'database' | 'firestore' | 'functions' | 'messaging' | 'performance' | 'remoteConfig' | 'storage';

type ValueOf<T> = T[keyof T];
type App = firebase.app.App;
type FirebaseInstanceFactory = ValueOf<Pick<App, ComponentName>>;
type FirebaseNamespaceComponent = ValueOf<Pick<typeof firebase, ComponentName>>;

function importSDK(sdk: ComponentName) {
  switch (sdk) {
    case 'analytics':
      return import(/* webpackChunkName: "analytics" */ 'firebase/analytics');
    case 'auth':
      return import(/* webpackChunkName: "auth" */ 'firebase/auth');
    case 'database':
      return import(/* webpackChunkName: "database" */ 'firebase/database');
    case 'firestore':
      return import(/* webpackChunkName: "firestore" */ 'firebase/firestore');
    case 'functions':
      return import(/* webpackChunkName: "functions" */ 'firebase/functions');
    case 'messaging':
      return import(/* webpackChunkName: "messaging" */ 'firebase/messaging');
    case 'performance':
      return import(/* webpackChunkName: "performance" */ 'firebase/performance');
    case 'remoteConfig':
      return import(/* webpackChunkName: "remoteConfig" */ 'firebase/remote-config');
    case 'storage':
      return import(/* webpackChunkName: "storage" */ 'firebase/storage');
  }
}

function proxyComponent(componentName: 'auth'): typeof firebase.auth;
function proxyComponent(componentName: 'analytics'): typeof firebase.analytics;
function proxyComponent(componentName: 'database'): typeof firebase.database;
function proxyComponent(componentName: 'firestore'): typeof firebase.firestore;
function proxyComponent(componentName: 'functions'): typeof firebase.functions;
function proxyComponent(componentName: 'messaging'): typeof firebase.messaging;
function proxyComponent(componentName: 'performance'): typeof firebase.performance;
function proxyComponent(componentName: 'remoteConfig'): typeof firebase.remoteConfig;
function proxyComponent(componentName: 'storage'): typeof firebase.storage;
function proxyComponent(componentName: ComponentName): FirebaseNamespaceComponent {
  let contextualApp: App | undefined;
  const useComponent = (app?: App, suspense?: boolean) => {
    // Get the app from context,
    // but prefer a passed-in app over the one from context
    contextualApp = useFirebaseApp();
    const firebaseApp = app || contextualApp;

    const suspenseEnabled = useSuspenseEnabledFromConfigAndContext(suspense);
    if (suspenseEnabled) {
      // automatically kick off a lazy-load of the requested SDK
      const sdkSubject = preload(componentName, firebaseApp);

      if (sdkSubject.hasValue) {
        // get value to throw in case there's an error
        sdkSubject.value; // eslint-disable-line @typescript-eslint/no-unused-expressions
        return firebase[componentName];
      } else {
        throw sdkSubject.firstEmission;
      }
    } else if (firebaseApp[componentName]) {
      // TODO(jamesdaniels): Shouldn't this be firebaseApp?
      // firebaseApp[componentName].bind(firebaseApp) doesn't seem to work, though
      return firebase[componentName];
    } else {
      throw new Error(
        `ReactFire: "firebase/${componentName}" not found. Please import it in your component, or call preload${componentName.charAt(0).toUpperCase() +
          componentName.slice(1)} and wait for it to resolve. ReactFire can only auto-import Firebase libraries if Suspense mode is enabled.`
      );
    }
  };

  return new Proxy(useComponent, {
    // @ts-ignore: TODO: Fix the types here
    get: (target, p) => target()[p],
    apply: (target, _this, args) => {
      const component = target(args[0]).bind(_this);
      // If they don't pass an app, assume the app in context rather than [DEFAULT]
      if (!args[0]) {
        args[0] = contextualApp;
      }
      return component(...args);
    }
  }) as any;
}

export const useAuth = proxyComponent('auth');
export const useAnalytics = proxyComponent('analytics');
export const useDatabase = proxyComponent('database');
export const useFirestore = proxyComponent('firestore');
export const useFunctions = proxyComponent('functions');
export const useMessaging = proxyComponent('messaging');
export const usePerformance = proxyComponent('performance');
export const useRemoteConfig = proxyComponent('remoteConfig');
export const useStorage = proxyComponent('storage');

export type PreloadOptions<T> = {
  firebaseApp: App;
  setup?: (instanceFactory: T) => void | Promise<any>;
  suspense?: boolean;
};

function preloadFactory(componentName: 'auth'): (options: PreloadOptions<App['auth']>) => Promise<App['auth']>;
function preloadFactory(componentName: 'analytics'): (options: PreloadOptions<App['analytics']>) => Promise<App['analytics']>;
function preloadFactory(componentName: 'database'): (options: PreloadOptions<App['database']>) => Promise<App['database']>;
function preloadFactory(componentName: 'firestore'): (options: PreloadOptions<App['firestore']>) => Promise<App['firestore']>;
function preloadFactory(componentName: 'functions'): (options: PreloadOptions<App['functions']>) => Promise<App['functions']>;
function preloadFactory(componentName: 'messaging'): (options: PreloadOptions<App['messaging']>) => Promise<App['messaging']>;
function preloadFactory(componentName: 'performance'): (options: PreloadOptions<App['performance']>) => Promise<App['performance']>;
function preloadFactory(componentName: 'remoteConfig'): (options: PreloadOptions<App['remoteConfig']>) => Promise<App['remoteConfig']>;
function preloadFactory(componentName: 'storage'): (options: PreloadOptions<App['storage']>) => Promise<App['storage']>;
function preloadFactory(componentName: ComponentName) {
  return (options: PreloadOptions<FirebaseInstanceFactory>) => preload(componentName, options.firebaseApp, options.setup).toPromise();
}

function preload(componentName: ComponentName, firebaseApp: App, settingsCallback: (instanceFactory: FirebaseInstanceFactory) => any = () => {}) {
  const app = firebaseApp;

  return preloadObservable(
    new Observable(emitter => {
      importSDK(componentName)
        .then(async () => {
          const instanceFactory: FirebaseInstanceFactory = app[componentName].bind(app);

          // Make sure settingsCallback completes before returning the SDK
          // Often, SDK settings must be set before any other calls to that SDK can be made
          await Promise.resolve(settingsCallback(instanceFactory));
          emitter.next(instanceFactory);
          emitter.complete();
        })
        .catch(e => {
          emitter.error(e);
          emitter.complete();
        });
    }),
    `firebase-sdk:${componentName}:${app.name}`
  );
}

export const preloadAuth = preloadFactory('auth');
export const preloadAnalytics = preloadFactory('analytics');
export const preloadDatabase = preloadFactory('database');
export const preloadFirestore = preloadFactory('firestore');
export const preloadFunctions = preloadFactory('functions');
export const preloadMessaging = preloadFactory('messaging');
export const preloadPerformance = preloadFactory('performance');
export const preloadRemoteConfig = preloadFactory('remoteConfig');
export const preloadStorage = preloadFactory('storage');
