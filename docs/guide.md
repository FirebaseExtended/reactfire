# Guide | ReactFire


## Table of Contents

 * [What Is ReactJS?](#what-is-reactjs)
 * [Adding Firebase to Your React App](#adding-firebase-to-your-react-app)
 * [`ReactFireMixin`](#reactfiremixin)
 * [Next Steps](#next-steps)


## What Is ReactJS?

[ReactJS](http://facebook.github.io/react/) is a JavaScript library built by Facebook and Instagram
which makes it easy to build large, complex user interfaces. The creators of React describe it as
the “V[iew] in MVC.” It is not meant to be a replacement for Angular or Ember; instead, it is meant
to extend their functionality by providing a high-performance way to keep a view up-to-date with
JavaScript. Its special sauce is that it renders HTML using an incredibly fast virtual DOM diff
algorithm, providing much better performance than competing platforms. It has a “one-way reactive
data flow” which is much simpler to understand than traditional data-binding.

Components - the basic building blocks of React apps - are organized in a tree hierarchy in which
parent components send data down to their children through the props variable. Each component also
has a `state` variable which determines the current data for its view. Whenever `state` is changed,
the component’s render() method is called and React figures out the most efficient way to update the
DOM.

Since React’s main focus is on the user interface, React apps need something else to act as their
backend. That is where Firebase comes in. It adds the “M[odel] and C[ontroller] in MVC” to React
apps, making them fully functioning apps. **Using React’s straightforward binding system, it is easy
to integrate Firebase in a native way with only a small amount of code.**


## Adding Firebase to Your React App

Let's look at the Todo app on the [React homepage](http://facebook.github.io/react/). Within the
`TodoApp` component, `this.state` is used to keep track of the input text and the list of Todo
items. While React ensures that the DOM stays in sync with any changes to `this.state`, the changes
do not persist beyond the life of the page. If you add a few items and then refresh the page, all of
the items disappear! This is because **React has no mechanism for storing data beyond the scope of
the current page session**. It relies on being used with another framework to do that.

**Firebase is a natural complement to React as it provides React apps with a persistent, realtime
backend**. The first thing we need to do is add Firebase to your project:

```js
<!-- React JS -->
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/3.0.3/firebase.js"></script>
```

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

Now that we have included Firebase, we can populate the list of Todo items by reading them from the
database. We do this by hooking into the `componentWillMount()` method of the `TodoApp` component
which is run once, immediately before the initial rendering of the component:

```js
componentWillMount: function() {
  this.firebaseRef = firebase.database.ref("items");
  this.firebaseRef.on("child_added", function(dataSnapshot) {
    this.items.push(dataSnapshot.val());
    this.setState({
      items: this.items
    });
  }.bind(this));
}
```

This code first gets a reference to the `items` node at the root of the database. The call to `on()`
will be run every time a node is added under the `items` node. It is important to realize that a
`child_added` event will be fired for every item under the `items` node, not just new ones that are
added to it. Therefore, when the page is loaded, every existing child under the `items` node will
fire a `child_added` event, meaning they can easily be iterated over and added to `this.state.items`.
Note that the call at the end to `bind()` just sets the scope of callback function to this.

What about adding new Todo items to the database? That code is just as easy:

```js
handleSubmit: function(e) {
  e.preventDefault();
  this.firebaseRef.push({
    text: this.state.text
  });
  this.setState({text: ""});
}
```

Within `handleSubmit()` a new item is pushed onto the database reference which appends it to the end
of the `items` node. The call to `setState()` updates `this.state.text` but does not need to update
`this.state.items` as it did in the original React code. This is because the `child_added` event
handler from `componentWillMount()` will be fired when a new child is pushed onto the `items` node
and that code will update `this.state.items`.

The last thing that needs to happen is cleaning up the database event handler:

```js
componentWillUnmount: function() {
  this.firebaseRef.off();
}
```

With just the few changes above, items added to the Todo list are updated in realtime. Best of all,
the items stick around if the page is refreshed! You can even open multiple tabs pointed at the same
page and see them all update simultaneously, with Firebase doing all the heavy lifting. Take some
time to [view the code for this example](https://github.com/firebase/ReactFire/blob/master/examples/todoApp/js/todoAppFirebaseExplicit.js)
and [play around with a live demo](https://reactfiretodoapp.firebaseapp.com/).


## `ReactFireMixin`

Although integrating Firebase into a React app only takes a few lines of code out of the box, we
wanted to make it even easier. We also want to be able to handle when array items are removed or
updated from Firebase. **We built the `ReactFireMixin` to make it simple to keep `this.state` in
sync with a database node.**

To get started with ReactFire, include it in your project by loading the library directly from our
CDN and placing it right after the React and Firebase libraries in the `<head>` tag:

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

After making sure to initialize the Firebase SDK again, we can then use the `ReactFireMixin` in the
`TodoApp` component, add it to the component's `mixins` property:

```js
var TodoApp = React.createClass({
  mixins: [ReactFireMixin],
  ...
});
```

The `ReactFireMixin` extends the functionality of the `TodoApp` component, adding additional
Firebase-specific methods to it. To keep `this.state.items` in sync with any changes to the `items`
node, make the following change in `componentWillMount()`:

```js
componentWillMount: function() {
  var ref = firebase.database().ref("items");
  this.bindAsArray(ref, "items");
}
```

We simply specify that we want to bind a particular Firebase Database reference to `this.state.items`
of the React component. The `ReactFireMixin` allows binding to a node as an array or as a regular
JavaScript object. This creates a one-way binding from the `Firebase` reference to `this.state.items`,
meaning that if the data in the database changes, so will `this.state.items`. However, if we update
`this.state.items`, the database data will not change. Therefore, changes should be made directly to
the database and not by calling `setState()`:

```js
handleSubmit: function(e) {
  e.preventDefault();
  this.firebaseRefs.items.push({
    text: this.state.text
  });
  this.setState({ text: "" });
}
```

**ReactFire allows for binding to multiple things at once.** Firebase ensures that this is all done
in an efficient manner. To access the `Firebase` reference which is bound to `this.state.items`, we
can reference `this.firebaseRefs["items"]` which is provided by ReactFire. Finally, calling
`this.firebaseRef.off()` is no longer needed in `componentWillUnmount()` as the mixin handles this
behind the scenes.

You can [view the code for this example](https://github.com/firebase/ReactFire/blob/master/examples/todoApp/js/todoAppFirebaseImplicit.js)
and [play around with a live demo](https://reactfiretodoapp.firebaseapp.com/). The code and demo add
the ability to delete items in the array and have them automatically synced back to `this.state.items`.


## Next Steps

ReactJS is a wonderful framework for creating user interfaces. When picking a complementary tool to
use alongside it as a backend, Firebase is the easiest and most powerful solution. In just a few
lines of code you can get a React app syncing data across hundreds of clients at once. ReactFire
makes this that much easier, getting rid of even more boilerplate code.

Head on over to the [ReactFire API reference](reference.md) and then get started building an app
with ReactFire!
