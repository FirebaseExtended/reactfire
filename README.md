# Reactfire


[Hooks](https://reactjs.org/docs/hooks-intro.html) that make it easy 
to interact with Firestore, Realtime Database, Authentication, and 
Storage. Note, every `reactfire` hook _throws a Promise_ until it has 
connected to Firebase. Wrap your components in React's 
[Suspense](https://reactjs.org/docs/code-splitting.html#suspense), 
or, if you don't want to deal with Suspense, pass an 
[initial value](/reactfire/index.ts#L10) to a `reactfire` hook. 
[Example](/sample-simple/src/Auth.js#L50).


## Interfaces

### AuthCheckProps

|Property|Type|
|---|---|
|auth|Auth|
|children|React.Component|
|fallback|React.Component|
|requiredClaims|Object|

### SuspensePerfProps

|Property|Type|
|---|---|
|children|React.Component|
|fallback|React.Component|
|firePerf|any|
|traceId|string|

### ReactFireOptions

|Property|Type|
|---|---|
|startWithValue|any|

## Components

### `AuthCheck`



#### Props

interface `AuthCheckProps`

#### Returns

React.FunctionComponent

### `SuspenseWithPerf`



#### Props

interface `SuspensePerfProps`

#### Returns

React.FunctionComponent

## Hooks

### `useDatabaseList`

Subscribe to a Realtime Database list

#### Parameters

|Parameter|Type|
|---|---|
|ref|Reference or Query|
|options *?*|ReactFireOptions|

#### Returns

QueryChange[]

### `useDatabaseObject`

Subscribe to a Realtime Database object

#### Parameters

|Parameter|Type|
|---|---|
|ref|Reference|
|options *?*|ReactFireOptions|

#### Returns

QueryChange

### `useFirestoreCollection`

Subscribe to a Firestore collection

#### Parameters

|Parameter|Type|
|---|---|
|ref|CollectionReference|
|options *?*|ReactFireOptions|

#### Returns

QuerySnapshot

### `useFirestoreDoc`

Suscribe to Firestore Document changes

#### Parameters

|Parameter|Type|
|---|---|
|ref|DocumentReference|
|options *?*|ReactFireOptions|

#### Returns

DocumentSnapshot

### `useStorageDownloadURL`

Subscribe to a storage ref's download URL

#### Parameters

|Parameter|Type|
|---|---|
|ref|Reference|
|options *?*|ReactFireOptions|

#### Returns

string

### `useStorageTask`

Subscribe to the progress of a storage task

#### Parameters

|Parameter|Type|
|---|---|
|task|UploadTask|
|ref|Reference|
|options *?*|ReactFireOptions|

#### Returns

UploadTaskSnapshot

### `useUser`

Subscribe to Firebase auth state changes, including token refresh

#### Parameters

|Parameter|Type|
|---|---|
|auth|Auth|
|options *?*|ReactFireOptions|

#### Returns

User

### `useObservable`



#### Parameters

|Parameter|Type|
|---|---|
|observable$|Observable|
|observableId|string|
|startWithValue *?*|any|

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
