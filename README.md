# ReactFire

Hooks, Context Providers, and Components that make it easy to interact with
Firebase.

---

> **WARNING**: This branch is for version 3 of ReactFire. [You can find the work-in-progress branch for version 4 here](https://github.com/firebaseextended/reactfire/tree/main), if you want to try the next version of ReactFire.

---

## What is ReactFire?

- **Easy realtime updates for your function components** - Hooks
  like `useUser`and `useFirestoreCollection` let you easily subscribe to
  auth state, realtime data, and all other Firebase SDK events. Plus, they automatically unsubscribe when your component unmounts.
- **Access Firebase libraries from any component** - Need the Firestore SDK? `useFirestore`. Remote Config? `useRemoteConfig`.
- **Built-in Support for prefetching** - Decrease your load times by starting a connection to products like Firestore, Auth, or Realtime Database before the component that consumes that data is rendered with functions like `preloadUser`
- **Safely configure Firebase libraries** - Libraries like Firestore and Remote Config require setting like `enablePersistence` to be set before any data fetches are made. This can be tough to support in React's world of re-renders. ReactFire gives you a trusted way to set these settings so you're sure they're set before anything else.

### Experimental [concurrent mode](https://reactjs.org/docs/concurrent-mode-suspense.html) features

- **Loading states handled by `<Suspense>`** - ReactFire's hooks throw promises
  that Suspense can catch. No more `isLoaded ?...` - let React
  [handle it for you](https://reactjs.org/docs/concurrent-mode-suspense.html).
- **Faster initial page load times** - Load only the code you need, when you need it, with `useFirestore`, `useAuth`, `useRemoteConfig`, and more.
- **Convenient components for common use cases** - Only want to render a component if a user is signed in? Wrap it in `<AuthCheck />`. Need to automatically instrument your `Suspense` load times with [RUM](https://firebase.google.com/docs/perf-mon)? Use `<SuspenseWithPerf />`.

## Install

```bash
# npm
npm install --save reactfire firebase

# or

# yarn
yarn add reactfire firebase
```

Depending on your targeted platforms you may need to install polyfills. The most commonly needed will be [globalThis](https://caniuse.com/#search=globalThis) and [Proxy](https://caniuse.com/#search=Proxy).

## Docs

- [**Quickstart**](./docs/quickstart.md)
  - Advanced: If you're using Concurrent Mode, check out the [Concurrent Mode quickstart](./docs/quickstart-concurrent-mode.md)
- [**Common Use Cases**](./docs/use.md)
- [**API Reference**](./docs/reference)

## Example use

Check out the
[live version on StackBlitz](https://stackblitz.com/fork/reactfire-sample)!

```jsx
import React, { Component } from 'react';
import { render } from 'react-dom';

import 'firebase/firestore';
import { FirebaseAppProvider, useFirestoreDocData, useFirestore } from 'reactfire';

const firebaseConfig = {
  /* Add your config from the Firebase Console */
};

function Burrito() {
  // easily access the Firestore library
  const burritoRef = useFirestore()
    .collection('tryreactfire')
    .doc('burrito');

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(burritoRef);

  // easily check the loading status
  if (status === 'loading') {
    return <p>Fetching burrito flavor...</p>;
  }

  return <p>The burrito is {data.yummy ? 'good' : 'bad'}!</p>;
}

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <h1>🌯</h1>
      <Burrito />
    </FirebaseAppProvider>
  );
}

render(<App />, document.getElementById('root'));
```

---

> If you're looking for docs for the _deprecated_ ReactFire v1 (the one that
> uses mixins), click
> [here](https://github.com/FirebaseExtended/reactfire/tree/v1.0.0)

## Status

![Status: Experimental](https://img.shields.io/badge/Status-Experimental-blue)

This repository is maintained by Googlers but is not a supported Firebase product. Issues here are answered by maintainers and other community members on GitHub on a best-effort basis.
