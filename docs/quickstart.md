# ReactFire Quickstart

## 1. Create an account

The first thing you need to do to get started with Firebase is [sign up for a free account](https://www.firebase.com/login/). A brand new Firebase app will automatically be created for you with its own unique URL ending in `firebaseio.com`. We'll use this URL to authenticate our users and to store and sync data to the app's database.


## 2. Include Firebase and ReactFire

To use ReactFire in our website, we need to add it along with all its dependencies to the `<head>` section of our HTML file. We recommend including the Firebase and ReactFire libraries directly from our CDN:

```js
<!-- React JS -->
<script src="https://fb.me/react-0.13.3.js"></script>
<script src="https://fb.me/JSXTransformer-0.13.3.js"></script>
<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/0.6.0/reactfire.min.js"></script>
```

**ReactFire and its dependencies are also available from npm via `npm install reactfire` and Bower via `bower install reactfire`.**

## 3. Add the ReactFireMixin

ReactFire exposes the `ReactFireMixin` which extends the functionality of a React component, adding additional Firebase-specific methods to it. These methods allow us to create a **one-way data binding from our Firebase database to our component's `this.state` variable**. Add the `ReactFireMixin` to our component's `mixins` list:

```js
var ExampleComponent = React.createClass({
  mixins: [ReactFireMixin],
  ...
});
```

## 4. Bind to Firebase

Because of the data binding provided by ReactFire, any changes to our remote database will be reflected in realtime to `this.state`. The data binding does not work in the other way - changes made to the `this.state` have no effect on our database. Any changes which we want to make to `this.state` should instead be changed in our database directly by using the Firebase client library. ReactFire will handle the work of then updating `this.state`.

**ReactFire creates a one-way data binding from our database to our component, not the other way around.**

Taking `ExampleComponent` above, we can keep `this.state.items` in sync with any changes to an `items` node in the database by using ReactFire in the component's `componentWillMount()` method:

```js
componentWillMount: function() {
  var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com/items");
  this.bindAsArray(ref, "items");
}
```

Now, if we add an item to the `items` node in the database, that change will be automatically reflected in `this.state.items`. **We have the option of binding the data from the database as a JavaScript array (via `bindAsArray()`) or object (via `bindAsObject()`)**.

## 5. Unbind from Firebase

When our React component goes out of scope or is being unmounted, ReactFire will automatically unbind any open connections to our Firebase database. If we want to do this manually at an earlier time (that is, while the component is still mounted), ReactFire provides an `unbind()` method. For example, if we no longer want `this.state.items` to be bound to node, we can call `this.unbind("items")` from anywhere within our component.

## 6. Next steps

This was just a quick run through of the basics of ReactFire. For a more in-depth explanation of how to use ReactFire, [check out the ReactFire guide](guide.md) or dig right into the [ReactFire API reference](reference.md).
