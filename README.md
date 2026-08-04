# ReactFire

Hooks, Context Providers, and Components that make it easy to interact with
Firebase.

## What is ReactFire?

- **Easy realtime updates for your function components** - Hooks
  like `useUser`and `useFirestoreCollection` let you easily subscribe to
  auth state, realtime data, and all other Firebase SDK events. Plus, they automatically unsubscribe when your component unmounts.
- **Access Firebase libraries from any component** - Need the Firestore SDK? `useFirestore`. Remote Config? `useRemoteConfig`.
- **Safely configure Firebase libraries** - Libraries like Firestore and Remote Config require settings like `enablePersistence` to be set before any data fetches are made. This can be tough to support in React's world of re-renders. ReactFire gives you `useInitFirestore` and `useInitRemoteConfig` hooks that guarantee they're set before anything else.
- **Optional `<Suspense>` support** - Hand loading states to React instead of checking a status yourself. Off by default, opt in with the `suspense` prop. See [Suspense](#suspense) below.

## Platform support

ReactFire is designed for **web React apps** and wraps the [Firebase Web SDK](https://firebase.google.com/docs/web/setup). It is not compatible with React Native or Expo. For React Native projects, use [react-native-firebase](https://rnfirebase.io/) instead.

## Install

```bash
# npm
npm install --save firebase reactfire

# or

# yarn
yarn add firebase reactfire
```

Depending on your targeted platforms you may need to install polyfills. The most commonly needed will be [globalThis](https://caniuse.com/#search=globalThis) and [Proxy](https://caniuse.com/#search=Proxy).

## Docs

- [**Quickstart**](./docs/quickstart.md)
- [**Common Use Cases**](./docs/use.md)
- [**API Reference**](./docs/reference)
- [**v3 -> v4 Upgrade Guide**](./docs/upgrade-guide.md)

## Example use

Check out the
[live version on StackBlitz](https://stackblitz.com/fork/reactfire-v4-sample)!

```jsx
import React from 'react';
import { render } from 'react-dom';

import { doc, getFirestore } from 'firebase/firestore';
import { FirebaseAppProvider, FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';

const firebaseConfig = {
  /* Add in your config object from the Firebase console */
};

function BurritoTaste() {
  // access the Firestore library
  const burritoRef = doc(useFirestore(), 'tryreactfire', 'burrito');

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(burritoRef);

  // check the loading status
  if (status === 'loading') {
    return <p>Fetching burrito flavor...</p>;
  }

  return <p>The burrito is {data.yummy ? 'good' : 'bad'}!</p>;
}

function App() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <h1>🌯</h1>
      <BurritoTaste />
    </FirestoreProvider>
  );
}

render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>,
  document.getElementById('root')
);
```

---

## Status

![Status: Experimental](https://img.shields.io/badge/Status-Experimental-blue)

This repository is maintained by Googlers but is not a supported Firebase product. Issues here are answered by maintainers and other community members on GitHub on a best-effort basis.

## Suspense

ReactFire's hooks can throw promises for [`<Suspense>`](https://react.dev/reference/react/Suspense) to catch, so React handles loading states for you instead of you checking `status` on each result.

This is **off by default**. Opt in with the `suspense` prop on `FirebaseAppProvider`:

```jsx
<FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
```

`<SuspenseWithPerf />` does the same and also instruments load times with [Performance Monitoring](https://firebase.google.com/docs/perf-mon).

See [example/withSuspense](https://github.com/FirebaseExtended/reactfire/tree/main/example/withSuspense) for full samples.
