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

  const btnText = user ? 'Sign Out' : 'Sign In';
  const infoText = user ? 'Signed in!' : 'Not signed in';
  const btnAction = user ? signOut : signIn;

  return (
    <>
      <button onClick={btnAction}>{btnText}</button>
      <span> {infoText}</span>
    </>
  );
};

const AuthButton = props => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <FirebaseAuthStateButton />
    </Suspense>
  );
};

export default AuthButton;
