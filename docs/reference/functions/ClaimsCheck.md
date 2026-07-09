[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ClaimsCheck

# ~~Function: ClaimsCheck()~~

> **ClaimsCheck**(`__namedParameters`): `Element`

Defined in: [src/auth.tsx:213](https://github.com/tyler-reitz/reactfire/blob/main/src/auth.tsx#L213)

## Parameters

### \_\_namedParameters

[`ClaimsCheckProps`](../interfaces/ClaimsCheckProps.md)

## Returns

`Element`

## Deprecated

Use `useSigninCheck` instead

Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
