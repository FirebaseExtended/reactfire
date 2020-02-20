import { DEFAULT_APP_NAME } from '../index';
import { useFirebaseApp } from '.';
import * as firebase from 'firebase/app';

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
  const componentFn = () => {
    contextualApp = useFirebaseApp();
    if (!firebase[componentName]) {
      throw importSDK(componentName);
    }
    return firebase[componentName];
  };
  return new Proxy(componentFn, {
    get: (target, p) => target()[p],
    apply: (target, _this, args) => {
      const component = target().bind(_this);
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

function preload(
  componentName: 'auth'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['auth']) => any
) => Promise<App['auth']>;
function preload(
  componentName: 'analytics'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['analytics']) => any
) => Promise<App['analytics']>;
function preload(
  componentName: 'database'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['database']) => any
) => Promise<App['database']>;
function preload(
  componentName: 'firestore'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['firestore']) => any
) => Promise<App['firestore']>;
function preload(
  componentName: 'functions'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['functions']) => any
) => Promise<App['functions']>;
function preload(
  componentName: 'messaging'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['messaging']) => any
) => Promise<App['messaging']>;
function preload(
  componentName: 'performance'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['performance']) => any
) => Promise<App['performance']>;
function preload(
  componentName: 'remoteConfig'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['remoteConfig']) => any
) => Promise<App['remoteConfig']>;
function preload(
  componentName: 'storage'
): (
  firebaseApp?: App,
  settingsCallback?: (instanceFactory: App['storage']) => any
) => Promise<App['storage']>;
function preload(componentName: ComponentName) {
  return async (
    firebaseApp?: App,
    settingsCallback?: (instanceFactory: FirebaseInstanceFactory) => any
  ) => {
    const app = firebaseApp || useFirebaseApp();
    const initialized = !!app[componentName];
    if (!initialized) {
      await importSDK(componentName);
    }
    const instanceFactory = app[componentName].bind(
      app
    ) as FirebaseInstanceFactory;
    if (initialized) {
      if (settingsCallback) {
        console.warn(
          `${componentName} was already initialized on ${
            app.name == DEFAULT_APP_NAME ? 'the default app' : app.name
          }, ignoring settingsCallback`
        );
      }
    } else if (settingsCallback) {
      await Promise.resolve(settingsCallback(instanceFactory));
    }
    return instanceFactory;
  };
}

export const preloadAuth = preload('auth');
export const preloadAnalytics = preload('analytics');
export const preloadDatabase = preload('database');
export const preloadFirestore = preload('firestore');
export const preloadFunctions = preload('functions');
export const preloadMessaging = preload('messaging');
export const preloadPerformance = preload('performance');
export const preloadRemoteConfig = preload('remoteConfig');
export const preloadStorage = preload('storage');
