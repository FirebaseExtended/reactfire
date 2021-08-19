import * as React from 'react';
import { useAuth, useUser, SuspenseWithPerf, useSigninCheck } from 'reactfire';
import { WideButton } from '../display/Button';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

const signOut = auth => auth.signOut().then(() => console.log('signed out'));
const signIn = async auth => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
}

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error('Children must be provided');
  }

  if (signInCheckResult.signedIn === true) {
    return children as JSX.Element;
  } else {
    return fallback;
  }
};

const UserDetails = () => {
  const auth = useAuth();
  const {data: user} = useUser();

  return (
    <>
      <CardSection title="Displayname">{(user as User).displayName}</CardSection>
      <CardSection title="Providers">
        <ul>
          {(user as User).providerData?.map(profile => (
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
  const auth = useAuth();

  return (
    <CardSection title="Sign-in form">
      <WideButton label="Sign in with Google" onClick={() => signIn(auth)} />
    </CardSection>
  );
};

export const Auth = () => {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<LoadingSpinner/>}>
      <AuthWrapper fallback={<SignInForm />}>
        <UserDetails />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};