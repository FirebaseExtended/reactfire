import * as React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useAuth, useSigninCheck } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';

const signOut = auth => auth.signOut().then(() => console.log('signed out'));

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { status, data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error('Children must be provided');
  }
  if (status === 'loading') {
    return <LoadingSpinner />;
  } else if (signInCheckResult.signedIn === true) {
    return children as JSX.Element;
  }

  return fallback;
};

const UserDetails = ({ user }) => {
  const auth = useAuth();

  return (
    <>
      <CardSection title="Displayname">{user.displayName}</CardSection>
      <CardSection title="Providers">
        <ul>
          {user.providerData?.map(profile => (
            <li key={profile?.providerId}>{profile?.providerId}</li>
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
  const { status, data: signinResult } = useSigninCheck();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  const { signedIn, user } = signinResult;

  if (signedIn === true) {
    return <UserDetails user={user} />;
  } else {
    return <SignInForm />;
  }
};
