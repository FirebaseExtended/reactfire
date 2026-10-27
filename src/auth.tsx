import * as React from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { AuthSdkContext } from './sdk.js';
import { useSuspenseEnabledFromConfigAndContext } from './firebaseApp.js';
import {
  InstrumentedPromise,
  ObservableStatus,
  ReactFireError,
  ReactFireOptions,
  ReactFireUsable,
  attachUsable,
  clearAllInFlight,
  createFulfilledUsable,
  createInFlightCache,
  getInitialDataOption,
  hasInitialDataOption,
  instrumentPromise,
  unwrapOrSuspend,
  useFirebaseStream,
} from './useFirebaseStream.js';

import type { Auth, User, IdTokenResult } from 'firebase/auth';
type Claims = IdTokenResult['claims'];

const authReadyWeakMap = new WeakMap<Auth, InstrumentedPromise<User | null>>();
const lastUidByAuth = new WeakMap<Auth, string | null | undefined>();

function noteUserForAuth(auth: Auth, user: User | null): void {
  const nextUid = user?.uid ?? null;
  const prevUid = lastUidByAuth.get(auth);
  if (prevUid !== undefined && prevUid !== nextUid) {
    clearAllInFlight();
  }
  lastUidByAuth.set(auth, nextUid);
}

function getAuthReady(auth: Auth): InstrumentedPromise<User | null> {
  let promise = authReadyWeakMap.get(auth);
  if (!promise) {
    if ((auth as { _isInitialized?: boolean })._isInitialized || auth.currentUser) {
      noteUserForAuth(auth, auth.currentUser);
      promise = createFulfilledUsable(auth.currentUser);
    } else {
      promise = instrumentPromise(
        auth.authStateReady().then(() => {
          noteUserForAuth(auth, auth.currentUser);
          return auth.currentUser;
        })
      );
    }
    authReadyWeakMap.set(auth, promise);
  } else if (promise.status === 'fulfilled' && promise.value !== auth.currentUser) {
    noteUserForAuth(auth, auth.currentUser);
    promise = createFulfilledUsable(auth.currentUser);
    authReadyWeakMap.set(auth, promise);
  }
  return promise;
}

interface UserTokenKey {
  user: User;
  forceRefresh: boolean;
}

interface AuthTokenKey {
  auth: Auth;
  uid: string | null;
  forceRefresh: boolean;
}

const userTokenCache = createInFlightCache<UserTokenKey, IdTokenResult>(
  (a, b) => a.user === b.user && a.forceRefresh === b.forceRefresh
);

const authTokenCache = createInFlightCache<AuthTokenKey, IdTokenResult | null>(
  (a, b) => a.auth === b.auth && a.uid === b.uid && a.forceRefresh === b.forceRefresh
);

function getOrStartTokenPromise(user: User, forceRefresh: boolean): InstrumentedPromise<IdTokenResult> {
  return userTokenCache.handle({ user, forceRefresh }, () => user.getIdTokenResult(forceRefresh)).getOrStart();
}

function isAuthInstance(val: unknown): val is Auth {
  return Boolean(val && typeof val === 'object' && typeof (val as Auth).authStateReady === 'function');
}

/**
 * @deprecated Unwrap `useUser(auth).experimental_usable` with `React.use()` instead. Will be removed in v5.0.0.
 */
export async function preloadUser(authResolver: () => Promise<Auth>) {
  const auth = await authResolver();
  await getAuthReady(auth);
  return auth.currentUser;
}

/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param authOrOptions - Optional `Auth` instance (recommended for v5 compatibility) or `ReactFireOptions`
 * @param maybeOptions - `ReactFireOptions` when `auth` is provided as the first argument
 */
