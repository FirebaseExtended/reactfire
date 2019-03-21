import React, { Suspense, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useUser } from 'reactfire';

const signIn = () =>
  firebase
    .auth()
    .signInAnonymously()
    .then(() => console.log('signed in'));

const signOut = () =>
  firebase
    .auth()
    .signOut()
    .then(() => console.log('signed out'));

const FirebaseAuthStateButton = props => {
  const user = useUser(firebase.auth());
  const [disabled, setDisabled] = useState(false);

  let btnText, infoText, authAction;

  if (user) {
    btnText = 'Sign Out';
    infoText = 'Signed in!';
    authAction = signOut;
  } else {
    btnText = 'Sign In';
    infoText = 'Not signed in';
    authAction = signIn;
  }

  const btnAction = () => {
    setDisabled(true);
    return authAction().then(() => setDisabled(false));
  };

  return (
    <>
      <button disabled={disabled} onClick={btnAction}>
        {btnText}
      </button>
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
