# Reference Docs

## Table of Contents

- [Hooks](#Hooks)
  - SDK
    - [`useFirebaseApp`](#useFirebaseApp)
    - [`useFirestore`](#useFirestore)
    - [`useDatabase`](#useDatabase)
    - [`useAuth`](#useAuth)
    - [`useStorage`](#useStorage)
  - Authentication
    - [`useUser`](#useUser)
  - Database
    - Cloud Firestore
      - [`useFirestoreDoc`](#useFirestoreDoc)
      - [`useFirestoreCollection`](#useFirestoreCollection)
    - Realtime Database
      - [`useDatabaseObject`](#useDatabaseObject)
      - [`useDatabaseList`](#useDatabaseList)
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
- [Preloading](#Preloading)
  - SDK
    - [`preloadAuth`](#preloadAuth)
    - [`preloadDatabase`](#preloadDatabase)
    - [`preloadFirestore`](#preloadFirestore)
    - [`preloadStorage`](#preloadStorage)

## Hooks

### `useFirebaseApp`

When called from a component nested inside a `FirebaseAppProvider`, `useFirebaseApp` returns the root Firebase object.

> IMPORTANT: By default, `useFirebaseApp` returns a firebase object without any products attached to it (e.g. you can't call `firebase.firestore()`. To do that, you need to import a Firebase feature (`import 'firebase/firestore'`) or lazy load a feature with one of the Hooks below)

#### Returns

[`firebase`](https://firebase.google.com/docs/reference/js/firebase)

### `useFirestore`

_Throws a Promise by default_

Returns `firebase.firestore` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.firestore` doesn't exist, it lazy loads the Cloud Firestore SDK.

#### Returns

`([`firebase.firestore`](https://firebase.google.com/docs/reference/js/firebase.firestore.html))`

### `useDatabase`

_Throws a Promise by default_

Returns `firebase.database` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.database` doesn't exist, it lazy loads the Realtime Database SDK.

#### Returns

`([`firebase.database`](https://firebase.google.com/docs/reference/js/firebase.database.html))`

### `useAuth`

_Throws a Promise by default_

Returns `firebase.auth` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.auth` doesn't exist, it lazy loads the Auth SDK.

#### Returns

`([`firebase.auth`](https://firebase.google.com/docs/reference/js/firebase.auth.html))`

### `useStorage`

_Throws a Promise by default_

Returns `firebase.storage` When called from a component nested inside a `FirebaseAppProvider`. If `firebase.storage` doesn't exist, it lazy loads the Storage SDK.

#### Returns

`([`firebase.storage`](https://firebase.google.com/docs/reference/js/firebase.storage.html))`

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

### preloadAuth

Start importing the `firebase/auth` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.auth`](https://firebase.google.com/docs/reference/js/firebase.auth)`>`

### preloadDatabase

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

### preloadStorage

Start importing the `firebase/storage` package.

#### Parameters

| Parameter   | Type                                                                                 | Description         |
| ----------- | ------------------------------------------------------------------------------------ | ------------------- |
| firebaseApp | [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App) | The Firebase object |

#### Returns

`Promise<`[`firebase.storage`](https://firebase.google.com/docs/reference/js/firebase.storage)`>`
