import { useFirebaseApp } from '.';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { preloadObservable } from '../useObservable';

type ComponentName =
  | 'analytics'
  | 'auth'
  | 'database'
  | 'firestore'
  | 'functions'
  | 'messaging'
  | 'performance'
  | 'remoteConfig'
  | 'storage';

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
      return import(
        /* webpackChunkName: "performance" */ 'firebase/performance'
      );
    case 'remoteConfig':
      return import(
        /* webpackChunkName: "remoteConfig" */ 'firebase/remote-config'
      );
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
function proxyComponent(
  componentName: 'performance'
): typeof firebase.performance;
function proxyComponent(
  componentName: 'remoteConfig'
): typeof firebase.remoteConfig;
function proxyComponent(componentName: 'storage'): typeof firebase.storage;
function proxyComponent(
  componentName: ComponentName
): FirebaseNamespaceComponent {
  let contextualApp: App | undefined;
  const useComponent = (app?: App) => {
    contextualApp = useFirebaseApp();
    const sdkSubject = preload(componentName, app || contextualApp);
    if (!sdkSubject.hasValue) {
      throw sdkSubject.firstEmission;
    }
    sdkSubject.value; // get value to throw if there's an error
    return firebase[componentName];
  };
  return new Proxy(useComponent, {
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

export const auth = useAuth;
export const analytics = useAnalytics;
export const database = useDatabase;
export const firestore = useFirestore;
export const functions = useFunctions;
export const messaging = useMessaging;
export const performance = usePerformance;
export const remoteConfig = useRemoteConfig;
export const storage = useStorage;

function preloadFactory(
  componentName: 'auth'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['auth']) => void | Promise<any>
) => Promise<App['auth']>;
function preloadFactory(
  componentName: 'analytics'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['analytics']) => void | Promise<any>
) => Promise<App['analytics']>;
function preloadFactory(
  componentName: 'database'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['database']) => void | Promise<any>
) => Promise<App['database']>;
function preloadFactory(
  componentName: 'firestore'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['firestore']) => void | Promise<any>
) => Promise<App['firestore']>;
function preloadFactory(
  componentName: 'functions'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['functions']) => void | Promise<any>
) => Promise<App['functions']>;
function preloadFactory(
  componentName: 'messaging'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['messaging']) => void | Promise<any>
) => Promise<App['messaging']>;
function preloadFactory(
  componentName: 'performance'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['performance']) => void | Promise<any>
) => Promise<App['performance']>;
function preloadFactory(
  componentName: 'remoteConfig'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['remoteConfig']) => void | Promise<any>
) => Promise<App['remoteConfig']>;
function preloadFactory(
  componentName: 'storage'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['storage']) => void | Promise<any>
) => Promise<App['storage']>;
function preloadFactory(componentName: ComponentName) {
  return (
    firebaseApp?: App,
    settingsCallback?: (instanceFactory: FirebaseInstanceFactory) => any
  ) => preload(componentName, firebaseApp, settingsCallback).toPromise();
}

function preload(
  componentName: ComponentName,
  firebaseApp?: App,
  settingsCallback: (instanceFactory: FirebaseInstanceFactory) => any = () => {}
) {
  const app = firebaseApp || useFirebaseApp();
  return preloadObservable(
    new Observable(emitter => {
      importSDK(componentName)
        .then(() => {
          const instanceFactory = app[componentName].bind(
            app
          ) as FirebaseInstanceFactory;
          Promise.resolve(settingsCallback(instanceFactory)).then(() => {
            emitter.next(instanceFactory);
            emitter.complete();
          });
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
