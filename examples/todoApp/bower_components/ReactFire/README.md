# ReactFire

ReactFireMixin is an officially supported [ReactJS](http://facebook.github.io/react/) mixin
for [Firebase](http://www.firebase.com/). Firebase provides your React app with a
persistent, realtime backend to effortlessly keep all of your clients in sync!

Read our [blog post](https://firebase.com/blog/2014-05-01-using-firebase-with-react.html) on using Firebase with React and check out our [live Todo app demo](https://reactfiretodoapp.firebaseapp.com/) to get started!

## Usage

The ReactFireMixin can be added to you project in three ways:

* Manually copy ReactFireMixin.js from GitHub to you local directory.
* Use bower: `bower install ReactFire`
* Use npm: `npm install reactfire`

To use the ReactFireMixin in a React component, add it to the component's mixins property:

    var ExampleComponent = React.createClass({
      mixins: [ReactFireMixin],
      ...
    });

## API Reference

###bindAsArray(firebaseRef, bindVar)

Creates a binding between Firebase and the inputted bind variable as an array. The Firebase
reference will be stored in this.firebaseRefs[bindVar].

    this.bindAsArray(new Firebase("https://<YOUR_FIREBASE>/"), "items");

###bindAsObject(firebaseRef, bindVar)

Creates a binding between Firebase and the inputted bind variable as an object. The Firebase
reference will be stored in this.firebaseRefs[bindVar].

    this.bindAsObject(new Firebase("https://<YOUR_FIREBASE>/"), "items");

###unbind(bindVar)

Removes the binding between Firebase and the inputted bind variable. This removes the stored
Firebase reference in this.firebaseRefs[bindVar] and cleans up any event handlers associated
with that Firebase reference.

    this.unbind("items");

## Contributing

Interested in manually debugging from source or submitting a pull request? Follow the steps
below.

### Install Dependencies

```bash
$ git clone https://github.com/firebase/ReactFire.git       # clone this repository
$ npm install                                               # install local NPM build / test dependencies
```

### Compile

```bash
$ gulp
```

## License

[Firebase MIT License](http://firebase.mit-license.org)