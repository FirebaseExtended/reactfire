[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / AuthCheck

# ~~Function: AuthCheck()~~

> **AuthCheck**(`__namedParameters`): `Element`

Defined in: [src/auth.tsx:257](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L257)

## Parameters

### \_\_namedParameters

[`AuthCheckProps`](../interfaces/AuthCheckProps.md)

## Returns

`Element`

## Deprecated

Use `useSigninCheck` instead

Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
