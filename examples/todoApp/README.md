# ReactFire Todo App Example

## Live Demo
You can view a live version of this demo [here](https://reactfiretodoapp.firebaseapp.com/).

## Setup Instructions

To run this example locally, either download the whole ReactFire repo or just this /todoApp/
directory. From the /todoApp/ directory, install the needed dependencies via bower:

```bash
$ bower install
```

Then start up a server via Python (or your favorite method):

```bash
$ python -m SimpleHTTPServer 8080
```

Now you should be able to visit the example in the browser of your choice at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Description

This example shows three different ways to make a Todo app using React. It is adapted from the
Todo app example on the [ReactJS homepage](http://facebook.github.io/react/). There are three
different versions of the Todo app example:

1. __Plain React:__ Almost an exact copy of the ReactJS homepage example. This uses plain React
code with no Firebase code at all. Changes made to this example are not persistent.

2. __React + Plain Firebase:__ A version of the first example with explicit Firebase calls. Changes
made to this example are persistent.

3. __ReactFireMixin:__ A version of the first example which uses the ReactFireMixin. Changes made to
this example are persistent.

## Walkthrough

To learn more about how this example works, see the [blog post on the official Firebase blog](https://www.firebase.com/blog/2014-05-01-using-firebase-with-react.html).