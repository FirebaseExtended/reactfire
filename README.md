# ReactFire

[![Build Status](https://travis-ci.org/firebase/reactfire.svg?branch=master)](https://travis-ci.org/firebase/reactfire)
[![Coverage Status](https://img.shields.io/coveralls/firebase/reactfire.svg)](https://coveralls.io/r/firebase/reactfire)
[![GitHub version](https://badge.fury.io/gh/firebase%2Freactfire.svg)](http://badge.fury.io/gh/firebase%2Freactfire)

[ReactJS](http://facebook.github.io/react/) is a framework for building large, complex user
interfaces. [Firebase](http://www.firebase.com/?utm_source=reactfire) complements it perfectly
by providing an easy-to-use, realtime data source for populating the `state` of React components.
With ReactFire, it only takes a few lines of JavaScript to integrate Firebase into React apps via
the `ReactFireMixin`.

[Read our blog post](https://firebase.com/blog/2014-05-01-using-firebase-with-react.html?utm_source=reactfire)
on using Firebase with React and [check out our live Todo app demo](https://reactfiretodoapp.firebaseapp.com/)
to get started!

## Downloading ReactFire

In order to use the `ReactFireMixin` in your project, you need to include the following files in your HTML:

```html
<!-- React JS -->
<script src="http://fb.me/react-0.10.0.min.js"></script>
<script src="http://fb.me/JSXTransformer-0.10.0.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/1.0.21/firebase.js"></script>

<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/0.1.6/reactfire.min.js"></script>
```

Use the URL above to download both the minified and non-minified versions of ReactFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/reactfire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_source=geofire-js) and
[React](http://facebook.github.io/react/downloads.html) can be downloaded directly from their
respective websites.

You can also install ReactFire via npm or Bower and its dependencies will be downloaded automatically:

```bash
$ npm install reactfire --save
```

```bash
$ bower install reactfire --save
```

## Getting Started with Firebase

ReactFire requires Firebase in order to store data. You can
[sign up here](https://www.firebase.com/signup/?utm_source=reactfire) for a free account.

## Usage

To use the `ReactFireMixin` in a React component, add it to the component's mixins property:

```javascript
var ExampleComponent = React.createClass({
  mixins: [ReactFireMixin],
  ...
});
```

The following APIs will then be available from the `this` object inside of `ExampleComponent`.

## API Reference

### bindAsArray(firebaseRef, bindVar, options[ once, type, eventType ])

Creates a binding between Firebase and the inputted bind variable as an array. The Firebase
reference will be stored in `this.firebaseRefs[bindVar]`.

```javascript
var firebaseRef = new Firebase("https://<YOUR_FIREBASE>/");
this.bindAsArray(firebaseRef, "items");
```
Additional options can be given:
- `once`: `true` to invoke `.once()`, `false` for `.on()`
- `type`: either 'state' or 'props', to bind to (**Props will not bind with .on(), for it is bad practice**. *props* will only work when *once* is *true* )
- `eventType`: must be valid Firebase eventType string: 'value', 'child_added', 'child_changed', 'child_removed', or 'child_moved'

```javascript
var firebaseRef = new Firebase("https://<FB_PATH>/");
this.bindAsArray(firebaseRef, "items" [ true, 'props', 'child_removed' ]); // note: it is not allowed set `once` to false on `props`
```

### bindAsObject(firebaseRef, bindVar, options[ once, type, eventType ])

Creates a binding between Firebase and the inputted bind variable as an object. The Firebase
reference will be stored in `this.firebaseRefs[bindVar]`.

```javascript
var firebaseRef = new Firebase("https://<YOUR_FIREBASE>/");
this.bindAsObject(firebaseRef, "items");
```

### unbind(bindVar)

Removes the binding between Firebase and the inputted bind variable. This removes the stored
Firebase reference in `this.firebaseRefs[bindVar]` and cleans up any event handlers associated
with that Firebase reference.

```javascript
this.unbind("items");
```

## Additional options

### bindOnAdded(firebaseRef, bindVar, asArray)

Creates a 'child_added' binding between Firebase and the inputted bind variable as an Object if `asArray` not specified, as an Array if `asArray` is `true`.
```javascript
this.bindOnAdded( new Firebase('https://<FB_PATH>/'), 'items'); // bind as Object
this.bindOnAdded( new Firebase('https://<FB_PATH>/'), 'items', true); // bind as Array
```

### bindOnRemoved(firebaseRef, bindVar, asArray)

Creates a 'child_removed' binding between Firebase and the inputted bind variable as an Object (if `asArray` not specified). Binds as an Array if `asArray` is `true`.
```javascript
this.bindOnRemoved( new Firebase('https://<FB_PATH>/'), 'items');
```

### bindOnChanged(firebaseRef, bindVar, asArray)

Creates a 'child_changed' binding between Firebase and the inputted bind variable as an Object (if `asArray` not specified). Binds as an Array if `asArray` is `true`.
```javascript
this.bindOnChanged( new Firebase('https://<FB_PATH>/'), 'items');
```
### bindOnMoved(firebaseRef, bindVar, asArray)

Creates a 'child_moved' binding between Firebase and the inputted bind variable as an Object (if `asArray` not specified). Binds as an Array if `asArray` is `true`.
```javascript
this.bindOnMoved( new Firebase('https://<FB_PATH>/'), 'items');
```

### onceAsArray(firebaseRef, bindVar, [ type, eventType ])

Creates a one-time exchange between Firebase and the inputted bind variable as an Array.  Defaults to type 'state' and eventType 'value'
```javascript
this.onceAsArray( new Firebase('https://<FB_PATH>/'), 'items', [ 'props', 'child_removed' ] );
```

### onceAsObject(firebaseRef, bindVar, [ type, eventType ])

Creates a one-time exchange between Firebase and the inputted bind variable as an Object. Defaults to type 'state' and eventType 'value'
```javascript
this.onceAsObject( new Firebase('https://<FB_PATH>/'), 'items', [ 'props', 'child_removed' ] );
```

### propAsArray(firebaseRef, bindVar, [ eventType ])

Creates a one-time props exchange between Firebase and the inputted bind variable as an Array. Defaults to eventType 'value'
```javascript
this.propAsArray( new Firebase('https://<FB_PATH>/'), 'items', [ 'child_removed' ] );
```

### propAsObject(firebaseRef, bindVar, [ eventType ])

Creates a one-time props exchange between Firebase and the inputted bind variable as an Array. Defaults to eventType 'value'
```javascript
this.propAsObject( new Firebase('https://<FB_PATH>/'), 'items', [ 'child_removed' ] );
```


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