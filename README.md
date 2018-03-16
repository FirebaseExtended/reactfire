# ReactFire is deprecated

ReactFire is deprecated. To use Firebase on React application you can use either:
 - The [Firebase JS SDK](https://www.npmjs.com/package/firebase) directly. See below for [Firebase + React samples](#using-the-firebase-js-sdk-in-react) and [migration guides](#migrating-from-reactfire).
 - The [Re-base](https://www.npmjs.com/package/re-base) library which is close to reactfire in design.
 - The [react-redux-firebase](https://github.com/prescottprue/react-redux-firebase) library if you are using Redux in your React app.
 
> To access the former README you can check out the [v1.0.0 tag](https://github.com/firebase/reactfire/tree/v1.0.0)

## Using the Firebase JS SDK in React

To use the Firebase JS SDK in React, you can follow these guidelines:
 - Initialize Firebase in your app once, for instance outside the React components or in a separate module and export the firebase App.
 - Create your Firebase data observers in `componentDidMount` lifecycle methods.
 - Map your Firebase data to the local state in the data observers.
 - Un-subscribe your Firebase data observers in `componentWillUnmount` lifecycle methods to avoid memory leaks and unintended behaviors.
 - When updating data: update the data on Firebase directly. Do not update the local state because it won't update  the data on Firebase but updating Firebase will trigger your local observers instantly.
 
 
### Initialize Firebase

Initialize Firebase once, for example in a separate module (e.g. `firebase.js`) and export the Firebase app. You can find more details on the [web](https://firebase.google.com/docs/web/setup) setup guides:

**firebase.js**
```js
// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/datastore';

// Initalize and export Firebase.
const config = {
  apiKey: '<YOUR-API-KEY>',
  authDomain: '<YOUR-AUTH-DOMAIN>',
  databaseURL: 'https://<YOUR-DATABASE-NAME>.firebaseio.com',
  projectId: '<YOUR-PROJECT-ID>',
  storageBucket: '<YOUR-STORAGE-BUCKET>.appspot.com',
  messagingSenderId: '<YOUR-MESSAGING-SENDER-ID>'
};
export default firebase.initializeApp(config);
```


### Firebase Auth

Here is an example of how you can map the Firebase authentication state to your React component's local state:

```js
import firebase from './firebase.js';

class MyComponent extends React.Component {
  state = {
    isSignedIn: false,
    userProfile: null
  };
  
  componentDidMount() {
    this.deregisterAuthObservable = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user, userProfile: user });
    });
  }
  
  componentWillUnmount() {
    this.deregisterAuthObservable();
  }
  
  // ...
}
```


### Firebase Realtime Database

Here is an example of how you can map data from the Realtime Databaseto your React component's local state:

```js
import firebase from './firebase.js';

class MyComponent extends React.Component {
  state = {
    someData: {}
  };
  
  componentDidMount() {
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
    this.firebaseRef = firebase.database().ref('/someData');
    this.firebaseCallback = this.firebaseRef.on('value', (snap) => {      
      this.setState({ someData: snap.val() });
    });
  }
  
  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    this.firebaseRef.off('value', this.firebaseCallback);
  }
  
  // ...
}
```


### Firebase Cloud Datastore

Here is an example of how you can map data from the Cloud Datastore in a React component:

```js
import firebase from './firebase.js';

class MyComponent extends React.Component {
  state = {
    someCollection: {},
    someDocument: null
  };
  
  componentDidMount() {
    // Updating the `someCollection` local state attribute when the Cloud Firestore 'someCollection' collection changes.
    this.unsubscribeCollectionObserver = firebase.firestore().collection('someCollection').onSnapshot((snap) => {
      const someCollection = {};
      snap.forEach((docSnapshot) => {
        someCollection[docSnapshot.id] = docSnapshot.data();
      });
      this.setState({ someCollection: someCollection });
    });
    
    // Updating the `someDocument` local state attribute when the Cloud Firestore 'someDocument' document changes.
    this.unsubscribeDocumentObserver = firebase.firestore().doc('/collection/someDocument').onSnapshot((snap) => {
      this.setState({ someDocument: snap.data() });
    });
  }
  
  componentWillUnmount() {
    // Un-register the listeners.
    this.unsubscribeCollectionObserver();
    this.unsubscribeDocumentObserver();
  }
  
  // ...
}
```

### Updating data

When updating data, do not set the local state. Setting the local state will not update Firebase. Instead you should update your data on Firebase directly, this will trigger any observers that you have setup locally instantly from cache.

For instance, let's take an app that has a list of todo items stored on Firebase. It also has a text field and a button to add new todos:

```js
import firebase from './firebase.js';

class MyComponent extends React.Component {
  state = {
    todoList: {},
    newTodoText: ''
  };
  
  componentDidMount() {
    // Updating the `todoList` local state attribute when the Firebase Realtime Database data
    // under the '/todoList' path changes.
    this.firebaseRef = firebase.database().ref('/todoList');
    this.firebaseCallback = this.firebaseRef.on('value', (snap) => {      
      this.setState({ todoList: snap.val() });
    });
  }
  
  componentWillUnmount() {
    // Un-register the listener on '/todoList'.
    this.firebaseRef.off('value', this.firebaseCallback);
  }
  
  onSubmit(e) {
    e.preventDefault();
    // Add the new todo to Firebase.
    this.firebaseRef.push({
      text: this.state.newTodoText
    });
    // Clearing the text field.
    this.setState({text: ''});
  }
  
  // ...
}
```

Note how we are not updating the `todoList` in the local state. You only need to update Firebase and the Firebase observer that was set up will take care of propagating the changes and updating the local state.


## Migrating from ReactFire

To migrate from ReactFire to using the Firebase JS SDK first remove the `ReactFireMixin` that was applied to any of your React components.

### Migrate `bindAsObject` calls

In all component that are using [bindAsObject(firebaseRef, bindVar, cancelCallback)](https://github.com/firebase/reactfire/blob/master/docs/reference.md#bindasobjectfirebaseref-bindvar-cancelcallback) change from:

```js
componentWillMount: function() {
  var ref = firebase.database().ref().child("users/fred");
  this.bindAsObject(ref, "user");
}

componentWillUnmount: function() {
  this.unbind("user");
}
```

to:

```js
componentDidMount: function() {
  this.firebaseCallback = firebase.database().ref('/users/fred').on('value', function(snap) {      
    this.setState({ user: snap.val() });
  });
}
  
componentWillUnmount: function() {
  firebase.database().ref('/users/fred').off('value', this.firebaseCallback);
}
```


### Migrate `bindAsObject` calls

In all component that are using [bindAsArray(firebaseRef, bindVar, cancelCallback)](https://github.com/firebase/reactfire/blob/master/docs/reference.md#bindasarrayfirebaseref-bindvar-cancelcallback) change from:

```js
componentWillMount: function() {
  var ref = firebase.database().ref("items");
  this.bindAsArray(ref, "items");
}

componentWillUnmount: function() {
  this.unbind("items");
}
```

to:

```js
componentDidMount: function() {
  this.firebaseCallback = firebase.database().ref('/items').on('value', function(snap) {    
    var items = [];
    snap.forEach(function(itemSnap) {
      items.push(itemSnap.val());
    });
    this.setState({ items: items });
  });
}
  
componentWillUnmount: function() {
  firebase.database().ref('/items').off('value', this.firebaseCallback);
}
```
