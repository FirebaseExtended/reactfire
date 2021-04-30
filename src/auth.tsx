import firebase from 'firebase/app';
import * as React from 'react';
import { user } from 'rxfire/auth';
import { preloadAuth, preloadObservable, ReactFireOptions, useAuth, useObservable, ObservableStatus } from './';
import { from } from 'rxjs';

export function preloadUser(options: { firebaseApp: firebase.app.App }) {
  const firebaseApp = options.firebaseApp;

  return preloadAuth({ firebaseApp }).then(auth => {
    const result = preloadObservable(user(auth()), `auth:user:${firebaseApp.name}`);
    return result.toPromise();
  });
}

/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param options
 */
export function useUser<T = unknown>(options?: ReactFireOptions<T>): ObservableStatus<firebase.User> {
  const auth = useAuth();

  const observableId = `auth:user:${auth.app.name}`;
  const observable$ = user(auth);

  let currentUser = auth.currentUser;

  // Only use options.initialData if auth.currentUser is unavailable
  if (!currentUser && (options?.initialData ?? options?.startWithValue)) {
    currentUser = options.initialData ?? options.startWithValue;
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

export function AuthCheck({ fallback, children, requiredClaims }: AuthCheckProps): JSX.Element {
  const { data: user } = useUser<firebase.User>();

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
