# Reactfire

[Hooks](https://reactjs.org/docs/hooks-intro.html), Context Providers, and Components that make it easy
to interact with Firebase.

By default, every `reactfire` hook _throws a Promise_ until it has
connected to Firebase, allowing you to use [Suspense](https://reactjs.org/docs/code-splitting.html#suspense) to render a fallback component. If you don't want `reactfire` to throw a promise, pass an initial value to a `reactfire` hook. It will emit the initial value right away instead of throwing a promise.

## ToC

- Providers
  - [`FirebaseAppProvider`](#FirebaseAppProvider)
- Hooks
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
- Components
  - [Performance Monitoring](#perf-components)
    - [`SuspenseWithPerf`](#SuspenseWithPerf)
  - [Authentication](#Authentication-components)
    - [`AuthCheck`](#AuthCheck)

## Providers

### `FirebaseAppProvider`

## Hooks

### `useFirebaseApp`

### `useUser`

### `useFirestoreDoc`

### `useFirestoreCollection`

### `useDatabaseObject`

### `useDatabaseList`

### `useStorageTask`

### `useStorageDownloadURL`

## Components

### `SuspenseWithPerf`

### `AuthCheck`

### AuthCheckProps

| Property       | Type            |
| -------------- | --------------- |
| auth           | Auth            |
| children       | React.Component |
| fallback       | React.Component |
| requiredClaims | Object          |

### SuspensePerfProps

| Property | Type            |
| -------- | --------------- |
| children | React.Component |
| fallback | React.Component |
| firePerf | any             |
| traceId  | string          |

### ReactFireOptions

| Property       | Type |
| -------------- | ---- |
| startWithValue | any  |

## Components

### `AuthCheck`

#### Props

interface [`AuthCheckProps`](#authcheckprops)

#### Returns

React.FunctionComponent

### `SuspenseWithPerf`

#### Props

interface [`SuspensePerfProps`](#suspenseperfprops)

#### Returns

React.FunctionComponent

## Hooks

### `useDatabaseList`

Subscribe to a Realtime Database list

#### Parameters

| Parameter   | Type               |
| ----------- | ------------------ |
| ref         | Reference or Query |
| options _?_ | ReactFireOptions   |

#### Returns

QueryChange[]

### `useDatabaseObject`

Subscribe to a Realtime Database object

#### Parameters

| Parameter   | Type             |
| ----------- | ---------------- |
| ref         | Reference        |
| options _?_ | ReactFireOptions |

#### Returns

QueryChange

### `useFirestoreCollection`

Subscribe to a Firestore collection

#### Parameters

| Parameter   | Type                |
| ----------- | ------------------- |
| ref         | CollectionReference |
| options _?_ | ReactFireOptions    |

#### Returns

QuerySnapshot

### `useFirestoreDoc`

Suscribe to Firestore Document changes

#### Parameters

| Parameter   | Type              |
| ----------- | ----------------- |
| ref         | DocumentReference |
| options _?_ | ReactFireOptions  |

#### Returns

DocumentSnapshot

### `useStorageDownloadURL`

Subscribe to a storage ref's download URL

#### Parameters

| Parameter   | Type             |
| ----------- | ---------------- |
| ref         | Reference        |
| options _?_ | ReactFireOptions |

#### Returns

string

### `useStorageTask`

Subscribe to the progress of a storage task

#### Parameters

| Parameter   | Type             |
| ----------- | ---------------- |
| task        | UploadTask       |
| ref         | Reference        |
| options _?_ | ReactFireOptions |

#### Returns

UploadTaskSnapshot

### `useUser`

Subscribe to Firebase auth state changes, including token refresh

#### Parameters

| Parameter   | Type             |
| ----------- | ---------------- |
| auth        | Auth             |
| options _?_ | ReactFireOptions |

#### Returns

User

### `useObservable`

#### Parameters

| Parameter          | Type       |
| ------------------ | ---------- |
| observable\$       | Observable |
| observableId       | string     |
| startWithValue _?_ | any        |

#### Returns

any

## For development

1. `yarn install`
1. `cd` into the _reactfire/reactfire_ directory. run `yarn run watch`.
1. In a new terminal, `cd` into the _reactfire/sample-simple_ directory. run `yarn start`.
1. Head over to https://localhost:3000 to see the running sample

## Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
