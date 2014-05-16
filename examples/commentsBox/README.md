# CommentBox Example

## Setup Instructions

To run this example locally, either download the whole ReactFire repo or just this /commentBox/
directory. From the /commentBox/ directory, install the needed dependencies via bower:

```bash
$ bower install
```

Then replace the example Firebase app URL with your Firebase app URL in
the index.html file:

```
var firebaseApp = "https://my-firebase-app.firebaseio.com/"
```

Finally, start up a server via Python (or your favorite method):

```bash
$ python -m SimpleHTTPServer 8080
```

Now you should be able to visit the example in the browser of your choice at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Description
The official [React tutorial](http://facebook.github.io/react/docs/tutorial.html) is
a great introduction to how to think in React.  This example replaces the REST-like server
with Firebase and the ReactFireMixin.
