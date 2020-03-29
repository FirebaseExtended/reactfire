# Getting Started with ReactFire

⚛ + 🔥 = 🌯

This quickstart shows you how to connect your React web app to **Cloud Firestore**, listen for its data, and display the data in _real time_. We'll also configure **Firebase Performance Monitoring** so you can get some performance stats.

Let's build a web app that displays, in _real time_, the tastiness of a burrito. Yum!

To see the completed app, check out [this StackBlitz workspace](https://stackblitz.com/fork/reactfire-sample).

## 1. Create a document in Cloud Firestore
> If your project doesn't have a Cloud Firestore database instance yet, check out [these instructions](https://firebase.google.com/docs/firestore/quickstart#create) to create a new instance.  Please initialize it in _locked mode_.

1. Go to the _Database_ tab in the [Firebase console](https://console.firebase.google.com).
 
1. Add a document.

   1. In the _Data_ tab of the console, click _Add Collection_

   1. Name the collection **_tryreactfire_**
   1. Add a document with ID **_burrito_** and boolean field `yummy: true`

   ![new document screenshot](https://firebasestorage.googleapis.com/v0/b/rxfire-525a3.appspot.com/o/docs%2FScreen%20Shot%202019-07-03%20at%202.19.11%20PM.png?alt=media&token=052d27ea-5db1-4a02-aad0-a3f017c1a975)

1. Add security rules to your document.

    1. In the _Rules_ tab of the console, add the following security rules:
   
   ```text
   match /tryreactfire/burrito {
     allow read: if true;
     allow write: if request.auth.uid != null;
   }
   ```
    2. _Publish_ the rules.


## 2. In a terminal, create a fresh React app and `cd` into its directory

> Prerequisite: make sure you have [Node.js](https://nodejs.org/en/) installed.

```shell
npx create-react-app myapp
cd myapp
```

## 3. Install ReactFire and the Firebase SDK

```bash
yarn add firebase reactfire

# or

npm install --save firebase reactfire
```



## 4. Modify `src/index.js`

1. Import Firebase and ReactFire

   ```js
   //...
   import { FirebaseAppProvider } from 'reactfire';
   //...
   ```

1. Wrap your app in a `FirebaseAppProvider` and provide the config object from the Firebase console

   ```jsx
   //...
   const firebaseConfig = {
     /* add your config object from Firebase console */
   };
   ReactDOM.createRoot(document.getElementById('root')).render(
     <FirebaseAppProvider firebaseConfig={firebaseConfig}>
       <App />
     </FirebaseAppProvider>
   );
   //...
   ```

## 5. Modify `src/App.js`

1. Import the `useFirestoreDocData` and `useFirestore` hooks

   ```js
   //...
   import { useFirestoreDocData, useFirestore } from 'reactfire';
   //...
   ```

1. Add a function component

   ```jsx
   //...
   function Burrito() {
     // lazy load the Firestore SDK and create a document reference
     const burritoRef = useFirestore()
       .collection('tryreactfire')
       .doc('burrito');

     // subscribe to the doc. just one line!
     const burrito = useFirestoreDocData(burritoRef);

     // get the value from the doc
     const isYummy = burrito.yummy;

     return <p>The burrito is {isYummy ? 'good' : 'bad'}</p>;
   }
   //...
   ```

1. Render your component inside of a `Suspense` tag

> We need to do this because `useFirestoreDocData` throws a Promise while it is waiting for a response from Firestore. Suspense will catch the Promise and render `fallback` until the Promise is resolved.

Replace the `App` function with the following:

```jsx
//...
function App() {
  return (
    <div className="App">
      {/*
        SuspenseWithPerf behaves the same as Suspense,
        but also automatically measures load times with the User Timing API
        and reports it to Firebase Performance Monitoring
      */}
      <SuspenseWithPerf
        fallback={'loading burrito status...'}
        traceId={'load-burrito-status'}
      >
        <Burrito />
      </SuspenseWithPerf>
    </div>
  );
}
//...
```

## 6. Run your app!

```bash
yarn start

# or

npm run start
```

1. Edit the value of `yummy` in the Firebase console, and watch it update in real time in your app! 🔥🔥🔥

## _About Firebase Performance Monitoring_

`SuspenseWithPerf` will lazy load the Firebase Performance Monitoring library and report on on our custom trace, `load-burrito-status`, that we set in the `traceId` prop of `SuspenseWithPerf`. In addition, it will automatically measure [common performance stats](https://firebase.google.com/docs/perf-mon/automatic-web)!

Note that Firebase Performance Monitoring can take about 12 hours to crunch your data and show it in the _Performance_ tab of the Firebase console.

This is an example of some of the stats in the Firebase Performance Monitoring console after 12 hours:

![Performance screenshot](https://firebasestorage.googleapis.com/v0/b/rxfire-525a3.appspot.com/o/docs%2FScreen%20Shot%202019-07-03%20at%202.43.29%20PM.png?alt=media&token=079547b5-ba5d-46bc-acfa-d9dedc184dc5)
