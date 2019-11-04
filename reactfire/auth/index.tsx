import { auth, User } from 'firebase/app';
import * as React from 'react';
import { user } from 'rxfire/auth';
import { useObservable, useFirebaseApp, ReactFireOptions } from '..';
import { from } from 'rxjs';

function getAuthFromContext(): auth.Auth {
  const firebaseApp = useFirebaseApp();

  if (!firebaseApp) {
    throw new Error(
      'Firebase not found in context. Either pass it directly to a reactfire hook, or wrap your component in a FirebaseAppProvider'
    );
  }

  const authFunc = firebaseApp.auth;

  if (!authFunc || !authFunc()) {
    throw new Error(
      "No auth object off of Firebase. Did you forget to import 'firebase/auth' in a component?"
    );
  }

  return authFunc();
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
  auth = auth || getAuthFromContext();

  return useObservable(
    user(auth),
    'auth: user',
    options ? options.startWithValue : undefined
  );
}

export function useIdTokenResult(user: User, forceRefresh: boolean = false) {
  if (!user) {
    throw new Error('you must provide a user');
  }

  const idToken$ = from(user.getIdTokenResult(forceRefresh));

  return useObservable(idToken$, `${user.uid}-claims`);
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
    return children;
  } else {
    return fallback;
  }
}

export function AuthCheck({
  auth,
  fallback,
  children,
  requiredClaims
}: AuthCheckProps): React.ReactNode {
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
      children
    );
  } else {
    return fallback;
  }
}
