# ReactFire

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Hooks, Context Providers, and Components that make it easy to interact with
Firebase.

⚠️ **Status: Experimental**. The API is intended to be stable, but ReactFire is meant for React Concurrent Mode, which is only
available in
[experimental React builds](https://reactjs.org/docs/concurrent-mode-adoption.html#installation).

## What is ReactFire?

- **Easy realtime updates for your function components** - Hooks
  like `useUser`and `useFirestoreCollection` let you easily subscribe to
  auth state, realtime data, and all other Firebase SDK events. Plus, they automatically unsubscribe when your component unmounts.
- **Loading states handled by `<Suspense>`** - ReactFire's hooks throw promises
  that Suspense can catch. No more `isLoaded ?...` - let React
  [handle it for you](https://reactjs.org/docs/concurrent-mode-suspense.html).
- **Faster initial page load times** - Load only the code you need, when you need it, with `useFirestore`, `useAuth`, `useRemoteConfig`, and more.
- **Convenient components for common use cases** - Only want to render a component if a user is signed in? Wrap it in `<AuthCheck />`. Need to automatically instrument your `Suspense` load times with [RUM](https://firebase.google.com/docs/perf-mon)? Use `<SuspenseWithPef />`.

## Install

```bash
# npm
npm install --save reactfire firebase

# yarn
yarn add reactfire firebase
```

Depending on your targeted platforms you may need to install polyfills. The most commonly needed will be [globalThis](https://caniuse.com/#search=globalThis) and [Proxy](https://caniuse.com/#search=Proxy).

- [**Quickstart**](./docs/quickstart.md)
- [**Common Use Cases**](./docs/use.md)
- [**API Reference**](./docs/reference.md)

## Example use

Check out the
[live version on StackBlitz](https://stackblitz.com/fork/reactfire-sample)!

```jsx
import React, { Component } from 'react';
import { createRoot } from 'react-dom';
import { FirebaseAppProvider, useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';

const firebaseConfig = {
  /* Add your config from the Firebase Console */
};

function Burrito() {
  // lazy load the Firestore SDK
  // and create a ref
  const burritoRef = useFirestore()
    .collection('tryreactfire')
    .doc('burrito');

  // subscribe to the doc. just one line!
  // throws a Promise for Suspense to catch,
  // and then streams live updates
  const burrito = useFirestoreDocData(burritoRef);

  return <p>The burrito is {burrito.yummy ? 'good' : 'bad'}!</p>;
}

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <h1>🌯</h1>
      <SuspenseWithPerf fallback={<p>loading burrito status...</p>} traceId={'load-burrito-status'}>
        <Burrito />
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
}

// Enable Concurrent Mode
// https://reactjs.org/docs/concurrent-mode-adoption.html#enabling-concurrent-mode
createRoot(document.getElementById('root')).render(<App />);
```

---

> If you're looking for docs for the _deprecated_ ReactFire v1 (the one that
> uses mixins), click
> [here](https://github.com/FirebaseExtended/reactfire/tree/v1.0.0)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
