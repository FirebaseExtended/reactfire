# Quickstart | ReactFire

With ReactFire it only takes a few lines of JavaScript to integrate Firebase into React apps.


## 1. Create an account

The first thing we need to do is [sign up for a free Firebase account](https://firebase.google.com/).
A brand new Firebase project will automatically be created for you which you will use in conjunction
with ReactFire to store and sync data.


## 2. Include Firebase and ReactFire

To use ReactFire in our website, we need to add it along with all its dependencies to the `<head>`
section of our HTML file. We recommend including the Firebase and ReactFire libraries directly from
our CDN:


```js
<!-- React JS -->
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/3.0.3/firebase.js"></script>

<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/1.0.0/reactfire.min.js"></script>
```

ReactFire and its dependencies are also available from npm via `npm install reactfire` and Bower
via `bower install reactfire`.


## 3. Initialize the Firebase SDK

We'll need to initialize the Firebase SDK before we can use it. This should happen one time, outside
of your React component. You can find more details on the [web](https://firebase.google.com/docs/web/setup)
or [Node.js](https://firebase.google.com/docs/server/setup) setup guides.

```js
<script>
  var config = {
    apiKey: "<YOUR-API-KEY>",

    // Only needed if using Firebase Realtime Database (which we will be in this example)
    databaseURL: "https://<YOUR-DATABASE-NAME>.firebaseio.com",

    // Only needed if using Firebase Authentication
    authDomain: "<YOUR-AUTH-DOMAIN>",

    // Only needed if using Firebase Storage
    storageBucket: "<YOUR-STORAGE-BUCKET>.appspot.com"
  };

  firebase.initializeApp(config);
</script>
```


## 4. Add the `ReactFireMixin`

ReactFire exposes the `ReactFireMixin` which extends the functionality of a React component, adding
additional Firebase-specific methods to it. These methods allow us to create a **one-way data
binding from our Firebase database to our component's `this.state` variable**. Add the
`ReactFireMixin` to our component's `mixins` list:

```js
var ExampleComponent = React.createClass({
  mixins: [ReactFireMixin],
  // ...
});
```

## 5. Bind to Firebase

Because of the data binding provided by ReactFire, any changes to our remote database will be
reflected in realtime to `this.state`. The data binding does not work in the other way - changes
made to the `this.state` have no effect on our database. Any changes which we want to make to
`this.state` should instead be changed in our database directly by using the Firebase client
library. ReactFire will handle the work of then updating `this.state`.

**Note that ReactFire creates a one-way data binding from our database to our component, not the
other way around.**

Taking `ExampleComponent` above, we can keep `this.state.items` in sync with any changes to an
`items` node in the database by using ReactFire in the component's `componentWillMount()` method:

```js
componentWillMount: function() {
  var ref = firebase.database().ref("items");
  this.bindAsArray(ref, "items");
}
```

Now, if we add an item to the `items` node in the database, that change will be automatically
reflected in `this.state.items`. We have the option of binding the data from the database as a
JavaScript array (via `bindAsArray()`) or object (via `bindAsObject()`).


## 6. Unbind from Firebase

When our React component goes out of scope or is being unmounted, ReactFire will automatically
unbind any open connections to our Firebase database. If we want to do this manually at an earlier
time (that is, while the component is still mounted), ReactFire provides an `unbind()` method. For
example, if we no longer want `this.state.items` to be bound to node, we can call
`this.unbind("items")` from anywhere within our component.


## 7. Next steps

This was just a quick run through of the basics of ReactFire. For a more in-depth explanation of how
to use ReactFire, [check out the ReactFire guide](guide.md) or dig right into the
[ReactFire API reference](reference.md).
