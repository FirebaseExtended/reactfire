# Reactfire

Hooks, Context Providers, and Components that make it easy to interact with
Firebase.

> If you're looking for docs for the _deprecated_ ReactFire v1 (the one that
> uses mixins), click
> [here](https://github.com/FirebaseExtended/reactfire/tree/v1.0.0)

**Status: Alpha**. ReactFire is meant for React Concurrent Mode, which is only
available in
[experimental React builds](https://reactjs.org/docs/concurrent-mode-adoption.html#installation).

## What is ReactFire?

- **Easy realtime updates for your function components** - Reactfire's hooks,
  like `useFirestoreCollection` and `useUser`, let you easily subscribe to
  events, and automatically unsubscribe when your component unmounts.
- **Loading states handled by `<Suspense>`** - Reactfire's hooks throw promises
  that Suspense can catch. No more `isLoaded ?...` - let React
  [handle it for you](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-166-shipped-the-one-with-suspense-for-code-splitting).
- **Dead-simple Real User Monitoring (RUM)** - Easily enable Firebase
  Performance Monitoring's
  [automatic traces](https://firebase.google.com/docs/perf-mon/automatic-web),
  and instrument your Suspenseful loads with Reactfire's `<SuspenseWithPerf>`
  component

## Install

```bash
# npm
npm install reactfire@next
# yarn
yarn add reactfire@next
```

If you like living life on the edge, use `reactfire@canary`.

## Example use

Check out the
[live version on StackBlitz](https://stackblitz.com/edit/reactfire-sample)!

```jsx
import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import {
  FirebaseAppProvider,
  useFirestoreDocData,
  SuspenseWithPerf
} from 'reactfire';

import 'firebase/performance';

const firebaseConfig = {
  /* add your config object from the Firebase console */
};

function Burrito() {
  // lazy load the Firestore SDK and create a ref
  const burritoRef = useFirestore()
    .collection('tryreactfire')
    .doc('burrito');

  // subscribe to the doc. just one line!
  // throws a Promise for Suspense to catch,
  // and then streams live updates
  const burrito = useFirestoreDocData(burritoRef);

  // get the value from the doc
  const isYummy = burrito.yummy;

  return <p>The burrito is {isYummy ? 'good' : 'bad'}!</p>;
}

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
      <h1>🌯</h1>
      <SuspenseWithPerf
        fallback={'loading burrito status...'}
        traceId={'load-burrito-status'}
      >
        <Burrito />
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
}

render(<App />, document.getElementById('root'));
```

## Learn More

- [**Quickstart**](./docs/quickstart.md)
- [**Common Use Cases**](./docs/use.md)
- [**API Reference**](./docs/reference.md)

## Contributing

### For development

1. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
   this repository (or a
   [fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#propose-changes-to-someone-elses-project))
1. At the project root, install all modules by running `yarn install`.
1. `cd` into the _reactfire_ directory. Run `yarn` and `yarn watch`.
1. In a new terminal, `cd` into the _reactfire/sample_ directory. run `yarn` and
   `yarn start`.
1. Head over to https://localhost:3000 to see the running sample! If you edit
   the reactfire source, the sample will reload.

### Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
