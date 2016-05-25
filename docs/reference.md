# API Reference | ReactFire


## Table of Contents

 * [Initialization](#initialization)
 * [`bindAsArray(firebaseRef, bindVar, cancelCallback)`](#bindasarrayfirebaseref-bindvar-cancelcallback)
 * [`bindAsObject(firebaseRef, bindVar, cancelCallback)`](#bindasobjectfirebaseref-bindvar-cancelcallback)
 * [`unbind(bindVar)`](#unbindbindvar)


## Initialization

To add the ReactFire mixin to your React component, add it to your component's `mixins` list:

```js
var ExampleComponent = React.createClass({
  mixins: [ReactFireMixin],
  ...
});
```

## bindAsArray(firebaseRef, bindVar, cancelCallback)

### Description

Creates a one-way binding from a list of nodes in your Firebase database to an array in `this.state`
of your React component. The name of the array stored in `this.state` is specified using the
`bindVar` variable.

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `firebaseRef` | `DatabaseRef` | The database reference to which we are binding. |
| `bindVar` | String | The name of the attribute within `this.state` which will be bound to your database. |
| `cancelCallback` | Function | An optional callback that will be notified if your event subscription is ever canceled because your client does not have permission to read this data (or it had permission but has now lost it). This callback will be passed an `Error` object indicating why the failure occurred. |

### Examples

The following code will make the data stored at the `/items` node as an array and make it available
as `this.state.items` within your component:

```js
componentWillMount: function() {
  var ref = firebase.database().ref("items");
  this.bindAsArray(ref, "items");
}
```

Each record in the bound array will contain a `.key` property which specifies the key where the
record is stored. So if you have data at `/items/-Jtjl482BaXBCI7brMT8`, the record for that data
will have a `.key` of `"-Jtjl482BaXBCI7brMT8"`.

If an individual record's value in the database is a primitive (boolean, string, or number), the
value will be stored in the `.value` property. If the individual record's value is an object, each
of the object's properties will be stored as properties of the bound record. As an example, let's
assume the `/items` node you bind to contains the following data:

```js
{
  "items": {
    "-Jtjl482BaXBCI7brMT8": 100,
    "-Jtjl6tmqjNeAnQvyD4l": {
      "first": "fred",
      "last": "Flintstone"
    },
    "-JtjlAXoQ3VAoNiJcka9": "foo"
  }
}
```

The resulting bound array stored in `this.state.items` will be:

```js
[
  {
    ".key": "-Jtjl482BaXBCI7brMT8",
    ".value": 100
  },
  {
    ".key": "-Jtjl6tmqjNeAnQvyD4l",
    "first": "Fred"
    "last": "Flintstone"
  },
  {
    ".key": "-JtjlAXoQ3VAoNiJcka9",
    ".value": "foo"
  }
]
```


## bindAsObject(firebaseRef, bindVar, cancelCallback)

### Description

Creates a one-way binding from node in your Firebase database to an object in this.state of your
React component. The name of the object stored in `this.state` is specified using the `bindVar`
variable.

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `firebaseRef` | `DatabaseRef` | The database reference to which we are binding. |
| `bindVar` | String | The name of the attribute within `this.state` which will be bound to your database. |
| `cancelCallback` | Function | An optional callback that will be notified if your event subscription is ever canceled because your client does not have permission to read this data (or it had permission but has now lost it). This callback will be passed an `Error` object indicating why the failure occurred. |

### Examples

The following code will make the data stored at `/users/fred` as an object and make it available as
`this.state.user` within your component:

```js
componentWillMount: function() {
  var ref = firebase.database().ref().child("users/fred");
  this.bindAsObject(ref, "user");
}
```

The bound object will contain a `.key` property which specifies the key where the object is stored.
So in the code above where we bind to `/users/fred`, the bound object will have a `.key` of `"fred"`.

If the bound node's value in the database is a primitive (boolean, string, or number), the value
will be stored in the `.value` property. If the bound node's value is an object, each of the
object's properties will be stored as properties of the bound object. As an example, let's assume
the `/users/fred` node you bind comes from the following data:

```js
{
  "users": {
    "fred": true
  }
}
```

The resulting bound object stored in `this.state.user` will be:

```js
{
  ".key": "fred",
  ".value": true
}
```

As another example, let's assume the `/users/fred` node contains an object:

```js
{
  "users": {
    "fred": {
      "first": "Fred",
      "last": "Flintstone"
    }
  }
}
```

The resulting bound object stored in `this.state.user` will be:

```js
{
  ".key": "fred",
  "first": "Fred",
  "last": "Flintstone"
}
```

As a final example, let's assume the `/users/fred` node does not exist (that is, it has a value of
`null`). The resulting bound object stored in `this.state.user` will be:

```js
{
  ".key": "fred",
  ".value": null
}
```


## unbind(bindVar)

### Description

Unbinds the binding between your database and the inputted bind variable.

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `bindVar` | string | The name of the attribute within `this.state` which will be unbound from your database. |

The following code will unbind `this.state.items` and set its value to `undefined`:

```js
componentWillUnmount: function() {
  this.unbind("items");
}
```
