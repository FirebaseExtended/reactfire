# ReactFire

Hooks, Context Providers, and Components that make it easy to interact with
Firebase.

## What is ReactFire?

- **Easy realtime updates for your function components** - Hooks
  like `useUser`and `useFirestoreCollection` let you easily subscribe to
  auth state, realtime data, and all other Firebase SDK events. Plus, they automatically unsubscribe when your component unmounts.
- **Access Firebase libraries from any component** - Need the Firestore SDK? `useFirestore`. Remote Config? `useRemoteConfig`.
- **Safely configure Firebase libraries** - Libraries like Firestore and Remote Config require settings like `enablePersistence` to be set before any data fetches are made. This can be tough to support in React's world of re-renders. ReactFire gives you `useInitFirestore` and `useInitRemoteConfig` hooks that guarantee they're set before anything else.

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

### Extra Experimental [concurrent mode](https://reactjs.org/docs/concurrent-mode-suspense.html) features

These features are marked as *extra experimental* because they use experimental React features that [will not be stable until sometime after React 18 is released](https://github.com/reactwg/react-18/discussions/47#:~:text=Likely%20after%20React%2018.0%3A%20Suspense%20for%20Data%20Fetching).

- **Loading states handled by `<Suspense>`** - ReactFire's hooks throw promises
  that Suspense can catch. Let React
  [handle loading states for you](https://reactjs.org/docs/concurrent-mode-suspense.html).
- **Automatically instrument your `Suspense` load times** - Need to automatically instrument your `Suspense` load times with [RUM](https://firebase.google.com/docs/perf-mon)? Use `<SuspenseWithPerf />`.

Enable concurrent mode features by following the [concurrent mode setup guide](https://reactjs.org/docs/concurrent-mode-adoption.html#installation) and then setting the `suspense` prop in `FirebaseAppProvider`:

```jsx
<FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
```

See concurrent mode code samples in [example/withSuspense](https://github.com/FirebaseExtended/reactfire/tree/main/example/withSuspense)
