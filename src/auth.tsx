import firebase from 'firebase/app';
import * as React from 'react';
import { user } from 'rxfire/auth';
import { preloadAuth, preloadObservable, ReactFireOptions, useAuth, useObservable, ObservableStatus } from './';
import { from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
  requiredClaims: { [key: string]: any };
}

interface MissingClaims {
  [key: string]: { expected: string; actual: string };
}

export type SigninCheckResult =
  | {
      signedIn: false;
      hasRequiredClaims: false;
    }
  | { signedIn: true; hasRequiredClaims: boolean; missingClaims: MissingClaims };

export interface SignInCheckOptions extends ReactFireOptions<SigninCheckResult> {
  requiredClaims?: { [key: string]: any };
  forceRefresh?: boolean;
}

/**
 * Subscribe to the signed-in status of a user.
 *
 * Simple use case:
 *
 * ```jsx
 * function UserFavorites() {
 *    const {status, data: signInCheckResult} = useSigninCheck();
 *
 *    if (status === 'loading') {
 *      return <LoadingSpinner />
 *    }
 *
 *    if (signInCheckResult.signedIn === true) {
 *      return <FavoritesList />
 *    } else {
 *      return <SignInForm />
 *    }
 * }
 * ```
 *
 * Advanced: You can also optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims). Example:
 *
 * ```jsx
 * function ProductPricesAdminPanel() {
 *    const {status, data: signInCheckResult} = useSigninCheck({requiredClaims: {admin: true, canModifyPrices: true}});
 *
 *    if (status === 'loading') {
 *      return <LoadingSpinner />
 *    }
 *
 *    if (signInCheckResult.signedIn && signInCheckResult.hasRequiredClaims) {
 *      return <FavoritesList />
 *    } else {
 *      console.warn('missing claims', signInCheckResult.missingClaims);
 *      return <SignInForm />
 *    }
 * }
 * ```
 */
export function useSigninCheck(options?: SignInCheckOptions): ObservableStatus<SigninCheckResult> {
  const auth = useAuth();

  const observableId = `auth:signInCheck:${auth.app.name}:requiredClaims:${JSON.stringify(options?.requiredClaims)}`;
  const observable = user(auth).pipe(
    switchMap(user => {
      if (!user) {
        return of({ signedIn: false, hasRequiredClaims: false });
      } else if (options?.requiredClaims !== undefined) {
        return from(user.getIdTokenResult(options?.forceRefresh ?? false)).pipe(
          map(idTokenResult => {
            const missingClaims: MissingClaims = {};
            const requiredClaims = options.requiredClaims as { [key: string]: any };

            Object.keys(requiredClaims).forEach(claim => {
              if (requiredClaims[claim] !== idTokenResult.claims[claim]) {
                missingClaims[claim] = {
                  expected: requiredClaims[claim],
                  actual: idTokenResult.claims[claim]
                };
              }
            });

            return { signedIn: true, hasRequiredClaims: Object.keys(missingClaims).length === 0, missingClaims };
          })
        );
      } else {
        return of({ signedIn: true });
      }
    })
  );

  return useObservable(observableId, observable);
}

/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
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

/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
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
