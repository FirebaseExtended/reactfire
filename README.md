## Changes in this fork
This fork contains some important changes that to be frank you probably need if you want to build serious applications with Firebase and React (which you should by the way, the combination is incredible).

I have not paid great detail to cleanly designing these APIs yet so don't consider them stable at this point. They are very likely to evolve, sometimes quite drastically.

### Idempotent bindings

Calls to any of the "bind" or "unbind" methods are idempotent. If the binding is the same then nothing will happen, if the binding is different then the old one will be unbound and a new one will be create. Exceptions will not be thrown in these circumstances. Idempotency is an important trait of readable and robust code. In particular this is important if you're going to use react router and have navigation within the same React component, in this case it's likely you would want to change existing bindings.

```javascript
  rebind() {
    this.bindAsObject(firebaseRoot.child('foo').child(this.props.params.foo), 'foo');
  }

  componentWillMount() {
    this.rebind();
  }

  componentDidUpdate() {
    this.rebind();
  }
```

In your render method you can check if your bindings have been loaded yet. This is also useful for server side rendering.

```javascript
render() {
  // You can check if all the bindings have been loaded.
  if (!this.areAllBindingsLoaded()) {
    return <div>Loading...</div>;
  }

  // ...or you can check if individual bindings are (this is less useful(.
  if (!this.isBindingLoaded('foo')) {
    return <div>Loading...</div>;
  }
  
  return <div>{foo.name}</div>
}
```

### Check if bindings have been loaded

In your render method you can check if your bindings have been loaded:

```javascript
render() {
  if (!this.areAllBindingsLoaded()) {
    return <div>Loading...</div>;
  }

  if (!this.isBindingLoaded('foo')) {
    return <div>Loading...</div>;
  }
}
```

### Component wide "cancel callback" (i.e. error reporting)

You can have a error reporting callback on the entire component by overriding firebaseDidCancel.

```javascript
  firebaseDidCancel(error) {
      console.error(error);
  }
```

### Debounced "child_added" callback

If you have a really large array your render method is going to be called for each element. Render methods and virtual DOM diffing is fast in React but not this fast.

You don't need to write any code for this to happen, it just works out of the box.

Original documentation follows...

# ReactFire

[![Build Status](https://travis-ci.org/firebase/reactfire.svg?branch=master)](https://travis-ci.org/firebase/reactfire)
[![Coverage Status](https://coveralls.io/repos/firebase/reactfire/badge.svg?branch=master&service=github)](https://coveralls.io/github/firebase/reactfire?branch=master)
[![GitHub version](https://badge.fury.io/gh/firebase%2Freactfire.svg)](http://badge.fury.io/gh/firebase%2Freactfire)

[ReactJS](http://facebook.github.io/react/) is a framework for building large, complex user
interfaces. [Firebase](http://www.firebase.com/?utm_source=reactfire) complements it perfectly
by providing an easy-to-use, realtime data source for populating the `state` of React components.
With [ReactFire](https://www.firebase.com/docs/web/libraries/react/?utm_source=reactfire), it only
takes a few lines of JavaScript to integrate Firebase data into React apps via the `ReactFireMixin`.

[Read through our documentation](https://www.firebase.com/docs/web/libraries/react/?utm_source=reactfire)
on using Firebase with React and [check out our live Todo app demo](https://reactfiretodoapp.firebaseapp.com/)
to get started!

## Downloading ReactFire

In order to use ReactFire in your project, you need to include the following files in your HTML:

```html
<!-- React -->
<script src="https://fb.me/react-0.14.7.min.js"></script>
<script src="https://fb.me/react-dom-0.14.7.min.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.4.0/firebase.js"></script>

<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/0.6.0/reactfire.min.js"></script>
```

Use the URL above to download both the minified and non-minified versions of ReactFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/reactfire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_source=reactfire) and
[React](http://facebook.github.io/react/downloads.html) can be downloaded directly from their
respective websites.

You can also install ReactFire via npm or Bower. If downloading via npm, you will have to install
React and Firebase separately (that is, they are `peerDependencies`):

```bash
$ npm install reactfire react firebase --save
```

On Bower, the React and Firebase dependencies will be downloaded automatically:


```bash
$ bower install reactfire --save
```


## Getting Started with Firebase

ReactFire requires Firebase in order to store data. You can
[sign up here for a free account](https://www.firebase.com/signup/?utm_source=reactfire).


## Usage

To use the `ReactFireMixin` in a React component, add it to the component's `mixins` property:

```javascript
var ExampleComponent = React.createClass({
  mixins: [ReactFireMixin],
  ...
});
```

The ReactFire APIs will then be available from the `this` object inside of `ExampleComponent`.


## Documentation and API Reference

The [ReactFire quickstart](https://www.firebase.com/docs/web/libraries/react/quickstart.html?utm_source=reactfire)
is a great place to get started. There is a walkthrough on how to create the
[Todo app demo](https://reactfiretodoapp.firebaseapp.com/) in the
[ReactFire guide](https://www.firebase.com/docs/web/libraries/react/guide.html?utm_source=reactfire).
Finally, there is a [full API reference](https://www.firebase.com/docs/web/libraries/react/api.html?utm_source=reactfire)
as well.


## Contributing

If you'd like to contribute to ReactFire, you'll need to run the following commands to get your
environment set up:

```bash
$ git clone https://github.com/firebase/reactfire.git
$ cd reactfire          # go to the reactfire directory
$ npm install -g gulp   # globally install gulp task runner
$ npm install -g bower  # globally install Bower package manager
$ npm install           # install local npm build / test dependencies
$ bower install         # install local JavaScript dependencies
$ gulp watch            # watch for source file changes
```

`gulp watch` will watch for changes in the `/src/` directory and lint, concatenate, and minify the
source files when a change occurs. The output files - `reactfire.js` and `reactfire.min.js` - are
written to the `/dist/` directory.

You can run the test suite by navigating to `file:///path/to/reactfire/tests/index.html` or via the
command line using `gulp test`.
