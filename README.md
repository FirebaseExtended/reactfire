# Reactfire

Hooks, Context Providers, and Components that make it easy
to interact with Firebase.

> If you're looking for docs for the _deprecated_ ReactFire v1 (the one that uses mixins), click [here](https://github.com/FirebaseExtended/reactfire/tree/v1.0.0)

## What is ReactFire?

- **Easy realtime updates for your function components** - Reactfire's hooks, like `useFirestoreCollection` and `useUser`, let you easily subscribe to events, and automatically unsubscribe when your component unmounts.
- **Loading states handled by `<Suspense>`** - Reactfire's hooks throw promises that Suspense can catch. No more `isLoaded ?...` - let React [handle it for you](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-166-shipped-the-one-with-suspense-for-code-splitting).
- **Dead-simple Real User Monitoring (RUM)** - Easily enable Firebase Performance Monitoring's [automatic traces](https://firebase.google.com/docs/perf-mon/automatic-web), and instrument your Suspenseful loads with Reactfire's `<SuspenseWithPerf>` component

Status: Alpha

## Install

```bash
# npm
npm install reactfire
# yarn
yarn add reactfire
```

## Example use

Check out the [live version on StackBlitz](https://stackblitz.com/edit/reactfire-sample)!

```jsx
import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import {
  FirebaseAppProvider,
  useFirestoreDoc,
  useFirebaseApp,
  SuspenseWithPerf
} from 'reactfire';

import 'firebase/performance';
import 'firebase/firestore';

const firebaseConfig = {
  /* add your config object from the Firebase console */
};

function Burrito() {
  // create a ref
  const firebaseApp = useFirebaseApp();
  const burritoRef = firebaseApp
    .firestore()
    .collection('tryreactfire')
    .doc('burrito');

  // subscribe to the doc. just one line!
  // throws a Promise for Suspense to catch,
  // and then streams live updates
  const burritoDoc = useFirestoreDoc(burritoRef);

  // get the value from the doc
  const isYummy = burritoDoc.data().yummy;

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

1. At the project root, run `yarn install`
1. `cd` into the _reactfire_ directory. Run `yarn` and `yarn watch`.
1. In a new terminal, `cd` into the _reactfire/sample-simple_ directory. run `yarn` and `yarn start`.
1. Head over to https://localhost:3000 to see the running sample! If you edit the reactfire source, the sample will reload.

### Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
