import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { SuspenseWithPerf, useUser } from 'reactfire';

const signOut = () =>
  firebase
    .auth()
    .signOut()
    .then(() => console.log('signed out'));

const UserDetails = ({ user }) => {
  return (
    <>
      <h3>Displayname: {user.displayName}</h3>
      <h3>Providers:</h3>
      <ul>
        {user.providerData.map(profile => (
          <li key={profile.providerId}>{profile.providerId}</li>
        ))}
      </ul>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
};

const SignInForm = () => {
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
};

const FirebaseAuthStateButton = props => {
  const user = useUser(firebase.auth());
  return user ? <UserDetails user={user} /> : <SignInForm />;
};

const AuthButton = props => {
  return (
    <SuspenseWithPerf
      traceId={'firebase-user-wait'}
      fallback={<p>loading...</p>}
      firePerf={firebase.performance()}
    >
      <FirebaseAuthStateButton />
    </SuspenseWithPerf>
  );
};

export default AuthButton;
