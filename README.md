reactFire
=========

reactFire is an officially supported [React](http://facebook.github.io/react/) mixin
for [Firebase](http://www.firebase.com/). Firebase provides your React app with a
persistent, real-time backend so you don't need servers to build your React app!

Read our [blog post](http://www.firebase.com/blog/TODO) on using React with Firebase to get started!

API Reference
-------------
To add the reactFire mixin to your component, update the component's mixins property:

    var ExampleComponent = React.createClass({
      mixins: [reactFireMixin],
      ...
    });

###bindToArray(firebaseRef, bindVar)

Creates a binding between Firebase and the inputted bind variable as an array. The Firebase
reference will be stored in this.firebaseRefs[bindVar].

    this.bindToArray(new Firebase("https://<YOUR_FIREBASE>.firebaseio-demo.com/items/"), "items");

###bindToObject(firebaseRef, bindVar)

Creates a binding between Firebase and the inputted bind variable as an object. The Firebase
reference will be stored in this.firebaseRefs[bindVar].

    this.bindToObject(new Firebase("https://<YOUR_FIREBASE>.firebaseio-demo.com/items/"), "items");

###unbind(bindVar)

Removes the binding between Firebase and the inputted bind variable. This removes the stored
Firebase reference in this.firebaseRefs[bindVar] and cleans up any event handlers associated
with that Firebase reference.

    this.unbind("items");

License
-------
[MIT](http://firebase.mit-license.org).