# ReactFire

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

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
npm install --save reactfire@exp firebase@exp

# or

# yarn
yarn add reactfire@exp firebase@exp
```

Depending on your targeted platforms you may need to install polyfills. The most commonly needed will be [globalThis](https://caniuse.com/#search=globalThis) and [Proxy](https://caniuse.com/#search=Proxy).

## Docs

- [**Quickstart**](./docs/quickstart.md)
  - Advanced: If you're using Concurrent Mode, check out the [Concurrent Mode quickstart](./docs/quickstart-concurrent-mode.md)
- [**Common Use Cases**](./docs/use.md)
- [**API Reference**](./docs/reference)

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

> If you're looking for docs for the _deprecated_ ReactFire v1 (the one that
> uses mixins), click
> [here](https://github.com/FirebaseExtended/reactfire/tree/v1.0.0)

## Status

![Status: Experimental](https://img.shields.io/badge/Status-Experimental-blue)

This repository is maintained by Googlers but is not a supported Firebase product. Issues here are answered by maintainers and other community members on GitHub on a best-effort basis.

### Extra Experimental [concurrent mode](https://reactjs.org/docs/concurrent-mode-suspense.html) features

- **Loading states handled by `<Suspense>`** - ReactFire's hooks throw promises
  that Suspense can catch. No more `isLoaded ?...` - let React
  [handle it for you](https://reactjs.org/docs/concurrent-mode-suspense.html).
- **Automatically instrument your `Suspense` load times** - Need to automatically instrument your `Suspense` load times with [RUM](https://firebase.google.com/docs/perf-mon)? Use `<SuspenseWithPerf />`.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.dfweb.no"><img src="https://avatars1.githubusercontent.com/u/45217974?v=4" width="100px;" alt=""/><br /><sub><b>w3bdesign</b></sub></a><br /><a href="https://github.com/FirebaseExtended/reactfire/commits?author=w3bdesign" title="Code">💻</a></td>
    <td align="center"><a href="http://prue.io"><img src="https://avatars0.githubusercontent.com/u/2992224?v=4" width="100px;" alt=""/><br /><sub><b>Scott Prue</b></sub></a><br /><a href="https://github.com/FirebaseExtended/reactfire/commits?author=prescottprue" title="Code">💻</a></td>
    <td align="center"><a href="http://git.io/jhuleatt"><img src="https://avatars0.githubusercontent.com/u/3759507?v=4" width="100px;" alt=""/><br /><sub><b>Jeff</b></sub></a><br /><a href="https://github.com/FirebaseExtended/reactfire/commits?author=jhuleatt" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
