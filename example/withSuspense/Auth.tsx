import * as React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useAuth, useUser, SuspenseWithPerf, AuthCheck } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

const signOut = auth => auth.signOut().then(() => console.log('signed out'));

const UserDetails = () => {
  const auth = useAuth();
  const { data: user } = useUser();

  return (
    <>
      <CardSection title="Displayname">{user.displayName}</CardSection>
      <CardSection title="Providers">
        <ul>
          {user.providerData.map(profile => {
            if (profile) {
              return <li key={profile.providerId}>{profile.providerId}</li>;
            } else {
              return 'null profile';
            }
          })}
        </ul>
      </CardSection>
      <CardSection title="Sign Out">
        <WideButton label="Sign Out" onClick={() => signOut(auth)} />
      </CardSection>
    </>
  );
};

const SignInForm = () => {
  const auth = useAuth;

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  return (
    <CardSection title="Sign-in form">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
    </CardSection>
  );
};

export const Auth = () => {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<p>loading...</p>}>
      <AuthCheck fallback={SignInForm}>
        <UserDetails />
      </AuthCheck>
    </SuspenseWithPerf>
  );
};
