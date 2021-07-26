import firebase from 'firebase/app';
import * as React from 'react';
import { user } from 'rxfire/auth';
import { preloadAuth, preloadObservable, ReactFireOptions, useAuth, useObservable, ObservableStatus, ReactFireError } from './';
import { from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { useSuspenseEnabledFromConfigAndContext } from './firebaseApp';

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

export interface ClaimCheckErrors {
  [key: string]: any[];
}

export type SigninCheckResult =
  | {
      signedIn: false;
      hasRequiredClaims: false;
      errors: {};
      user: null;
    }
  | {
      signedIn: true;
      hasRequiredClaims: boolean;
      errors: ClaimCheckErrors;
      user: firebase.User;
    };

export interface SignInCheckOptionsBasic extends ReactFireOptions<SigninCheckResult> {
  forceRefresh?: boolean;
}

export interface SignInCheckOptionsClaimsObject extends SignInCheckOptionsBasic {
  requiredClaims: firebase.auth.IdTokenResult['claims'];
}

export interface ClaimsValidator {
  (claims: firebase.auth.IdTokenResult['claims']): {
    hasRequiredClaims: boolean;
    errors: ClaimCheckErrors | {};
  };
}

export interface SignInCheckOptionsClaimsValidator extends SignInCheckOptionsBasic {
  validateCustomClaims: ClaimsValidator;
}

/**
 * Subscribe to the signed-in status of a user.
 *
 * ```ts
 * const { status, data:signInCheckResult } = useSigninCheck();
 *
 * if (status === 'loading') {
 *   return <LoadingSpinner />}
 *
 *
 * if (signInCheckResult.signedIn === true) {
 *   return <ProfilePage user={signInCheckResult.user}/>
 * } else {
 *   return <SignInForm />
 * }
 * ```
 *
 * Optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) of a user as well.
 *
 * ```ts
 * // pass in an object describing the custom claims a user must have
 * const {status, data: signInCheckResult} = useSignInCheck({requiredClaims: {admin: true}});
 *
 * // pass in a custom claims validator function
 * const {status, data: signInCheckResult} = useSignInCheck({validateCustomClaims: (userClaims) => {
 *   // custom validation logic...
 * }});
 *
 * // You can optionally force-refresh the token
 * const {status, data: signInCheckResult} = useSignInCheck({forceRefresh: true, requiredClaims: {admin: true}});
 * ```
 */
export function useSigninCheck(
  options?: SignInCheckOptionsBasic | SignInCheckOptionsClaimsObject | SignInCheckOptionsClaimsValidator
): ObservableStatus<SigninCheckResult> {
  // If both `requiredClaims` and `validateCustomClaims` are provided, we won't know which one to use
  if (options?.hasOwnProperty('requiredClaims') && options?.hasOwnProperty('validateCustomClaims')) {
    throw new Error('Cannot have both "requiredClaims" and "validateCustomClaims". Use one or the other.');
  }

  const auth = useAuth();

  // ObservableId should change for different options configurations to ensure no cache collisions
  let observableId = `auth:signInCheck:${auth.app.name}::forceRefresh:${!!options?.forceRefresh}`;
  if (options?.forceRefresh) {
    observableId = `${observableId}:forceRefresh:${options.forceRefresh}`;
  }
  if (options?.hasOwnProperty('requiredClaims')) {
    observableId = `${observableId}:requiredClaims:${JSON.stringify((options as SignInCheckOptionsClaimsObject).requiredClaims)}`;
  } else if (options?.hasOwnProperty('validateCustomClaims')) {
    // TODO(jamesdaniels): Check if stringifying this function breaks in IE11
    observableId = `${observableId}:validateCustomClaims:${JSON.stringify((options as SignInCheckOptionsClaimsValidator).validateCustomClaims)}`;
  }

  const observable = user(auth).pipe(
    switchMap(user => {
      if (!user) {
        return of({ signedIn: false, hasRequiredClaims: false });
      } else if (options && (options.hasOwnProperty('requiredClaims') || options.hasOwnProperty('validateCustomClaims'))) {
        return from(user.getIdTokenResult(options?.forceRefresh ?? false)).pipe(
          map(idTokenResult => {
            let validator: ClaimsValidator;

            if (options.hasOwnProperty('requiredClaims')) {
              validator = getClaimsObjectValidator((options as SignInCheckOptionsClaimsObject).requiredClaims);
            } else {
              validator = (options as SignInCheckOptionsClaimsValidator).validateCustomClaims;
            }

            const { hasRequiredClaims, errors } = validator(idTokenResult.claims);
            return { signedIn: true, hasRequiredClaims, errors, user: user };
          })
        );
      } else {
        // If no claims are provided to be checked, `hasRequiredClaims` is true
        return of({ signedIn: true, hasRequiredClaims: true, user: user });
      }
    })
  );

  return useObservable(observableId, observable);
}

function getClaimsObjectValidator(requiredClaims: firebase.auth.IdTokenResult['claims']): ClaimsValidator {
  return function claimsObjectValidator(userClaims) {
    const errors: { [key: string]: ReactFireError[] } = {};

    Object.keys(requiredClaims).forEach(claim => {
      if (requiredClaims[claim] !== userClaims[claim]) {
        errors[claim] = [new ReactFireError('auth/missing-claim', `Expected "${requiredClaims[claim]}", but user has "${userClaims[claim]}" instead`)];
      }
    });

    return {
      hasRequiredClaims: Object.keys(errors).length === 0,
      errors
    };
  };
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

  const suspenseMode = useSuspenseEnabledFromConfigAndContext();
  if (!suspenseMode) {
    console.warn(
      'ClaimsCheck is deprecated and only works when ReactFire is in experimental Suspense Mode. Use useSigninCheck or set suspense={true} in FirebaseAppProvider if you want to use this component.'
    );
  }

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

  const suspenseMode = useSuspenseEnabledFromConfigAndContext();
  if (!suspenseMode) {
    console.warn(
      'AuthCheck is deprecated and only works when ReactFire is in experimental Suspense Mode. Use useSigninCheck or set suspense={true} in FirebaseAppProvider if you want to use this component.'
    );
  }

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
