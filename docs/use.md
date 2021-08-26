# Using ReactFire

<!-- toc -->

- [Setup](#setup)
  * [Initialize product SDKs and register them with ReactFire](#initialize-product-sdks-and-register-them-with-reactfire)
  * [Connect to the Firebase Local Emulator Suite](#connect-to-the-firebase-local-emulator-suite)
- [Auth](#auth)
  * [Display the current signed-in user](#display-the-current-signed-in-user)
  * [Only render a component if a user is signed in](#only-render-a-component-if-a-user-is-signed-in)
- [Cloud Firestore](#cloud-firestore)
  * [Access data offline](#access-data-offline)
  * [Show a single document](#show-a-single-document)
  * [Show a list of data (collection)](#show-a-list-of-data-collection)
- [Realtime Database](#realtime-database)
  * [Show an object](#show-an-object)
  * [Show a list of data](#show-a-list-of-data)
- [Cloud Storage for Firebase](#cloud-storage-for-firebase)
  * [Fetch and show an image](#fetch-and-show-an-image)
  * [Show upload status](#show-upload-status)
- [Remote Config](#remote-config)
  * [Initialize, fetch, and activate](#initialize-fetch-and-activate)
  * [Get a string](#get-a-string)
- [Performance Monitoring](#performance-monitoring)
  * [Load Performance Monitoring asynchronously](#load-performance-monitoring-asynchronously)
- [Log Page Views to Google Analytics for Firebase with React Router](#log-page-views-to-google-analytics-for-firebase-with-react-router)
- [Advanced: Using RxJS observables to combine multiple data sources](#advanced-using-rxjs-observables-to-combine-multiple-data-sources)

<!-- tocstop -->

---

## Setup

Since ReactFire uses React's Context API, any child of a `FirebaseAppProvider` can call `useFirebaseApp()` to get your initialized app. Plus, all ReactFire hooks will automatically check context to see if a firebase app is available.

```jsx
// ** INDEX.JS **
const firebaseConfig = {
  /* add your config object from the Firebase console */
};

render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <MyComponent />
  </FirebaseAppProvider>
);

// ** MyComponent.JS **

function MyComponent(props) {
  // useFirestore will get the firebase app from Context!
  const app = useFirebaseApp();
}
```

### Initialize product SDKs and register them with ReactFire

Just as `FirebaseAppProvider` allows child components to access the `FirebaseApp` instance, each Firebase product SDK (like `firebase/auth` or `firebase/database`) has a provider:

```jsx
import { getAuth } from 'firebase/auth'; // Firebase v9+
import { getDatabase } from 'firebase/database'; // Firebase v9+

import { FirebaseAppProvider, DatabaseProvider, AuthProvider, useFirebaseApp } from 'reactfire';

function FirebaseComponents({ children }) {
  const app = useFirebaseApp(); // a parent component contains a `FirebaseAppProvider`

  // initialize Database and Auth with the normal Firebase SDK functions
  const database = getDatabase(app);
  const auth = getAuth(app);

  // any child components will be able to use `useUser`, `useDatabaseObjectData`, etc
  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <MyCoolAppThatUsesAuthAndRealtimeDatabase />
      </DatabaseProvider>
    </AuthProvider>
  );
}
```

Some products benefit from asynchronous initialization. For that, ReactFire has hooks like `useInitFirestore` and `useInitRemoteConfig`. Learn more about these in the individual product sections below.

### Connect to the Firebase Local Emulator Suite

Connect a product SDK to the emulator before passing it to a provider. For example, to connect to the Auth and Realtime Database emulators:

```jsx
import { getAuth, connectAuthEmulator } from 'firebase/auth'; // Firebase v9+
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'; // Firebase v9+

import { FirebaseAppProvider, DatabaseProvider, AuthProvider, useFirebaseApp } from 'reactfire';

function FirebaseComponents({ children }) {
  const app = useFirebaseApp();
  const database = getDatabase(app);
  const auth = getAuth(app);

  // Check for dev/test mode however your app tracks that.
  // `process.env.NODE_ENV` is a common React pattern
  if (process.env.NODE_ENV !== 'production') {
    // Set up emulators
    connectDatabaseEmulator(database, 'localhost', 9000);
    connectAuthEmulator(auth, 'http://localhost:9099');
  }

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <MyCoolAppThatUsesAuthAndRealtimeDatabase />
      </DatabaseProvider>
    </AuthProvider>
  );
}
```

Learn more about the Local Emulator Suite in the [Firebase docs](https://firebase.google.com/docs/emulator-suite/connect_and_prototype).

### Set up App Check

[App Check](https://firebase.google.com/docs/app-check) helps protect your backend resources from abuse, such as billing fraud and phishing.

```jsx
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { useFirebaseApp, AppCheckProvider } from 'reactfire';

// Create your reCAPTCHA v3 site key in the 
// "Project Settings > App Check" section of the Firebase console
const APP_CHECK_TOKEN = 'abcdefghijklmnopqrstuvwxy-1234567890abcd';

function FirebaseComponents({ children }) {
  const app = useFirebaseApp(); // a parent component contains a `FirebaseAppProvider`

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(APP_CHECK_TOKEN),
    isTokenAutoRefreshEnabled: true
  });

  // Activate App Check at the top level before any component talks to an App-Check-compatible Firebase service
  return (
    <AppCheckProvider>
      <DatabaseProvider sdk={database}>
        <MyCoolApp/>
      </DatabaseProvider>
    </AppCheckProvider>
  );
}
```

See the [App Check setup guide in the Firebase docs](https://firebase.google.com/docs/app-check/web/recaptcha-provider#project-setup) for more detailed instructions.

## Auth

The following samples assume that `FirebaseAppProvider` and `AuthProvider` components exist higher up the component tree.

### Display the current signed-in user

The `useUser()` hook returns the currently signed-in [user](https://firebase.google.com/docs/reference/js/v9/auth.user).

```jsx
function HomePage(props) {
  const { status, data: user } = useUser();

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return <h1>Welcome Back, {user.displayName}!</h1>;
}
```

### Only render a component if a user is signed in

The `useSigninCheck` hook makes it easy to decide whether to hide or show UI elements based on a user's auth state:

```jsx
function UserFavorites() {
  const { status, data: signInCheckResult } = useSigninCheck();

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  if (signInCheckResult.signedIn === true) {
    return <FavoritesList />;
  } else {
    return <SignInForm />;
  }
}
```

To check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), pass in a `requiredClaims` object or a `validateCustomClaims` function.

```jsx
// pass in an object describing the custom claims a user must have
const { status, data: signInCheckResult } = useSignInCheck({ requiredClaims: { superUser: true } });

// OR

// pass in a custom claims validator function
const { status, data: signInCheckResult } = useSignInCheck({
  validateCustomClaims: (userClaims) => {
    // custom validation logic...
    return {
      hasRequiredClaims: !!userClaims.superUser,
    };
  },
});
```

## Cloud Firestore

The following samples assume that `FirebaseAppProvider` and `FirestoreProvider` components exist higher up the component tree.

### Access data offline

Cloud Firestore [supports offline data persistence](https://firebase.google.com/docs/firestore/manage-data/enable-offline#web-v9). However, it can be a bit tricky to enable, because you must call `enableIndexedDbPersistence` _before any other Firestore functions_. ReactFire's `useInitFirestore` makes this easy to handle:

```jsx
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { useInitFirestore, FirestoreProvider } from 'reactfire';

function App() {
  const { status, data: firestoreInstance } = useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    await enableIndexedDbPersistence(db);
    return db;
  });

  // firestore init isn't complete yet
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // pass the Firestore instance to FirestoreProvider
  // now we can be sure that any child of FirestoreProvider
  // has a fully initialized Firestore instance with
  // indexedDbPersistence enabled
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <CommentText commentId={commentId} />
      <LikeCount commentId={commentId} />
    </FirestoreProvider>
  );
}
```

### Show a single document

This example subscribes to the `count/counter` document, and re-renders whenever the document updates.

```jsx
function Counter() {
  const firestore = useFirestore();
  const ref = doc(firestore, 'count', 'counter');

  const { status, data: count } = useFirestoreDocData(ref);

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return <span> {count.value} </span>;
}
```

### Show a list of data (collection)

This example queries the `animals` collection, sorts by `commonName`, and re-renders whenever the collection updates.

```jsx
function FavoriteAnimals() {
  // set up query
  const firestore = useFirestore();
  const animalsCollection = collection(firestore, 'animals');
  const animalsQuery = query(animalsCollection, orderBy('commonName', 'asc'));

  // ReactFire!
  const { status, data: animals } = useFirestoreCollectionData(animalsQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <ul>
      {animals.map((animal) => (
        <li key={animal.id}>{animal.commonName}</li>
      ))}
    </ul>
  );
}
```

## Realtime Database

The following samples assume that `FirebaseAppProvider` and `RealtimeDatabaseProvider` components exist higher up the component tree.

### Show an object

```jsx
function Counter() {
  const database = useDatabase();
  const counterRef = ref(database, 'counter');

  const { status, data: count } = useDatabaseObjectData(counterRef);

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return <span> {count} </span>;
}
```

### Show a list of data

```jsx
function AnimalsList() {
  const database = useDatabase();
  const animalsRef = ref(database, 'animals');
  const animalsQuery = query(animalsRef, orderByChild('commonName'));

  const { status, data: animals } = useDatabaseListData(animalsQuery, {
    idField: 'id',
  });

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <ul>
      {animals.map((animal) => (
        <li key={animal.id}>{animal.commonName}</li>
      ))}
    </ul>
  );
}
```

## Cloud Storage for Firebase

The following samples assume that `FirebaseAppProvider` and `StorageProvider` components exist higher up the component tree.

### Fetch and show an image

```jsx
function CatImage() {
  const storage = useStorage();
  const catRef = ref(storage, 'cats/newspaper');

  const { status, data: imageURL } = useStorageDownloadURL(ref(storage, storagePath));

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return <img src={imageURL} alt="cat reading the newspaper" />;
}
```

### Show upload status

```jsx
function UploadProgress({ uploadTask, storageRef }) {
  const { status, data: uploadProgress } = useStorageTask < UploadTaskSnapshot > (uploadTask, storageRef);

  let percentComplete;

  if (status === 'loading') {
    percentComplete = '0%';
  } else {
    const { bytesTransferred, totalBytes } = uploadProgress;
    percentComplete = Math.round(100 * (bytesTransferred / totalBytes)) + '%';
  }

  return <span>{percentComplete} uploaded</span>;
}
```

## Remote Config

The following samples assume that `FirebaseAppProvider` and `RemoteConfigProvider` components exist higher up the component tree.

### Initialize, fetch, and activate

ReactFire's `useInitRemoteConfig` hook makes it easy to set up Remote Config:

```jsx
import { getRemoteConfig, fetchAndActivate } from 'firebase/remote-config';
import { useInitRemoteConfig, RemoteConfigProvider } from 'reactfire';

function App() {
  const { status, data: remoteConfigInstance } = useInitRemoteConfig(async (firebaseApp) => {
    const remoteConfig = getRemoteConfig(firebaseApp);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 10000,
      fetchTimeoutMillis: 10000,
    };

    await fetchAndActivate(remoteConfig);
    return remoteConfig;
  });

  if (status === 'loading') {
    return <span>initializing Remote Config...</span>;
  }

  // Child components of RemoteConfigProvider can be confident that Remote Config is
  // fully initialized
  return (
    <RemoteConfigProvider sdk={remoteConfigInstance}>
      <WelcomeMessage />
    </RemoteConfigProvider>
  );
}
```

### Get a string

```jsx
function WelcomeMessage() {
  const { status, data: messageValue } = useRemoteConfigString('welcome-experiment');

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return <span>{messageValue}</span>;
}
```

## Performance Monitoring

### Load Performance Monitoring asynchronously

You can import the `firebase/performance` library asynchronously to make sure it doesn't affect your page load times:

```jsx
import { useInitPerformance } from 'ReactFire';
function App() {
  useInitPerformance(async (firebaseApp) => {
    const { getPerformance } = await import('firebase/performance');
    return getPerformance(firebaseApp);
  });

  //...
}
```

## Log Page Views to Google Analytics for Firebase with React Router

```jsx
import { AnalyticsProvider, useAnalytics } from 'reactfire';
import { Router, Route, Switch } from 'react-router';
import { getAnalytics, logEvent } from 'firebase/analytics'

function MyPageViewLogger({ location }) {
  const analytics = useAnalytics();

  // By passing `location.pathname` to the second argument of `useEffect`,
  // we only log on first render and when the `pathname` changes
  useEffect(() => {
    logEvent(analytics, 'page_view', { page_location: location.href });
  }, [location.href]);

  return null;
}

function App() {
  const app = useFirebaseApp()

  return (
    <AnalyticsProvider sdk={getAnalytics(app)}>
      <Router>
        <Switch>
          <Route exact path="/about" component={<AboutPage />} />
          <Route component={<NotFoundPage />} />
        </Switch>
        <MyPageViewLogger />
      </Router>
    </AnalyticsProvider>
  );
}
```

## Advanced: Using RxJS observables to combine multiple data sources

All ReactFire hooks are powered by [`useObservable`](./reference.md#useObservable). By calling `useObservable` directly, you can subscribe to any observable in the same manner as the built-in ReactFire hooks. If you use [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire#rxfire) and `useObservable` together, you can accomplish more advanced read patterns (like [OR queries in Firestore](https://stackoverflow.com/a/53497072/4816918)!).
