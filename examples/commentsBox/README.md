# ReactFire Comments Box Example

## Setup Instructions

To run this example locally, either download the whole ReactFire repository or just this
`/commentsBox/` directory. Then replace the example Firebase URL with your own Firebase URL in the
`index.html` file:

```javaScript
var firebaseApp = "https://my-firebase-app.firebaseio.com/"
```

Finally, start up a server via Python (or your preferred method):

```bash
$ python -m SimpleHTTPServer 8080
```

You can then visit the example in the browser of your choice at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

If you have downloaded the entire repository visit the examples at
[http://127.0.0.1:8080/examples/commentsBox/](http://127.0.0.1:8080/examples/commentsBox/), 
[http://127.0.0.1:8080/examples/todoApp/](http://127.0.0.1:8080/examples/todoApp/)

## Description

The official [React tutorial](http://facebook.github.io/react/docs/tutorial.html) is a great
introduction to React. This example replaces the REST-like server used in the tutorial with
Firebase and the ReactFire mixin.

ReactFire allows us to strip out the polling concept as well as the jQuery AJAX calls. Instead,
with the ReactFire mixin, we can bind right to Firebase and keep everything in sync in realtime.
