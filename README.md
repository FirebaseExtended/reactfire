# Reactfire

```shell
npm install reactfire
```

[Hooks](https://reactjs.org/docs/hooks-intro.html), Context Providers, and Components that make it easy
to interact with Firebase.

By default, every `reactfire` hook _throws a Promise_ until it has
connected to Firebase, allowing you to use [Suspense](https://reactjs.org/docs/code-splitting.html#suspense) to render a fallback component. If you don't want `reactfire` to throw a promise, pass an initial value to a `reactfire` hook. It will emit the initial value right away instead of throwing a promise.

- [Quickstart](#Quickstart)
- [Docs](#Docs)
- [Contributing](#Contributing)

## Quickstart

Listen for realtime changes in a Firestore document with Reactfire. We'll use [`create-react-app`](https://facebook.github.io/create-react-app/docs/getting-started) to quickly get a Reactfire demo up and running.

1. Create a fresh React app.

   ```shell
   create-react-app myapp
   ```

1. Install reactfire and the Firebase SDK

   ```shell
   npm i firebase reactfire
   ```

1. Create a world-readable document in Firestore.

   For example, a collection called **_tryreactfire_** with document **_burrito_** with field `yummy: true`.

   To keep this as simple as possible, modify your security rules to make that document world-readable.

1. Modify `src/index.js`

   1. Import firebase and reactfire

      ```js
      //...
      import { FirebaseAppProvider } from 'reactfire';
      import * as firebase from 'firebase/app';
      import 'firebase/performance';
      //...
      ```

   1. Wrap your app in a `FirebaseAppProvider` and provide the config object from the Firebase console

      ```jsx
      //...
      const firebaseConfig = {
        /* add your config object from Firebase console */
      };
      ReactDOM.render(
        <FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
          <App />
        </FirebaseAppProvider>,
        document.getElementById('root')
      );
      //...
      ```

1. Modify `src/App.js`

   1. Import `firebase/firestore` as well as the `useFirestoreDoc` and `useFirebaseApp` hooks

      ```js
      //...
      import 'firebase/firestore';
      import { UseFirestoreDoc } from 'reactfire';
      //...
      ```

   1. Add a function component

      ```jsx
      //...
      function Burrito() {
        // create a ref
        const firebaseApp = useFirebaseApp();
        const burritoRef = firebaseApp
          .firestore()
          .collection('tryreactfire')
          .doc('burrito');

        // get the doc. just one line!
        const burritoDoc = useFirestoreDoc(burritoRef);

        // get the value from the doc
        const isYummy = burritoDoc.data().yummy;

        return <p>The burrito is {isYummy ? 'good' : 'bad'}</p>;
      }
      //...
      ```

   1. Render your component inside of a `Suspense` tag

   We need to do this because `useFirestoreDoc` throws a Promise while it is waiting for a response from Firestore. Suspense will catch the Promise and render `fallback` until the Promise is resolved.

   ```jsx
   //...
   function App() {
     return (
       <div className="App">
         <header className="App-header">{/* ... */}</header>
         <Suspense fallback={'loading burrito status...'}>
           <Burrito />
         </Suspense>
       </div>
     );
   }
   //...
   ```

1. Run your app!

   ```shell
   npm run start
   ```

1. Edit the value of `yummy` in the Firebase console, and watch it update in real time in your app! 🔥🔥🔥

## Docs

### ToC

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

### Providers

#### `FirebaseAppProvider`

A React [Context Provider](https://reactjs.org/docs/context.html#contextprovider) that allows the `useFirebaseApp` hook to pick up the `firebase` object.

##### Sample usage

```jsx
const firebaseConfig = {
  /* web app config from Firebase console */
};

<FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
  <App />
</FirebaseAppProvider>;
```

##### Props

| Prop            | Type   | Description                                                                                                                              |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| config          | Object | the web app config object usually passed to [`initializeApp`](https://firebase.google.com/docs/reference/js/firebase.html#initializeapp) |
| initPerformance | bool   | Whether or not to initialize Firebase Performance Monitoring                                                                             |

### Hooks

#### `useFirebaseApp`

When called from a component nested inside a `FirebaseAppProvider`, `useFirebaseApp` returns the root Firebase object.

> IMPORTANT: By default, `useFirebaseApp` returns a firebase object without any products attached to it (e.g. you can't call `firebase.firestore()`. To do that, you need to `import 'firebase/firestore'` or any other Firebase feature as needed)

##### Returns

[`firebase`](https://firebase.google.com/docs/reference/js/firebase)

#### `useUser`

Get the user that is currently signed in.

_Throws a Promise by default_

##### Parameters

| Parameter   | Type                                                                            | Description                                                                                         |
| ----------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| auth _?_    | [`Auth`](https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html) | [optional] auth object. If not provided, useUser will use `useFirebaseApp` to find the Auth object. |
| options _?_ | ReactFireOptions                                                                | Options. This hook will not throw a Promise if you provide `startWithValue`.                        |

##### Returns

[`User`](https://firebase.google.com/docs/reference/js/firebase.User)

#### `useFirestoreDoc`

Listen to a Firestore Document.

_Throws a Promise by default_

##### Parameters

| Parameter   | Type                                                                                                      | Description                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`DocumentReference`](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference) | A reference to the document you want to listen to                            |
| options _?_ | ReactFireOptions                                                                                          | Options. This hook will not throw a Promise if you provide `startWithValue`. |

##### Returns

[`DocumentSnapshot`](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot)

#### `useFirestoreCollection`

Listen to a Firestore Collection.

_Throws a Promise by default_

##### Parameters

| Parameter   | Type                                                                                                          | Description                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`CollectionReference`](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference) | A reference to the collection you want to listen to                          |
| options _?_ | ReactFireOptions                                                                                              | Options. This hook will not throw a Promise if you provide `startWithValue`. |

##### Returns

[`QuerySnapshot`](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot)

#### `useDatabaseObject`

Listen to a Realtime Database Object.

_Throws a Promise by default_

##### Parameters

| Parameter   | Type                                                                                     | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) | A reference to the object you want to listen to                              |
| options _?_ | ReactFireOptions                                                                         | Options. This hook will not throw a Promise if you provide `startWithValue`. |

##### Returns

[`QueryChange`](https://github.com/firebase/firebase-js-sdk/blob/6b53e0058483c9002d2fe56119f86fc9fb96b56c/packages/rxfire/database/interfaces.ts#L28)

#### `useDatabaseList`

Listen to a Realtime Database list.

_Throws a Promise by default_

##### Parameters

| Parameter   | Type                                                                                     | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) | A reference to the list you want to listen to                                |
| options _?_ | ReactFireOptions                                                                         | Options. This hook will not throw a Promise if you provide `startWithValue`. |

##### Returns

[`QueryChange[]`](https://github.com/firebase/firebase-js-sdk/blob/6b53e0058483c9002d2fe56119f86fc9fb96b56c/packages/rxfire/database/interfaces.ts#L28)

#### `useStorageTask`

Listen to a Storage UploadTask

_Throws a Promise by default_

##### Parameters

| Parameter   | Type                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------- | ----------- |
| task        | [`UploadTask`](https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask) |             |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.storage.Reference)   |             |
| options _?_ | ReactFireOptions                                                                          |             |

##### Returns

[`UploadTaskSnapshot`](https://firebase.google.com/docs/reference/js/firebase.storage.UploadTaskSnapshot)

#### `useStorageDownloadURL`

Subscribe to a storage blob's download URL

_Throws a Promise by default_

#### Parameters

| Parameter   | Type                                                                                    | Description |
| ----------- | --------------------------------------------------------------------------------------- | ----------- |
| ref         | [`Reference`](https://firebase.google.com/docs/reference/js/firebase.storage.Reference) |             |
| options _?_ | ReactFireOptions                                                                        |             |

##### Returns

`string`

### Components

#### `AuthCheck`

Renders `children` if a user is signed in and meets the required claims. Renders `fallback` otherwise.

##### Props

| Property       | Type            |
| -------------- | --------------- |
| auth           | Auth            |
| children       | React.Component |
| fallback       | React.Component |
| requiredClaims | Object          |

#### `SuspenseWithPerf`

Starts a Firebase Performance Monitoring [trace](https://firebase.google.com/docs/reference/js/firebase.performance.Trace) and ends it when suspense stops suspending.

##### Props

| Property     | Type            |
| ------------ | --------------- |
| children     | React.Component |
| fallback     | React.Component |
| firePerf _?_ | any             |
| traceId      | string          |

### ReactFireOptions

| Property       | Type |
| -------------- | ---- |
| startWithValue | any  |

## Contributing

### For development

1. `yarn install`
1. `cd` into the _reactfire/reactfire_ directory. run `yarn run watch`.
1. In a new terminal, `cd` into the _reactfire/sample-simple_ directory. run `yarn start`.
1. Head over to https://localhost:3000 to see the running sample

### Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
