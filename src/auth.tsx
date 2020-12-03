import firebase from 'firebase/app';
import * as React from 'react';
import { user } from 'rxfire/auth';
import { preloadAuth, preloadObservable, ReactFireOptions, useAuth, useObservable, ObservableStatus } from './';
import { from } from 'rxjs';
import { useFirebaseApp } from './firebaseApp';

export function preloadUser(options?: { firebaseApp?: firebase.app.App }) {
  // TODO: Find an alternative that doesn't break the rules of hooks (conditional hook call)
  const firebaseApp = options?.firebaseApp || useFirebaseApp();

  return preloadAuth({ firebaseApp }).then(auth => {
    const result = preloadObservable(user(auth()), `auth:user:${firebaseApp.name}`);
    return result.toPromise();
  });
}

/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param auth - the [firebase.auth](https://firebase.google.com/docs/reference/js/firebase.auth) object
 * @param options
 */
export function useUser<T = unknown>(auth?: firebase.auth.Auth, options?: ReactFireOptions<T>): ObservableStatus<firebase.User> {
  // TODO: Find an alternative that doesn't break the rules of hooks (conditional hook call)
  auth = auth || useAuth();

  if (!auth) {
    throw new Error('firebase.auth not found');
  }

  const observableId = `auth:user:${auth.app.name}`;
  const observable$ = user(auth);

  let currentUser = auth.currentUser;

  // If currentUser is available, skip initialData
  if (options?.initialData && !currentUser) {
    currentUser = options.initialData;
  }

  return useObservable(observableId, observable$, { ...options, initialData: currentUser });
}

export function useIdTokenResult(
  user: firebase.User,
  forceRefresh: boolean = false,
  options?: ReactFireOptions<firebase.auth.IdTokenResult>
): ObservableStatus<firebase.auth.IdTokenResult> {
  if (!user) {
    throw new Error('you must provide a user');
  }

  const observableId = `auth:idTokenResult:${user.uid}:forceRefresh=${forceRefresh}`;
  const observable$ = from(user.getIdTokenResult(forceRefresh));

  return useObservable(observableId, observable$, options);
}

export interface AuthCheckProps {
  auth?: firebase.auth.Auth;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims?: Object;
}

export interface ClaimsCheckProps {
  user: firebase.User;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims?: { [key: string]: any };
}

export function ClaimsCheck({ user, fallback, children, requiredClaims }: ClaimsCheckProps) {
  const { data } = useIdTokenResult(user, false);
  const { claims } = data;
  const missingClaims: { [key: string]: { expected: string; actual: string } } = {};

  if (requiredClaims) {
    Object.keys(requiredClaims).forEach(claim => {
      if (requiredClaims[claim] !== claims[claim]) {
        missingClaims[claim] = {
          expected: requiredClaims[claim],
          actual: claims[claim]
        };
      }
    });
  }

  if (Object.keys(missingClaims).length === 0) {
    return <>{children}</>;
  } else {
    return <>{fallback}</>;
  }
}

export function AuthCheck({ auth, fallback, children, requiredClaims }: AuthCheckProps): JSX.Element {
  const { data: user } = useUser<firebase.User>(auth);

  if (user) {
    return requiredClaims ? (
      <ClaimsCheck user={user} fallback={fallback} requiredClaims={requiredClaims}>
        {children}
      </ClaimsCheck>
    ) : (
      <>{children}</>
    );
  } else {
    return <>{fallback}</>;
  }
}
