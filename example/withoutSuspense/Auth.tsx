import * as React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useAuth, useUser } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

const signOut = auth => auth.signOut().then(() => console.log('signed out'));

const UserDetails = ({ user }) => {
  const auth = useAuth();

  return (
    <>
      <CardSection title="Displayname">{user.displayName}</CardSection>
      <CardSection title="Providers">
        <ul>
          {user.providerData.map(profile => (
            <li key={profile.providerId}>{profile.providerId}</li>
          ))}
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
  const { status, data: user, hasEmitted } = useUser();

  if (status === 'loading' || hasEmitted === false) {
    return <LoadingSpinner />;
  }

  return user ? <UserDetails user={user} /> : <SignInForm />;
};