export function useUser<T = unknown>(options?: ReactFireOptions<T>): ObservableStatus<User | null>;
export function useUser<T = unknown>(auth: Auth, options?: ReactFireOptions<T>): ObservableStatus<User | null>;
export function useUser<T = unknown>(
  authOrOptions?: Auth | ReactFireOptions<T>,
  maybeOptions?: ReactFireOptions<T>
): ObservableStatus<User | null> {
  const contextAuth = React.useContext(AuthSdkContext);
  const hasExplicitAuth = isAuthInstance(authOrOptions);
  const auth = hasExplicitAuth ? authOrOptions : contextAuth;
  if (!auth) {
    throw new Error('SDK not found. useSdk must be called from within a provider');
  }
  const options = hasExplicitAuth ? maybeOptions : (authOrOptions as ReactFireOptions<T> | undefined);
  const authReady = getAuthReady(auth);

  return useFirebaseStream<Auth, User | null>({
    ref: auth,
    inFlight: {
      peek: () => authReadyWeakMap.get(auth),
      getOrStart: () => getAuthReady(auth),
      clear: () => {},
    },
    getSyncInitialValue: () => {
      const isReady = Boolean(auth.currentUser) || authReady.status === 'fulfilled';
      return isReady
        ? { hasValue: true, value: auth.currentUser, isComplete: false }
        : { hasValue: false, value: null };
    },
    subscribe: (onNext, onError) => {
      let active = true;
      const readyPromise = getAuthReady(auth);
      if (auth.currentUser || readyPromise.status === 'fulfilled') {
        onNext(auth.currentUser, false);
      } else {
        readyPromise.then(
          () => {
            if (active) {
              onNext(auth.currentUser, false);
            }
          },
          () => {}
        );
      }

      const unsubscribe = onIdTokenChanged(
        auth,
        (nextUser) => {
          noteUserForAuth(auth, nextUser);
          if (active) {
            onNext(nextUser, false);
          }
        },
        (err) => {
          if (active) {
            onError(err);
          }
        }
      );

      return () => {
        active = false;
        unsubscribe();
      };
    },
    options,
  });
}

export function useIdTokenResult(
  user: User,
  forceRefresh?: boolean,
  options?: ReactFireOptions<IdTokenResult>
): ObservableStatus<IdTokenResult>;
export function useIdTokenResult(
  auth: Auth,
  forceRefresh?: boolean,
  options?: ReactFireOptions<IdTokenResult | null>
): ObservableStatus<IdTokenResult | null>;
export function useIdTokenResult(
  userOrAuth: User | Auth,
  forceRefresh = false,
  options?: ReactFireOptions<any>
): ObservableStatus<any> {
  if (!userOrAuth) {
    throw new Error('you must provide a user');
  }

  const isAuth = isAuthInstance(userOrAuth);
  const uid = isAuth ? (userOrAuth.currentUser?.uid ?? null) : userOrAuth.uid;

  return useFirebaseStream<{ target: User | Auth; uid: string | null; forceRefresh: boolean }, any>({
    ref: { target: userOrAuth, uid, forceRefresh },
    isEqual: (a, b) => a.target === b.target && a.uid === b.uid && a.forceRefresh === b.forceRefresh,
    inFlight: isAuth
      ? authTokenCache.handle({ auth: userOrAuth, uid, forceRefresh }, () =>
          getAuthReady(userOrAuth).then((user) => (user ? user.getIdTokenResult(forceRefresh) : null))
        )
      : userTokenCache.handle({ user: userOrAuth, forceRefresh }, () => userOrAuth.getIdTokenResult(forceRefresh)),
    subscribe: (onNext, onError, inFlightPromise) => {
      if (isAuth) {
        let active = true;
        let lastUser: User | null = null;
        let seq = 0;
        const unsubscribe = onIdTokenChanged(
          userOrAuth,
          (nextUser) => {
            noteUserForAuth(userOrAuth, nextUser);
            const currentSeq = ++seq;
            if (!active) return;
            if (!nextUser) {
              lastUser = null;
              onNext(null, false);
              return;
            }
            const isNewUser = nextUser !== lastUser;
            lastUser = nextUser;
            const tokenPromise =
              currentSeq === 1 && inFlightPromise && nextUser.uid === uid
                ? (inFlightPromise as Promise<IdTokenResult>)
                : nextUser.getIdTokenResult(isNewUser && forceRefresh);
            tokenPromise.then(
              (res) => {
                if (active && currentSeq === seq) onNext(res, false);
              },
              (err) => {
                if (active && currentSeq === seq) onError(err);
              }
            );
          },
          (err) => {
            if (active) onError(err);
          }
        );
        return () => {
          active = false;
          unsubscribe();
        };
      }

      const tokenPromise =
        (inFlightPromise as InstrumentedPromise<IdTokenResult> | undefined) ??
        getOrStartTokenPromise(userOrAuth, forceRefresh);
      tokenPromise.then(
        (result) => onNext(result, true),
        (error: Error) => onError(error)
      );
      return () => {};
    },
    options,
    defaultIsComplete: !isAuth,
  });
}

