import { auth, User } from 'firebase/app';
import * as React from 'react';
import { user } from 'rxfire/auth';
import {
  preloadAuth,
  preloadObservable,
  ReactFireOptions,
  useAuth,
  useObservable
} from '..';
import { from } from 'rxjs';
import { useFirebaseApp } from '../firebaseApp';

export function preloadUser(options?: {firebaseApp?: firebase.app.App}) {
  const firebaseApp = options?.firebaseApp || useFirebaseApp();
  return preloadAuth({firebaseApp}).then(auth => {
    const result = preloadObservable(
      user(auth()),
      `auth:user:${firebaseApp.name}`
    );
    return result.toPromise();
  });
}

/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param auth - the [firebase.auth](https://firebase.google.com/docs/reference/js/firebase.auth) object
 * @param options
 */
export function useUser<T = unknown>(
  auth?: auth.Auth,
  options?: ReactFireOptions<T>
): User | T {
  auth = auth || useAuth();
  const currentUser = auth.currentUser || options?.startWithValue;
  return useObservable(user(auth), `auth:user:${auth.app.name}`, currentUser);
}

export function useIdTokenResult(user: User, forceRefresh: boolean = false) {
  if (!user) {
    throw new Error('you must provide a user');
  }

  const idToken$ = from(user.getIdTokenResult(forceRefresh));

  return useObservable<any>(
    idToken$,
    `auth:idTokenResult:${user.uid}:forceRefresh=${forceRefresh}`
  );
}

export interface AuthCheckProps {
  auth?: auth.Auth;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims?: Object;
}

export interface ClaimsCheckProps {
  user: User;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims?: Object;
}

export function ClaimsCheck({ user, fallback, children, requiredClaims }) {
  const { claims } = useIdTokenResult(user, false);
  const missingClaims = {};

  Object.keys(requiredClaims).forEach(claim => {
    if (requiredClaims[claim] !== claims[claim]) {
      missingClaims[claim] = {
        expected: requiredClaims[claim],
        actual: claims[claim]
      };
    }
  });

  if (Object.keys(missingClaims).length === 0) {
    return <>{children}</>;
  } else {
    return <>{fallback}</>;
  }
}

export function AuthCheck({
  auth,
  fallback,
  children,
  requiredClaims
}: AuthCheckProps): JSX.Element {
  const user = useUser<User>(auth);

  if (user) {
    return requiredClaims ? (
      <ClaimsCheck
        user={user}
        fallback={fallback}
        requiredClaims={requiredClaims}
      >
        {children}
      </ClaimsCheck>
    ) : (
      <>{children}</>
    );
  } else {
    return <>{fallback}</>;
  }
}
