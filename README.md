# ReactFire

[Hooks](https://reactjs.org/docs/hooks-intro.html) that make it easy to interact with Firestore, Realtime Database, Authentication, and Storage. Note, every `reactfire` hook _throws a Promise_ until it has connected to Firebase. Wrap your components in React's [Suspense](https://reactjs.org/docs/code-splitting.html#suspense), or, if you don't want to deal with Suspense, pass an [initial value](/reactfire/index.ts#L10) to a `reactfire` hook. [Example](/sample-simple/src/Auth.js#L50).

## Usage

### Authentication

```ts
useUser(auth: auth.Auth, options?: ReactFireOptions): User
```

### Firestore

```ts
function useFirestoreDoc(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions
): firestore.DocumentSnapshot;
```

```ts
function useFirestoreCollection(
  ref: firestore.CollectionReference,
  options?: ReactFireOptions
): firestore.QuerySnapshot;
```

### Realtime Database

```ts
function useDatabaseObject(
  ref: database.Reference,
  options?: ReactFireOptions
): QueryChange;
```

```ts
function useDatabaseList(
  ref: database.Reference | database.Query,
  options?: ReactFireOptions
): QueryChange[];
```

### Cloud Storage for Firebase

```ts
function useStorageTask(
  task: storage.UploadTask,
  ref: storage.Reference,
  options?: ReactFireOptions
): storage.UploadTaskSnapshot;
```

```ts
function useStorageDownloadURL(
  ref: storage.Reference,
  options?: ReactFireOptions
): string;
```

## For development

1. `yarn install`
1. `cd` into the _reactfire/reactfire_ directory. run `yarn run watch`.
1. In a new terminal, `cd` into the _reactfire/sample-simple_ directory. run `yarn start`.
1. Head over to https://localhost:3000 to see the running sample

## Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
