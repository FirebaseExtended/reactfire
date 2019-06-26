# Reactfire

```shell
npm install reactfire
```

[Hooks](https://reactjs.org/docs/hooks-intro.html), Context Providers, and Components that make it easy
to interact with Firebase.

By default, every `reactfire` hook _throws a Promise_ until it has
connected to Firebase, allowing you to use [Suspense](https://reactjs.org/docs/code-splitting.html#suspense) to render a fallback component. If you don't want `reactfire` to throw a promise, pass an initial value to a `reactfire` hook. It will emit the initial value right away instead of throwing a promise.

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
      //...
      ```

   1. Wrap your app in a `FirebaseAppProvider` and provide the config object from the Firebase console

      ```jsx
      //...
      const firebaseConfig = {
        /* add your config object from Firebase console */
      };
      ReactDOM.render(
        <FirebaseAppProvider config={firebaseConfig}>
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

### Hooks

#### `useFirebaseApp`

#### `useUser`

#### `useFirestoreDoc`

#### `useFirestoreCollection`

#### `useDatabaseObject`

#### `useDatabaseList`

#### `useStorageTask`

#### `useStorageDownloadURL`

### Components

#### `SuspenseWithPerf`

#### `AuthCheck`

#### AuthCheckProps

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