export interface AuthCheckProps {
  auth?: Auth;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims?: Object;
}

/**
 * @deprecated Use `<AuthCheck requiredClaims={...}>` or `useIdTokenResult(auth)` instead. Will be removed in v5.0.0.
 */
export interface ClaimsCheckProps {
  user: User;
  fallback: React.ReactNode;
  children: React.ReactNode;
  requiredClaims: { [key: string]: any };
}

/**
 * @deprecated Will be removed in v5.0.0 along with `useSigninCheck`.
 */
export interface ClaimCheckErrors {
  [key: string]: any[];
}

/**
 * @deprecated Will be removed in v5.0.0 along with `useSigninCheck`.
 */
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

/**
 * @deprecated Will be removed in v5.0.0 along with `useSigninCheck`.
 */
export interface SignInCheckOptionsBasic extends ReactFireOptions<SigninCheckResult> {
  forceRefresh?: boolean;
}

/**
 * @deprecated Will be removed in v5.0.0 along with `useSigninCheck`.
 */
export interface SignInCheckOptionsClaimsObject extends SignInCheckOptionsBasic {
  requiredClaims: Claims;
}

/**
 * @deprecated Will be removed in v5.0.0 along with `useSigninCheck`.
 */
export interface ClaimsValidator {
  (claims: Claims): {
    hasRequiredClaims: boolean;
    errors: ClaimCheckErrors | {};
  };
}

/**
 * @deprecated Will be removed in v5.0.0 along with `useSigninCheck`.
 */
export interface SignInCheckOptionsClaimsValidator extends SignInCheckOptionsBasic {
  validateCustomClaims: ClaimsValidator;
}

const signinCheckUsableCache = new WeakMap<object, Map<string, InstrumentedPromise<SigninCheckResult>>>();

/**
 * Subscribe to the signed-in status of a user.
 *
 * @deprecated Use `useUser(auth)`, `useIdTokenResult(auth)`, or `<AuthCheck auth={auth} requiredClaims={...}>` instead. Will be removed in v5.0.0.
 */
