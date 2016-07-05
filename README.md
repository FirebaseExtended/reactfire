# ReactFire [![Build Status](https://travis-ci.org/firebase/reactfire.svg?branch=master)](https://travis-ci.org/firebase/reactfire) [![Coverage Status](https://coveralls.io/repos/firebase/reactfire/badge.svg?branch=master&service=github)](https://coveralls.io/github/firebase/reactfire?branch=master) [![GitHub version](https://badge.fury.io/gh/firebase%2Freactfire.svg)](http://badge.fury.io/gh/firebase%2Freactfire)


[ReactJS](https://facebook.github.io/react/) is a framework for building large, complex user
interfaces. [Firebase](https://firebase.google.com/) complements it perfectly by providing an
easy-to-use, realtime data source for populating the `state` of React components. With ReactFire, it
only takes a few lines of JavaScript to integrate Firebase data into React apps via the
`ReactFireMixin`.


## Table of Contents

 * [Getting Started With Firebase](#getting-started-with-firebase)
 * [Downloading ReactFire](#downloading-reactfire)
 * [Documentation](#documentation)
 * [Examples](#examples)
 * [Migration Guides](#migration-guides)
 * [Contributing](#contributing)


## Getting Started With Firebase

ReactFire requires [Firebase](https://firebase.google.com/) in order to sync and store data.
Firebase is a suite of integrated products designed to help you develop your app, grow your user
base, and earn money. You can [sign up here for a free account](https://console.firebase.google.com/).


## Downloading ReactFire

In order to use ReactFire in your project, you need to include the following files in your HTML:

```html
<!-- React -->
<script src="https://fb.me/react-15.1.0.min.js"></script>
<script src="https://fb.me/react-dom-15.1.0.min.js"></script>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/3.1.0/firebase.js"></script>

<!-- ReactFire -->
<script src="https://cdn.firebase.com/libs/reactfire/1.0.0/reactfire.min.js"></script>
```

You can also install ReactFire via npm or Bower. If downloading via npm, you will have to install
React and Firebase separately (that is, they are `peerDependencies`):

```bash
$ npm install reactfire react firebase --save
```

On Bower, the React and Firebase dependencies will be downloaded automatically alongside ReactFire:


```bash
$ bower install reactfire --save
```

## Documentation

* [Quickstart](docs/quickstart.md)
* [Guide](docs/guide.md)
* [API Reference](docs/reference.md)


## Examples

* [Todo App](examples/todoApp)
* [Comments Box](examples/commentsBox)


## Migration Guides

* [Migrating from ReactFire `0.7.0` to `1.x.x`](docs/migration/070-to-1XX.md)


## Contributing

If you'd like to contribute to ReactFire, please first read through our [contribution
guidelines](.github/CONTRIBUTING.md). Local setup instructions are available [here](.github/CONTRIBUTING.md#local-setup).
