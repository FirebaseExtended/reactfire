# Using ReactFire

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

  // any children will be able to use `useUser`, `useDatabaseObjectData`, etc
  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <MyCoolAppThatUsesAuthAndRealtimeDatabase />
      </DatabaseProvider>
    </AuthProvider>
  );
}
```

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

The `useSigninCheck` hook makes it easy to decide whether to hide or show UI elements based on a user's auth state, and can even check their [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims). It will render its children if a user is signed in, but if they are not signed in, it renders its `fallback` prop:

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

## Firestore

The following samples assume that `FirebaseAppProvider` and `FirestoreProvider` components exist higher up the component tree.

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

## Log Page Views to Google Analytics for Firebase with React Router

```jsx
import { useAnalytics } from 'reactfire';
import { Router, Route, Switch } from 'react-router';

function MyPageViewLogger({ location }) {
  const analytics = useAnalytics();

  // By passing `location.pathname` to the second argument of `useEffect`,
  // we only log on first render and when the `pathname` changes
  useEffect(() => {
    analytics.logEvent('page-view', { path_name: location.pathname });
  }, [location.pathname]);

  return null;
}

function App() {
  const analytics = useAnalytics();

  return (
    <Router>
      <Switch>
        <Route exact path="/about" component={<AboutPage />} />
        <Route component={<NotFoundPage />} />
      </Switch>
      <MyPageViewLogger />
    </Router>
  );
}
```

## Advanced: Using RxJS observables to combine multiple data sources

All ReactFire hooks are powered by [`useObservable`](./reference.md#useObservable). By calling `useObservable` directly, you can subscribe to any observable in the same manner as the built-in ReactFire hooks. If you use [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire#rxfire) and `useObservable` together, you can accomplish more advanced read patterns (like [OR queries in Firestore](https://stackoverflow.com/a/53497072/4816918)!).
