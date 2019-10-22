# Reference Docs

## Table of Contents

- [Providers](#Providers)
  - [`FirebaseAppProvider`](#FirebaseAppProvider)
- [Hooks](#Hooks)
  - [`useFirebaseApp`](#useFirebaseApp)
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
- [Components](#Components)
  - Performance Monitoring
    - [`SuspenseWithPerf`](#SuspenseWithPerf)
  - Authentication
    - [`AuthCheck`](#AuthCheck)
- [ReactFireOptions](#ReactFireOptions)

## Providers

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

## Hooks

### `useFirebaseApp`

When called from a component nested inside a `FirebaseAppProvider`, `useFirebaseApp` returns the root Firebase object.

> IMPORTANT: By default, `useFirebaseApp` returns a firebase object without any products attached to it (e.g. you can't call `firebase.firestore()`. To do that, you need to `import 'firebase/firestore'` or any other Firebase feature as needed)

#### Returns

[`firebase`](https://firebase.google.com/docs/reference/js/firebase)

### `useUser`

Get the user that is currently signed in.

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

## Components

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

## ReactFireOptions

| Property       | Type |
| -------------- | ---- |
| startWithValue | any  |