export function useSigninCheck(
  options?: SignInCheckOptionsBasic | SignInCheckOptionsClaimsObject | SignInCheckOptionsClaimsValidator
): ObservableStatus<SigninCheckResult> {
  if (options?.hasOwnProperty('requiredClaims') && options?.hasOwnProperty('validateCustomClaims')) {
    throw new Error('Cannot have both "requiredClaims" and "validateCustomClaims". Use one or the other.');
  }

  const suspenseEnabled = useSuspenseEnabledFromConfigAndContext(options?.suspense);
  const hasInitialData = hasInitialDataOption(options);
  const initialData = getInitialDataOption<SigninCheckResult>(options);

  const userStatusObj = useUser({
    suspense: hasInitialData ? false : options?.suspense,
  });
  const { status: userStatus, data: currentUser, firstValuePromise } = userStatusObj;

  const needsClaimsCheck = Boolean(
    options && (options.hasOwnProperty('requiredClaims') || options.hasOwnProperty('validateCustomClaims'))
  );
  const forceRefresh = options?.forceRefresh ?? false;

  const computeClaimsResult = (user: User, idTokenResult: IdTokenResult): SigninCheckResult => {
    let validator: ClaimsValidator;
    if (options?.hasOwnProperty('requiredClaims')) {
      validator = getClaimsObjectValidator((options as SignInCheckOptionsClaimsObject).requiredClaims);
    } else {
      validator = (options as SignInCheckOptionsClaimsValidator).validateCustomClaims;
    }
    const { hasRequiredClaims, errors } = validator(idTokenResult.claims);
    return { signedIn: true, hasRequiredClaims, errors, user };
  };

  const [claimsResultState, setClaimsResultState] = React.useState<{
    user: User | null;
    idTokenResult: IdTokenResult | null;
  }>({ user: null, idTokenResult: null });

  const tokenReqRef = React.useRef<{ user: User; forceRefresh: boolean; promise: InstrumentedPromise<IdTokenResult> } | null>(null);
  if (!hasInitialData && currentUser && needsClaimsCheck) {
    const tokenHandle = userTokenCache.handle({ user: currentUser, forceRefresh }, () =>
      currentUser.getIdTokenResult(forceRefresh)
    );
    const existingTokenPromise =
      tokenReqRef.current && tokenReqRef.current.user === currentUser && tokenReqRef.current.forceRefresh === forceRefresh
        ? tokenReqRef.current.promise
        : tokenHandle.peek();
    if (suspenseEnabled) {
      tokenReqRef.current = {
        user: currentUser,
        forceRefresh,
        promise: existingTokenPromise ?? tokenHandle.getOrStart(),
      };
    } else if (existingTokenPromise) {
      tokenReqRef.current = {
        user: currentUser,
        forceRefresh,
        promise: existingTokenPromise,
      };
    } else {
      tokenReqRef.current = null;
    }
  } else {
    tokenReqRef.current = null;
  }

  React.useEffect(() => {
    if (!currentUser || !needsClaimsCheck) {
      return;
    }
    let cancelled = false;
    const tokenHandle = userTokenCache.handle({ user: currentUser, forceRefresh }, () =>
      currentUser.getIdTokenResult(forceRefresh)
    );
    const tokenPromise =
      tokenReqRef.current && tokenReqRef.current.user === currentUser && tokenReqRef.current.forceRefresh === forceRefresh
        ? tokenReqRef.current.promise
        : tokenHandle.getOrStart();

    setTimeout(() => {
      tokenHandle.clear(tokenPromise);
    }, 0);

    tokenPromise.then(
      (idTokenResult) => {
        if (!cancelled) {
          setClaimsResultState({ user: currentUser, idTokenResult });
        }
      },
      (error) => {
        if (!cancelled) {
          setClaimsResultState(() => {
            throw error;
          });
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [currentUser, needsClaimsCheck, forceRefresh]);

  const cacheKey = `${needsClaimsCheck}:${forceRefresh}`;
  const makeStatus = (
    statusObj: Omit<ObservableStatus<SigninCheckResult>, 'usable' | 'experimental_usable'>
  ): ObservableStatus<SigninCheckResult> =>
    attachUsable(statusObj, (): ReactFireUsable<SigninCheckResult> => {
      const userUsable = userStatusObj.usable as unknown as InstrumentedPromise<User | null>;
      let byKey = signinCheckUsableCache.get(userUsable);
      if (!byKey) {
        byKey = new Map();
        signinCheckUsableCache.set(userUsable, byKey);
      }
      let derived = byKey.get(cacheKey);
      if (statusObj.status === 'success') {
        if (!derived) {
          derived = createFulfilledUsable(statusObj.data);
          byKey.set(cacheKey, derived);
        } else if (derived.status === 'pending') {
          derived.status = 'fulfilled';
          derived.value = statusObj.data;
        } else if (
          derived.status === 'fulfilled' &&
          (derived.value?.signedIn !== statusObj.data.signedIn ||
            derived.value?.user !== statusObj.data.user ||
            derived.value?.hasRequiredClaims !== statusObj.data.hasRequiredClaims)
        ) {
          derived = createFulfilledUsable(statusObj.data);
          byKey.set(cacheKey, derived);
        }
        return derived;
      }
      if (!derived) {
        derived = instrumentPromise(
          userUsable.then((u) => {
            if (!u) {
              return { signedIn: false, hasRequiredClaims: false, errors: {}, user: null };
            }
            if (!needsClaimsCheck) {
              return { signedIn: true, hasRequiredClaims: true, errors: {}, user: u };
            }
            return getOrStartTokenPromise(u, forceRefresh).then((res) => computeClaimsResult(u, res));
          })
        );
        byKey.set(cacheKey, derived);
      }
      return derived;
    });

  if (userStatus === 'loading' && !hasInitialData) {
    return makeStatus({
      status: 'loading',
      hasEmitted: false,
      isComplete: false,
      data: undefined as unknown as SigninCheckResult,
      error: undefined,
      firstValuePromise,
    });
  }

  if (!currentUser) {
    return makeStatus({
      status: 'success',
      hasEmitted: true,
      isComplete: false,
      data:
        hasInitialData && userStatus === 'loading'
          ? (initialData as SigninCheckResult)
          : { signedIn: false, hasRequiredClaims: false, errors: {}, user: null },
      error: undefined,
      firstValuePromise,
    });
  }

  if (!needsClaimsCheck) {
    return makeStatus({
      status: 'success',
      hasEmitted: true,
      isComplete: false,
      data: { signedIn: true, hasRequiredClaims: true, errors: {}, user: currentUser },
      error: undefined,
      firstValuePromise,
    });
  }

  if (suspenseEnabled && !hasInitialData && tokenReqRef.current) {
    const tokenHandle = userTokenCache.handle({ user: currentUser, forceRefresh }, () =>
      currentUser.getIdTokenResult(forceRefresh)
    );
    const idTokenResult = unwrapOrSuspend(tokenReqRef.current.promise, (failed) => {
      setTimeout(() => tokenHandle.clear(failed), 0);
    });
    return makeStatus({
      status: 'success',
      hasEmitted: true,
      isComplete: false,
      data: computeClaimsResult(currentUser, idTokenResult),
      error: undefined,
      firstValuePromise,
    });
  }

  if (!hasInitialData && tokenReqRef.current?.promise.status === 'fulfilled') {
    return makeStatus({
      status: 'success',
      hasEmitted: true,
      isComplete: false,
      data: computeClaimsResult(currentUser, tokenReqRef.current.promise.value as IdTokenResult),
      error: undefined,
      firstValuePromise,
    });
  }

  if (claimsResultState.user === currentUser && claimsResultState.idTokenResult) {
    return makeStatus({
      status: 'success',
      hasEmitted: true,
      isComplete: false,
      data: computeClaimsResult(currentUser, claimsResultState.idTokenResult),
      error: undefined,
      firstValuePromise,
    });
  }

  return makeStatus({
    status: hasInitialData ? 'success' : 'loading',
    hasEmitted: hasInitialData,
    isComplete: false,
    data: initialData as SigninCheckResult,
    error: undefined,
    firstValuePromise,
  });
}

function getClaimsObjectValidator(requiredClaims: Claims): ClaimsValidator {
  return function claimsObjectValidator(userClaims) {
    const errors: { [key: string]: ReactFireError[] } = {};

    Object.keys(requiredClaims).forEach((claim) => {
      if (requiredClaims[claim] !== userClaims[claim]) {
        errors[claim] = [
          new ReactFireError('auth/missing-claim', `Expected "${requiredClaims[claim]}", but user has "${userClaims[claim]}" instead`),
        ];
      }
    });

    return {
      hasRequiredClaims: Object.keys(errors).length === 0,
      errors,
    };
  };
}

/**
 * @deprecated Use `<AuthCheck requiredClaims={...}>` instead. Will be removed in v5.0.0.
 *
 * Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
export function ClaimsCheck({ user, fallback, children, requiredClaims }: ClaimsCheckProps) {
  const suspenseMode = useSuspenseEnabledFromConfigAndContext();
  if (!suspenseMode) {
    console.warn(
      'ClaimsCheck is deprecated and only works when ReactFire is in experimental Suspense Mode. Use useSigninCheck or set suspense={true} in FirebaseAppProvider if you want to use this component.'
    );
  }

  const { data, status, error } = useIdTokenResult(user, false);

  if (status === 'loading') {
    throw new Error('ClaimsCheck must be run in Suspense mode');
  } else if (status === 'error') {
    throw error;
  }

  const { claims } = data;
  const missingClaims: { [key: string]: { expected: string; actual: string | undefined } } = {};

  if (requiredClaims) {
    Object.keys(requiredClaims).forEach((claim) => {
      if (requiredClaims[claim] !== claims[claim]) {
        missingClaims[claim] = {
          expected: requiredClaims[claim],
          actual: claims[claim]?.toString(),
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
 * Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 */
export function AuthCheck({ auth, fallback, children, requiredClaims }: AuthCheckProps): React.ReactElement {
  const { data: user } = useUser<User>(auth as Auth);

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
