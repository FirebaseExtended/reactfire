# Getting Started with ReactFire

⚛ + 🔥 = 🌯

This quickstart shows you how to connect your React web app to **Cloud Firestore**, listen for its data, and display the data in _real time_. We'll also configure **Firebase Performance Monitoring** so you can get some performance stats.

Let's build a web app that displays, in _real time_, the tastiness of a burrito. Yum!

To see the completed app, check out [this StackBlitz workspace](https://stackblitz.com/fork/reactfire-sample).

## 1. Create a document in Cloud Firestore

> If your project doesn't have a Cloud Firestore database instance yet, check out [these instructions](https://firebase.google.com/docs/firestore/quickstart#create) to create a new instance. Please initialize it in _locked mode_.

1. Go to the _Database_ tab in the [Firebase console](https://console.firebase.google.com).

1. Add a document.

   1. In the _Data_ tab of the console, click _Add Collection_

   1. Name the collection **_tryreactfire_**
   1. Add a document with ID **_burrito_** and boolean field `yummy: true`

   ![new document screenshot](https://firebasestorage.googleapis.com/v0/b/rxfire-525a3.appspot.com/o/docs%2FScreen%20Shot%202019-07-03%20at%202.19.11%20PM.png?alt=media&token=052d27ea-5db1-4a02-aad0-a3f017c1a975)

1. Add security rules to allow access to your burrito document.

   1. In the _Rules_ tab of the console, add the following security rules:

   ```text
   rules_version = '2';
   service cloud.firestore {
      match /databases/{database}/documents {
        match /tryreactfire/burrito {
          allow read, write: if true;
        }
      }
    }
   ```

   2. _Publish_ the rules.

## 2. Create a React App

> Prerequisite: make sure you have [Node.js](https://nodejs.org/en/) installed.

In a terminal, create a fresh React app in a directory of your choice.

```shell
npx create-react-app myapp
cd myapp
```

## 3. Install ReactFire and the Firebase SDK

> Ignore npm warnings.

```bash
npm install --save firebase reactfire
```

## 4. Register your app with Firebase

1. In the center of the Firebase console's project overview page, click the Web icon to launch the setup workflow.

   > If you've already added an app to your Firebase project, click _Add app_ to display the platform options.

1. Enter your app's nickname.

   > Note: Firebase Hosting is not required for you to use Firebase products with your web app.

1. _Register_ the app.

1. Copy the Firebase [config object](https://firebase.google.com/docs/web/setup#config-object). This will be used in Step 5.

1. _Continue to Console_

## 5. Add Firebase to `index.js`

> Open the src directory and add code to index.js as described below.

1. Import from ReactFire

   ```js
   //...
   import { FirebaseAppProvider } from 'reactfire';
   //...
   ```

1. Add the Firebase [config object](https://firebase.google.com/docs/web/setup#config-object)

   > Add the firebaseConfig constant and paste the config object from Step 4.

   ```jsx
   //...
   const firebaseConfig = {
     /* Paste your config object from Firebase console here
      */
   };
   //...
   ```

1. Wrap your app in a `FirebaseAppProvider`

   > Modify the component passed to the render function.

   ```jsx
   //...
   ReactDOM.render(
     <FirebaseAppProvider firebaseConfig={firebaseConfig}>
       <App />
     </FirebaseAppProvider>,
     document.getElementById('root')
   );
   //...
   ```

## 6. Add the `Burrito` function component to `App.js`

> Open the src directory and add code to App.js as described below.

1. Import from ReactFire

   ```js
   //...
   import 'firebase/firestore';
   import { useFirestoreDocData, useFirestore } from 'reactfire';
   //...
   ```

1. Add a function component

   ```jsx
   //...
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
   //...
   ```

1. Render your new `Burrito` component

   Replace the `App` function with the following:

   ```jsx
   //...
   function App() {
     return (
       <div className="App">
         <Burrito />
       </div>
     );
   }
   //...
   ```

## 7. Run your app!

1. Run your app.

   ```bash
   yarn start

   # or

    npm run start
   ```

1. Edit the value of `yummy` in the _Database_ tab in the [Firebase console](https://console.firebase.google.com) and watch it update in real time in your app! 🔥🔥🔥

## _Next Steps_

The example app in this repository shows a number of ReactFire use cases. The [Firestore](https://github.com/FirebaseExtended/reactfire/blob/master/example/withoutSuspense/Firestore.tsx) file demonstrates how to work with lists of data in its `AnimalsList` component. The [Auth](https://github.com/FirebaseExtended/reactfire/blob/master/example/withoutSuspense/Auth.tsx) file demonstrates how to show a sign in form in its `SignInForm` component, and shows how to access user details in its `UserDetails` component. The full example app code can be found [here](https://github.com/FirebaseExtended/reactfire/tree/master/example/withoutSuspense).
