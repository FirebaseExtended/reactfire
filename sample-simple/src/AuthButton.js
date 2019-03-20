import React, { Suspense } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useUser } from 'reactfire';

const signIn = () => firebase.auth().signInAnonymously();

const signOut = () =>
  firebase
    .auth()
    .signOut()
    .then(() => console.log('signed out'));

const FirebaseAuthStateButton = props => {
  const user = useUser(firebase.auth());
  console.log(user);

  const btnText = user ? 'Signed In' : 'Sign In';
  const btnAction = user ? signOut : signIn;

  return <button onClick={btnAction}>{btnText}</button>;
};

const AuthButton = props => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <FirebaseAuthStateButton />
    </Suspense>
  );
};

export default AuthButton;
