# Common Patterns

- [Access your `firebase` object from any component](#access-your-firebase-object-from-any-component)
- [Manage Loading States](#manage-loading-states)
  - [Default: `Suspense`](#default-suspense)
    - [Bonus: `SuspenseWithPerf`](#bonus-suspensewithperf)
  - [Provide an initial value](#provide-an-initial-value)
- [Access the current user](#access-the-current-user)
  - [Decide what to render based on a user's auth state](#decide-what-to-render-based-on-a-users-auth-state)
- [Lazy Load the Firebase SDKs](#lazy-load-the-Firebase-SDKs)
- [Preloading](#preloading)
  - [Preload an SDK](#preload-an-sdk)
  - [Preload Data](#preload-data)

## Access your `firebase` object from any component

Since reactfire uses React's Context API, any component under a `FirebaseAppProvider` can use `useFirebaseApp()` to get your initialized app.

```jsx
// ** INDEX.JS **
const firebaseConfig = {
  /* add your config object from the Firebase console */
};

render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <MyApp />
  </FirebaseAppProvider>
);

// ** MYCOMPONENT.JS **

function MyComponent(props) {
  const firestore = useFirestore();
  const documentReference = firestore()
    .collection('burritos')
    .doc('vegetarian');

  // ...
}
```

## Manage Loading States

Reactfire is designed to integrate with React's Suspense API, but also supports use cases where Suspense isn't needed or wanted.

### Default: `Suspense`

Say we have a component called `Burrito` that uses `useFirestoreDoc`:

```jsx
function Burrito() {
  const firebaseApp = useFirestore();
  const burritoRef = firestore()
    .collection('tryreactfire')
    .doc('burrito');

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

Reactfire provides an a wrapper around `Suspense` called `SuspenseWithPerf` that instruments your `Suspense` loads with a Firebase Performance Monitoring custom trace. It looks like this:

```jsx
function FoodRatings() {
  return (
    <SuspenseWithPerf
      fallback={'loading burrito status...'}
      traceId={'load-burrito-status'}
    >
      <Burrito />
    </SuspenseWithPerf>
  );
}
```

### Provide an initial value

What if we don't want to use Suspense, or we're server rendering and we know what the initial value should be? In that case we can provide an initial value to any Reactfire hook:

```jsx
function Burrito() {
  const firebaseApp = useFirebaseApp();
  const burritoRef = firebaseApp
    .firestore()
    .collection('tryreactfire')
    .doc('burrito');

  // subscribe to the doc. just one line!
  // returns the `startWithValue`,
  // and then streams live updates
  const burritoDoc = useFirestoreDocData(burritoRef, {
    startWithValue: {
      yummy: true
    }
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

## Access the current user

The `useUser()` hook returns the currently signed-in [user](https://firebase.google.com/docs/reference/js/firebase.User). Like the other Reactfire Hooks, you need to wrap it in `Suspense` or provide a `startWithValue`.

```jsx
function HomePage(props) {
  // no need to use useFirebaseApp - useUser calls it under the hood
  const user = useUser();

  return <h1>Welcome Back {user.displayName}!</h1>;
}
```

Note: `useUser` will also automatically lazily import the `firebase/auth` SDK if it has not been imported already.

### Decide what to render based on a user's auth state

The `AuthCheck` component makes it easy to hide/show UI elements based on a user's auth state. It will render its children if a user is signed in, but if they are not signed in, it renders its `fallback` prop:

```jsx
render(
  <AuthCheck fallback={<LoginPage />}>
    <HomePage />
  </AuthCheck>
);
```

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

## Preloading

The [render-as-you-fetch pattern](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) encourages kicking off requests as early as possible instead of waiting until a component renders. ReactFire supports this behavior

### Preload an SDK

Just as the SDK hooks like `useFirestore` can automatically fetch an SDK, you can call `preloadFirestore` (or `preloadAuth`, etc) to start loading an SDK without suspending.

### Preload Data

Many ReactFire hooks have corresponding preload functions. For example, you can call `preloadFirestoreDocData` to preload data if a component later calls `useFirestoreDocData`.
