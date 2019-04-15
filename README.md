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

### ReactFireOptions

|Property|Type|
|---|---|
|startWithValue|any|

## Hooks

### `useDatabaseList`

#### Parameters
|Parameter|Type|
|---|---|
|ref|Reference or Query|
|options *?*|ReactFireOptions|

#### Returns

QueryChange[]

### `useDatabaseObject`

#### Parameters
|Parameter|Type|
|---|---|
|ref|Reference|
|options *?*|ReactFireOptions|

#### Returns

QueryChange

### `useFirestoreCollection`

#### Parameters
|Parameter|Type|
|---|---|
|ref|CollectionReference|
|options *?*|ReactFireOptions|

#### Returns

QuerySnapshot

### `useFirestoreDoc`

#### Parameters
|Parameter|Type|
|---|---|
|ref|DocumentReference|
|options *?*|ReactFireOptions|

#### Returns

DocumentSnapshot

### `useStorageDownloadURL`

#### Parameters
|Parameter|Type|
|---|---|
|ref|Reference|
|options *?*|ReactFireOptions|

#### Returns

string

### `useStorageTask`

#### Parameters
|Parameter|Type|
|---|---|
|task|UploadTask|
|ref|Reference|
|options *?*|ReactFireOptions|

#### Returns

UploadTaskSnapshot

### `useUser`

#### Parameters
|Parameter|Type|
|---|---|
|auth|Auth|
|options *?*|ReactFireOptions|

#### Returns

User


## For development

1. `yarn install`
1. `cd` into the _reactfire/reactfire_ directory. run `yarn run watch`.
1. In a new terminal, `cd` into the _reactfire/sample-simple_ directory. run `yarn start`.
1. Head over to https://localhost:3000 to see the running sample

## Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
