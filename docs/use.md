# Using ReactFire

## Access your `FirebaseApp` instance from a component

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

### Access Firebase product SDKs from a component

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

### Show a list of data

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

## Combine Auth, Firestore, and Cloud Storage to Show a User Profile Card

```jsx
import {
  AuthCheck,
  StorageImage,
  useFirestoreDocData,
  useUser,
  useAuth,
  useFirestore
} from 'reactfire';

const DEFAULT_IMAGE_PATH = 'userPhotos/default.jpg';

function ProfileCard() {
  // get the current user.
  // this is safe because we've wrapped this component in an `AuthCheck` component.
  const { data: user } = useUser();

  // read the user details from Firestore based on the current user's ID
  const userDetailsRef = useFirestore()
    .collection('users')
    .doc(user.uid);

  let { commonName, favoriteAnimal, profileImagePath } = useFirestoreDocData(
    userDetailsRef
  );

  // defend against null field(s)
  profileImagePath = profileImagePath || DEFAULT_IMAGE_PATH;

  if (!commonName || !favoriteAnimal) {
    throw new Error(MissingProfileInfoError);
  }

  return (
    <div>
      <h1>{commonName}</h1>
      {/*
        `StorageImage` converts a Cloud Storage path into a download URL and then renders an image
       */}
      <StorageImage style={{ width: '100%' }} storagePath={profileImagePath} />
      <span>Your favorite animal is the {favoriteAnimal}</span>
    </div>
  );
}

function LogInForm() {
  const auth = useAuth();

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password);
  };

  return <MySignInForm onSubmit={signIn} />;
}

function ProfilePage() {
  return (
    {/*
      Render a spinner until components are ready
    */}
    <Suspense fallback={<MyLoadingSpinner />}>
      {/*
        Render `ProfileCard` only if a user is signed in.
        Otherwise, render `LoginForm`
       */}
      <AuthCheck fallback={<LogInForm />}>{ProfileCard}</AuthCheck>
    </Suspense>
  );
}
```

## Manage Loading States

ReactFire is designed to integrate with React's Suspense API, but also supports use cases where Suspense isn't needed or wanted.

### Default: `Suspense`

Say we have a component called `Burrito` that uses `useFirestoreDoc`:

```jsx
function Burrito() {
  const burritoRef = useFirestore().collection('tryreactfire').doc('burrito');

  // subscribe to the doc. just one line!
  // throws a Promise for Suspense to catch,
  // and then streams live updates
  const burritoDoc = useFirestoreDoc(burritoRef);

  const isYummy = burritoDoc.data().yummy;

  return <p>The burrito is {isYummy ? 'good' : 'bad'}!</p>;
}
```

The parent component of `Burrito` can use `Suspense` to render a `fallback` component until `useFirestoreDoc` returns a value:

```jsx
function FoodRatings() {
  return (
    <Suspense fallback={'loading burrito status...'}>
      <Burrito />
    </Suspense>
  );
}
```

#### Bonus: `SuspenseWithPerf`

ReactFire provides an a wrapper around `Suspense` called `SuspenseWithPerf` that instruments your `Suspense` loads with a Firebase Performance Monitoring custom trace. It looks like this:

```jsx
function FoodRatings() {
  return (
    <SuspenseWithPerf fallback={'loading burrito status...'} traceId={'load-burrito-status'}>
      <Burrito />
    </SuspenseWithPerf>
  );
}
```

### Don't want Suspense? Provide an initial value

What if we don't want to use Suspense, or we're server rendering and we know what the initial value should be? In that case we can provide an initial value to any ReactFire hook:

```jsx
function Burrito() {
  const firebaseApp = useFirebaseApp();
  const burritoRef = firebaseApp.firestore().collection('tryreactfire').doc('burrito');

  // subscribe to the doc. just one line!
  // returns the `initialData`,
  // and then streams live updates
  const burritoDoc = useFirestoreDocData(burritoRef, {
    initialData: {
      yummy: true,
    },
  });

  const isYummy = burritoDoc.data().yummy;

  return <p>The burrito is {isYummy ? 'good' : 'bad'}!</p>;
}
```

The parent component of `Burrito` now doesn't need to use `Suspense`:

```jsx
function FoodRatings() {
  return <Burrito />;
}
```

### Solve `Warning: App triggered a user-blocking update that suspended.` with useTransition

This warning can be solved with React's `useTransition` hook. Check out the sample code's Firestore example to see how to use this with ReactFire:

https://github.com/FirebaseExtended/reactfire/blob/c67dfa755431c15034f0c713b9df3864fb762c06/sample/src/Firestore.js#L87-L121

## Lazy Load the Firebase SDKs

Including the Firebase SDKs in your main JS bundle (by using `import 'firebase/firestore'`, for example) will increase your bundle size. To get around this, you can lazy load the Firebase SDK with ReactFire. As long as a component has a parent that is a `FirebaseAppProvider`, you can use an SDK hook (`useFirestore`, `useDatabase`, `useAuth`, `useStorage`) like so:

`MyComponent.jsx`

```jsx
import React from 'react';
// WE ARE NOT IMPORTING THE FIRESTORE SDK UP HERE
import { useFirestoreDocData, useFirestore } from 'reactfire';

export function MyComponent(props) {
  // automatically lazy loads the Cloud Firestore SDK
  const firestore = useFirestore();

  const ref = firestore().doc('count/counter');
  const data = useFirestoreDocData(ref);

  return <h1>{data.value}</h1>;
}
```

## The _render-as-you-fetch_ pattern

The [React docs](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) recommend kicking off reads as early as possible in order to reduce perceived load times. ReactFire offers a number of `preload` methods to help you do this.

### Preload an SDK

Call `preloadFirestore` (or `preloadAuth`, `preloadRemoteConfig`, etc) to start fetching a Firebase library in the background. Later, when you call `useFirestore` in a component, the `useFirestore` hook may not need to suspend if the preload has already completed.

### Initialize an SDK

Some Firestore SDKs need to be initialized (`firebase.remoteConfig().fetchAndActivate()`), or need to have settings set before any other calls are made (`firebase.firestore().enablePersistence()`). This can be done by passing a function returning a promise to the `setup` option.

```jsx
preloadFirestore({
  setup: (firestore) => firestore().enablePersistence(),
});
```

### Preload Data

ReactFire's data fetching hooks don't fully support preloading yet. The experimental `preloadFirestoreDoc` function allows you to subscribe to a Firestore document if you know you call `useFirestoreDoc` somewhere farther down the component tree.

## Advanced: Using RxJS observables to combine multiple data sources

All ReactFire hooks are powered by [`useObservable`](./reference.md#useObservable). By calling `useObservable` directly, you can subscribe to any observable in the same manner as the built-in ReactFire hooks. If you use [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire#rxfire) and `useObservable` together, you can accomplish more advanced read patterns (like [OR queries in Firestore](https://stackoverflow.com/a/53497072/4816918)!).
