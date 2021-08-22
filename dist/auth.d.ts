import * as React from 'react';
import { ReactFireOptions, ObservableStatus } from './';
import type { Auth, User, IdTokenResult } from 'firebase/auth';
declare type Claims = IdTokenResult['claims'];
export declare function preloadUser(authResolver: () => Promise<Auth>): Promise<User | null | undefined>;
/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param options
 */
export declare function useUser<T = unknown>(options?: ReactFireOptions<T>): ObservableStatus<User | null>;
export declare function useIdTokenResult(user: User, forceRefresh?: boolean, options?: ReactFireOptions<IdTokenResult>): ObservableStatus<IdTokenResult>;
export interface AuthCheckProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
    requiredClaims?: Object;
}
export interface ClaimsCheckProps {
    user: User;
    fallback: React.ReactNode;
    children: React.ReactNode;
    requiredClaims: {
        [key: string]: any;
    };
}
export interface ClaimCheckErrors {
    [key: string]: any[];
}
export declare type SigninCheckResult = {
    signedIn: false;
    hasRequiredClaims: false;
    errors: {};
    user: null;
} | {
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
export declare function useSigninCheck(options?: SignInCheckOptionsBasic | SignInCheckOptionsClaimsObject | SignInCheckOptionsClaimsValidator): ObservableStatus<SigninCheckResult>;
/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
export declare function ClaimsCheck({ user, fallback, children, requiredClaims }: ClaimsCheckProps): JSX.Element;
/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
export declare function AuthCheck({ fallback, children, requiredClaims }: AuthCheckProps): JSX.Element;
export {};
