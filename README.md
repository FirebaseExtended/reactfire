# ReactFire

[![Build Status](https://travis-ci.org/firebase/reactfire.svg?branch=master)](https://travis-ci.org/firebase/reactfire)
[![Coverage Status](https://coveralls.io/repos/firebase/reactfire/badge.svg?branch=master&service=github)](https://coveralls.io/github/firebase/reactfire?branch=master)
[![GitHub version](https://badge.fury.io/gh/firebase%2Freactfire.svg)](http://badge.fury.io/gh/firebase%2Freactfire)


## Table of Contents

 * [Overview](#overview)
 * [Downloading ReactFire](#downloading-reactfire)
 * [Getting Started With Firebase](#getting-started-with-firebase)
 * [Documentation](#documentation)
 * [Migration Guides](#migration-guides)
 * [Contributing](#contributing)


## Overview

[ReactJS](https://facebook.github.io/react/) is a framework for building large, complex user
interfaces. [Firebase](https://firebase.google.com/) complements it perfectly by providing an
easy-to-use, realtime data source for populating the `state` of React components. With ReactFire, it
only takes a few lines of JavaScript to integrate Firebase data into React apps via the
`ReactFireMixin`.

[Read through our documentation](docs/README.md) on using Firebase with React and [check out our
live Todo app demo](https://reactfiretodoapp.firebaseapp.com/) to get started!


## Downloading ReactFire

In order to use ReactFire in your project, you need to include the following files in your HTML:

```html
<!-- React -->
<script src="https://fb.me/react-15.0.1.min.js"></script>
<script src="https://fb.me/react-dom-15.0.1.min.js"></script>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/3.0.0/firebase.js"></script>

<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/1.0.0/reactfire.min.js"></script>
```

Use the URLs above to download both the minified and non-minified versions of ReactFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/reactfire/releases).
[Firebase](https://firebase.google.com/docs/web/setup) and
[React](https://facebook.github.io/react/downloads.html) can be downloaded directly from their
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

ReactFire requires Firebase in order to store data. You can [sign up here for a free
account](https://firebase.google.com/).


## Documentation

* [Quickstart](docs/quickstart.md)
* [Guide](docs/guide.md)
* [API reference](docs/reference.html)


## Migration Guides

* [Migrating from ReactFire `0.7.0` to `1.x.x`](docs/migration/070-to-1XX.md)


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
