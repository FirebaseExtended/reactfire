# Reference Docs

## Table of Contents

- [Hooks](#Hooks)

  - SDK

    - [`useFirebaseApp`](#useFirebaseApp)
    - [`useAnalytics`](#useAnalytics)
    - [`useAuth`](#useAuth)
    - [`useDatabase`](#useDatabase)
    - [`useFirestore`](#useFirestore)
    - [`useFunctions`](#useFunctions)
    - [`useMessaging`](#useMessaging)
    - [`usePerformance`](#usePerformance)
    - [`useRemoteConfig`](#useRemoteConfig)
    - [`useStorage`](#useStorage)

  - Authentication
    - [`useUser`](#useUser)
  - Database
    - Cloud Firestore
      - [`useFirestoreDoc`](#useFirestoreDoc)
      - [`useFirestoreDocData`](#useFirestoreDocData)
      - [`useFirestoreCollection`](#useFirestoreCollection)
      - [`useFirestoreCollectionData`](#useFirestoreCollectionData)
    - Realtime Database
      - [`useDatabaseObject`](#useDatabaseObject)
      - [`useDatabaseObjectData`](#useDatabaseObjectData)
      - [`useDatabaseList`](#useDatabaseList)
      - [`useDatabaseListData`](#useDatabaseListData)
  - Cloud Storage
    - [`useStorageTask`](#useStorageTask)
    - [`useStorageDownloadURL`](#useStorageDownloadURL)
  - [ReactFireOptions](#ReactFireOptions)

- [Components](#Components)
  - [`FirebaseAppProvider`](#FirebaseAppProvider)
  - Performance Monitoring
    - [`SuspenseWithPerf`](#SuspenseWithPerf)
  - Authentication
    - [`AuthCheck`](#AuthCheck)
  - Cloud Storage
    - [`StorageImage`](#StorageImage)
- [Preloading](#Preloading)
  - SDK
    - [`preloadAnalytics`](#preloadAnalytics)
    - [`preloadAuth`](#preloadAuth)
    - [`preloadDatabase`](#preloadDatabase)
    - [`preloadFirestore`](#preloadFirestore)
    - [`preloadFunctions`](#preloadFunctions)
    - [`preloadMessaging`](#preloadMessaging)
    - [`preloadPerformance`](#preloadPerformance)
    - [`preloadRemoteConfig`](#preloadRemoteConfig)
    - [`preloadStorage`](#preloadStorage)

## Hooks

### `useFirebaseApp`

When called from a component nested inside a `FirebaseAppProvider`, `useFirebaseApp` returns the root Firebase object.

> IMPORTANT: By default, `useFirebaseApp` returns a firebase object without any products attached to it (e.g. you can't call `firebase.firestore()`. To do that, you need to import a Firebase feature (`import 'firebase/firestore'`) or lazy load a feature with one of the Hooks below)

#### Returns

[`firebase`](https://firebase.google.com/docs/reference/js/firebase)

### `useAnalytics`

_Throws a Promise by default_

Returns `firebase.analytics` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.analytics` doesn't exist, it lazy loads the Analytics SDK.

#### Returns

[`firebase.analytics`](https://firebase.google.com/docs/reference/js/firebase.analytics.html)

### `useAuth`

_Throws a Promise by default_

Returns `firebase.auth` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.auth` doesn't exist, it lazy loads the Auth SDK.

#### Returns

[`firebase.auth`](https://firebase.google.com/docs/reference/js/firebase.auth.html)

### `useDatabase`

_Throws a Promise by default_

Returns `firebase.database` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.database` doesn't exist, it lazy loads the Realtime Database SDK.

#### Returns

[`firebase.database`](https://firebase.google.com/docs/reference/js/firebase.database.html)

### `useFirestore`

_Throws a Promise by default_

Returns `firebase.firestore` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.firestore` doesn't exist, it lazy loads the Cloud Firestore SDK.

#### Returns

[`firebase.firestore`](https://firebase.google.com/docs/reference/js/firebase.firestore.html)

### `useFunctions`

_Throws a Promise by default_

Returns `firebase.functions` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.functions` doesn't exist, it lazy loads the Cloud Functions for Firebase SDK.

#### Returns

[`firebase.functions`](https://firebase.google.com/docs/reference/js/firebase.functions.html)

### `useMessaging`

_Throws a Promise by default_

Returns `firebase.messaging` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.messaging` doesn't exist, it lazy loads the Firebase Cloud Messaging SDK.

#### Returns

[`firebase.messaging`](https://firebase.google.com/docs/reference/js/firebase.messaging.html)

### `usePerformance`

_Throws a Promise by default_

Returns `firebase.performance` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.performance` doesn't exist, it lazy loads the Performance Monitoring SDK.

#### Returns

[`firebase.performance`](https://firebase.google.com/docs/reference/js/firebase.performance.html)

### `useRemoteConfig`

_Throws a Promise by default_

Returns `firebase.remoteConfig` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.remoteConfig` doesn't exist, it lazy loads the Remote Config SDK.

#### Returns

[`firebase.remoteConfig`](https://firebase.google.com/docs/reference/js/firebase.remoteConfig.html)

### `useStorage`

_Throws a Promise by default_

Returns `firebase.storage` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.storage` doesn't exist, it lazy loads the Storage SDK.

#### Returns

[`firebase.storage`](https://firebase.google.com/docs/reference/js/firebase.storage.html)

### `useUser`

Get the user that is currently signed in. Lazy loads the `firebase/auth` SDK if it is not already loaded.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                            | Description                                                                                         |
| ----------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| auth _?_    | [`Auth`](https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html) | [optional] auth object. If not provided, useUser will use `useFirebaseApp` to find the Auth object. |
| options _?_ | ReactFireOptions                                                                | Options. This hook will not throw a Promise if you provide `startWithValue`.                        |

#### Returns

[`User`](https://firebase.google.com/docs/reference/js/firebase.User)

### `useFirestoreDoc`

Listen to a Firestore Document.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                                      | Description                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`DocumentReference`](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference) | A reference to the document you want to listen to                            |
| options _?_ | ReactFireOptions                                                                                          | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

[`DocumentSnapshot`](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot)

### `useFirestoreDocData`

Listen to a Firestore Document.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                                      | Description                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`DocumentReference`](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference) | A reference to the document you want to listen to                            |
| options _?_ | ReactFireOptions                                                                                          | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

`T`

### `useFirestoreCollection`

Listen to a Firestore Collection.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                              | Description                                                                  |
| ----------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Query`](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) | A query for the collection you want to listen to                             |
| options _?_ | ReactFireOptions                                                                  | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

[`QuerySnapshot`](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot)

### `useFirestoreCollectionData`

Listen to a Firestore Collection.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                              | Description                                                                  |
| ----------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Query`](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) | A query for the collection you want to listen to                             |
| options _?_ | ReactFireOptions                                                                  | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

`T[]`

### `useDatabaseObject`

Listen to a Realtime Database Object.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                     | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) | A reference to the object you want to listen to                              |
| options _?_ | ReactFireOptions                                                                         | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

[`QueryChange`](https://github.com/firebase/firebase-js-sdk/blob/6b53e0058483c9002d2fe56119f86fc9fb96b56c/packages/rxfire/database/interfaces.ts#L28)

### `useDatabaseObjectData`

Listen to a Realtime Database Object.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                     | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) | A reference to the object you want to listen to                              |
| options _?_ | ReactFireOptions                                                                         | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

`T`

### `useDatabaseList`

Listen to a Realtime Database list.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                     | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) | A reference to the list you want to listen to                                |
| options _?_ | ReactFireOptions                                                                         | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

[`QueryChange[]`](https://github.com/firebase/firebase-js-sdk/blob/6b53e0058483c9002d2fe56119f86fc9fb96b56c/packages/rxfire/database/interfaces.ts#L28)

### `useDatabaseListData`

Listen to a Realtime Database list.

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                     | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) | A reference to the list you want to listen to                                |
| options _?_ | ReactFireOptions                                                                         | Options. This hook will not throw a Promise if you provide `startWithValue`. |

#### Returns

`T[]`

### `useStorageTask`

Listen to a Storage UploadTask

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------- | ----------- |
| task        | [`UploadTask`](https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask) |             |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.storage.Reference)   |             |
| options _?_ | ReactFireOptions                                                                          |             |

#### Returns

[`UploadTaskSnapshot`](https://firebase.google.com/docs/reference/js/firebase.storage.UploadTaskSnapshot)

### `useStorageDownloadURL`

Subscribe to a storage blob's download URL

_Throws a Promise by default_

### Parameters

| Parameter   | Type                                                                                    | Description |
| ----------- | --------------------------------------------------------------------------------------- | ----------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.storage.Reference) |             |
| options _?_ | ReactFireOptions                                                                        |             |

#### Returns

`string`

## ReactFireOptions

| Property       | Type |
| -------------- | ---- |
| startWithValue | any  |

## Components

### `FirebaseAppProvider`

A React [Context Provider](https://reactjs.org/docs/context.html#contextprovider) that allows the `useFirebaseApp` hook to pick up the `firebase` object.

#### Sample usage

```jsx
const firebaseConfig = {
  /* web app config from Firebase console */
};

<FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
  <App />
</FirebaseAppProvider>;
```

#### Props

| Prop            | Type   | Description                                                                                                                              |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| config          | Object | the web app config object usually passed to [`initializeApp`](https://firebase.google.com/docs/reference/js/firebase.html#initializeapp) |
| initPerformance | bool   | Whether or not to initialize Firebase Performance Monitoring                                                                             |

### `AuthCheck`

Renders `children` if a user is signed in and meets the required claims. Renders `fallback` otherwise.

#### Props

| Property       | Type            |
| -------------- | --------------- |
| auth           | Auth            |
| children       | React.Component |
| fallback       | React.Component |
| requiredClaims | Object          |

### `StorageImage`

Renders an image based on a Cloud Storage path.

#### Props

| Property    | Type                     |
| ----------- | ------------------------ |
| storagePath | string                   |
| storage?    | firebase.storage.Storage |

...and any other props a normal React `<img>` element can take.

### `SuspenseWithPerf`

Starts a Firebase Performance Monitoring [trace](https://firebase.google.com/docs/reference/js/firebase.performance.Trace) and ends it when suspense stops suspending.

#### Props

| Property     | Type            |
| ------------ | --------------- |
| children     | React.Component |
| fallback     | React.Component |
| firePerf _?_ | any             |
| traceId      | string          |

## Preloading

### `preloadAnalytics`

Start importing the `firebase/analytics` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.analytics`](https://firebase.google.com/docs/reference/js/firebase.analytics)`>`

### `preloadAuth`

Start importing the `firebase/auth` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.auth`](https://firebase.google.com/docs/reference/js/firebase.auth)`>`

### `preloadDatabase`

Start importing the `firebase/database` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.database`](https://firebase.google.com/docs/reference/js/firebase.database)`>`

### `preloadFirestore`

Start importing the `firebase/firestore` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.firestore`](https://firebase.google.com/docs/reference/js/firebase.firestore)`>`

### `preloadFunctions`

Start importing the `firebase/functions` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.functions`](https://firebase.google.com/docs/reference/js/firebase.functions)`>`

### `preloadMessaging`

Start importing the `firebase/messaging` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.messaging`](https://firebase.google.com/docs/reference/js/firebase.messaging)`>`

### `preloadPerformance`

Start importing the `firebase/performance` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.performance`](https://firebase.google.com/docs/reference/js/firebase.performance)`>`

### `preloadRemoteConfig`

Start importing the `firebase/remoteConfig` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.remoteConfig`](https://firebase.google.com/docs/reference/js/firebase.remoteConfig)`>`

### `preloadStorage`

Start importing the `firebase/storage` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.storage`](https://firebase.google.com/docs/reference/js/firebase.storage)`>`
