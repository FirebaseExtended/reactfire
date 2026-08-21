import { user } from 'rxfire/auth';
import { preloadObservable, ReactFireOptions, useAuth, useObservable, ObservableStatus, ReactFireError } from './index.js';
import { from, of, defer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import type { Auth, User, IdTokenResult } from 'firebase/auth';
type Claims = IdTokenResult['claims'];

export async function preloadUser(authResolver: () => Promise<Auth>) {
  const auth = await authResolver();
  const user$ = preloadObservable(user(auth), `auth:user:${auth.name}`);
  return user$.toPromise();
}

/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param options
 */
export function useUser<T = unknown>(options?: ReactFireOptions<T>): ObservableStatus<User | null> {
  const auth = useAuth();

  const observableId = `auth:user:${auth.name}`;
  const observable$ = user(auth);

  const _options: ReactFireOptions<T> = { ...options };

  // If a user is already signed in, seed initialData so consumers see the user
  // synchronously on the first render without waiting for the async observable.
  // We only do this when currentUser is truthy to avoid masking the uninitialized
  // (null before auth has loaded from storage) case as "signed out".
  if (auth.currentUser && !('initialData' in _options) && !('startWithValue' in _options)) {
    _options.initialData = auth.currentUser as unknown as T;
  }

  return useObservable(observableId, observable$, _options);
}

export function useIdTokenResult(user: User, forceRefresh = false, options?: ReactFireOptions<IdTokenResult>): ObservableStatus<IdTokenResult> {
  if (!user) {
    throw new Error('you must provide a user');
  }

  const observableId = `auth:idTokenResult:${user.uid}:forceRefresh=${forceRefresh}`;
  // Wrap in `defer` so the token fetch runs lazily on subscription rather than
  // eagerly on every render.
  const observable$ = defer(() => from(user.getIdTokenResult(forceRefresh)));

  return useObservable(observableId, observable$, options);
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
      user: User;
    };

export interface SignInCheckOptionsBasic extends ReactFireOptions<SigninCheckResult> {
  forceRefresh?: boolean;
}

export interface SignInCheckOptionsClaimsObject extends SignInCheckOptionsBasic {
  requiredClaims: Claims;
}

export interface ClaimsValidator {
  (claims: Claims): {
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
 * const {status, data: signInCheckResult} = useSigninCheck({requiredClaims: {admin: true}});
 *
 * // pass in a custom claims validator function
 * const {status, data: signInCheckResult} = useSigninCheck({validateCustomClaims: (userClaims) => {
 *   // custom validation logic...
 * }});
 *
 * // You can optionally force-refresh the token
 * const {status, data: signInCheckResult} = useSigninCheck({forceRefresh: true, requiredClaims: {admin: true}});
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
  let observableId = `auth:signInCheck:${auth.name}::forceRefresh:${!!options?.forceRefresh}`;
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
    switchMap((user) => {
      if (!user) {
        const result: SigninCheckResult = { signedIn: false, hasRequiredClaims: false, errors: {}, user: null };
        return of(result);
      } else if (options && (options.hasOwnProperty('requiredClaims') || options.hasOwnProperty('validateCustomClaims'))) {
        return from(user.getIdTokenResult(options?.forceRefresh ?? false)).pipe(
          map((idTokenResult) => {
            let validator: ClaimsValidator;

            if (options.hasOwnProperty('requiredClaims')) {
              validator = getClaimsObjectValidator((options as SignInCheckOptionsClaimsObject).requiredClaims);
            } else {
              validator = (options as SignInCheckOptionsClaimsValidator).validateCustomClaims;
            }

            const { hasRequiredClaims, errors } = validator(idTokenResult.claims);

            const result: SigninCheckResult = { signedIn: true, hasRequiredClaims, errors, user: user };
            return result;
          })
        );
      } else {
        // If no claims are provided to be checked, `hasRequiredClaims` is true
        const result: SigninCheckResult = { signedIn: true, hasRequiredClaims: true, errors: {}, user: user };
        return of(result);
      }
    })
  );

  return useObservable(observableId, observable, options);
}

function getClaimsObjectValidator(requiredClaims: Claims): ClaimsValidator {
  return function claimsObjectValidator(userClaims) {
    const errors: { [key: string]: ReactFireError[] } = {};

    Object.keys(requiredClaims).forEach((claim) => {
      if (requiredClaims[claim] !== userClaims[claim]) {
        errors[claim] = [new ReactFireError('auth/missing-claim', `Expected "${requiredClaims[claim]}", but user has "${userClaims[claim]}" instead`)];
      }
    });

    return {
      hasRequiredClaims: Object.keys(errors).length === 0,
      errors,
    };
  };
}
