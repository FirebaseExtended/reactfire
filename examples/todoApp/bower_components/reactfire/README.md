# ReactFire

[![Build Status](https://travis-ci.org/firebase/reactfire.svg?branch=master)](https://travis-ci.org/firebase/reactfire)
[![Coverage Status](https://img.shields.io/coveralls/firebase/reactfire.svg)](https://coveralls.io/r/firebase/reactfire)
[![GitHub version](https://badge.fury.io/gh/firebase%2Freactfire.svg)](http://badge.fury.io/gh/firebase%2Freactfire)

[ReactJS](http://facebook.github.io/react/) is a framework for building large, complex user
interfaces. [Firebase](http://www.firebase.com/?utm_source=reactfire) complements it perfectly
by providing an easy-to-use, realtime data source for populating the `state` of React components.
With [ReactFire](https://www.firebase.com/docs/web/libraries/react/?utm_source=reactfire), it only
takes a few lines of JavaScript to integrate Firebase into React apps via the `ReactFireMixin`.

[Read through our documentation](https://www.firebase.com/docs/web/libraries/react/?utm_source=reactfire)
on using Firebase with React and [check out our live Todo app demo](https://reactfiretodoapp.firebaseapp.com/)
to get started!


## Downloading ReactFire

In order to use ReactFire in your project, you need to include the following files in your HTML:

```html
<!-- React JS -->
<script src="https://fb.me/react-0.12.0.min.js"></script>
<script src="https://fb.me/JSXTransformer-0.12.0.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.0.1/firebase.js"></script>

<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/0.4.0/reactfire.min.js"></script>
```

Use the URL above to download both the minified and non-minified versions of ReactFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/reactfire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_source=reactfire) and
[React](http://facebook.github.io/react/downloads.html) can be downloaded directly from their
respective websites.

You can also install ReactFire via npm or Bower and its dependencies will be downloaded
automatically:

```bash
$ npm install reactfire --save
```

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
