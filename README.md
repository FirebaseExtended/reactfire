# ReactFire

[Hooks](https://reactjs.org/docs/hooks-intro.html) that make it easy to interact with Firestore, Realtime Database, Authentication, and Storage. Note, every `reactfire` hook _throws a Promise_ until it has connected to Firebase. Wrap your components in React's [Suspense](https://reactjs.org/docs/code-splitting.html#suspense). [Example](/blob/master/sample-simple/src/Auth.js#L50).

## For development

1. `yarn install`
1. `cd` into the _reactfire/reactfire_ directory. run `yarn run watch`.
1. In a new terminal, `cd` into the _reactfire/sample-simple_ directory. run `yarn start`.
1. Head over to https://localhost:3000 to see the running sample

## Testing

1. `cd` into the _reactfire/reactfire_ directory
1. run `yarn test`
