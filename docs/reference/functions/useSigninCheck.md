[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useSigninCheck

# ~~Function: useSigninCheck()~~

> **useSigninCheck**(`options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`SigninCheckResult`](../type-aliases/SigninCheckResult.md)\>

Defined in: [src/auth.tsx:334](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L334)

Subscribe to the signed-in status of a user.

## Parameters

### options?

[`SignInCheckOptionsBasic`](../interfaces/SignInCheckOptionsBasic.md) \| [`SignInCheckOptionsClaimsObject`](../interfaces/SignInCheckOptionsClaimsObject.md) \| [`SignInCheckOptionsClaimsValidator`](../interfaces/SignInCheckOptionsClaimsValidator.md)

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`SigninCheckResult`](../type-aliases/SigninCheckResult.md)\>

## Deprecated

Use `useUser(auth)`, `useIdTokenResult(auth)`, or `<AuthCheck auth={auth} requiredClaims={...}>` instead. Will be removed in v5.0.0.
