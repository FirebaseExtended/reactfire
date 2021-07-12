[ReactFire reference docs](../README.md) / auth

# Module: auth

## Table of contents

### Interfaces

- [AuthCheckProps](../interfaces/auth.authcheckprops.md)
- [ClaimCheckErrors](../interfaces/auth.claimcheckerrors.md)
- [ClaimsCheckProps](../interfaces/auth.claimscheckprops.md)
- [ClaimsValidator](../interfaces/auth.claimsvalidator.md)
- [SignInCheckOptionsBasic](../interfaces/auth.signincheckoptionsbasic.md)
- [SignInCheckOptionsClaimsObject](../interfaces/auth.signincheckoptionsclaimsobject.md)
- [SignInCheckOptionsClaimsValidator](../interfaces/auth.signincheckoptionsclaimsvalidator.md)

### Type aliases

- [SigninCheckResult](auth.md#signincheckresult)

### Functions

- [AuthCheck](auth.md#authcheck)
- [ClaimsCheck](auth.md#claimscheck)
- [preloadUser](auth.md#preloaduser)
- [useIdTokenResult](auth.md#useidtokenresult)
- [useSigninCheck](auth.md#usesignincheck)
- [useUser](auth.md#useuser)

## Type aliases

### SigninCheckResult

Ƭ **SigninCheckResult**: { `errors`: {} ; `hasRequiredClaims`: ``false`` ; `signedIn`: ``false`` ; `user`: ``null``  } \| { `errors`: [`ClaimCheckErrors`](../interfaces/auth.claimcheckerrors.md) ; `hasRequiredClaims`: `boolean` ; `signedIn`: ``true`` ; `user`: `User`  }

#### Defined in

[src/auth.tsx:66](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L66)

## Functions

### AuthCheck

▸ **AuthCheck**(`__namedParameters`): `JSX.Element`

**`deprecated`** Use `useSignInCheck` instead

Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`AuthCheckProps`](../interfaces/auth.authcheckprops.md) |

#### Returns

`JSX.Element`

#### Defined in

[src/auth.tsx:243](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L243)

___

### ClaimsCheck

▸ **ClaimsCheck**(`__namedParameters`): `Element`

**`deprecated`** Use `useSignInCheck` instead

Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ClaimsCheckProps`](../interfaces/auth.claimscheckprops.md) |

#### Returns

`Element`

#### Defined in

[src/auth.tsx:206](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L206)

___

### preloadUser

▸ **preloadUser**(`authResolver`): `Promise`<`undefined` \| ``null`` \| `User`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `authResolver` | () => `Promise`<`Auth`\> |

#### Returns

`Promise`<`undefined` \| ``null`` \| `User`\>

#### Defined in

[src/auth.tsx:11](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L11)

___

### useIdTokenResult

▸ **useIdTokenResult**(`user`, `forceRefresh?`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`IdTokenResult`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `user` | `User` | `undefined` |
| `forceRefresh` | `boolean` | `false` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`IdTokenResult`\> | `undefined` |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`IdTokenResult`\>

#### Defined in

[src/auth.tsx:38](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L38)

___

### useSigninCheck

▸ **useSigninCheck**(`options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<[`SigninCheckResult`](auth.md#signincheckresult)\>

Subscribe to the signed-in status of a user.

```ts
const { status, data:signInCheckResult } = useSigninCheck();

if (status === 'loading') {
  return <LoadingSpinner />}

if (signInCheckResult.signedIn === true) {
  return <ProfilePage user={signInCheckResult.user}/>
} else {
  return <SignInForm />
}
```

Optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) of a user as well.

```ts
// pass in an object describing the custom claims a user must have
const {status, data: signInCheckResult} = useSignInCheck({requiredClaims: {admin: true}});

// pass in a custom claims validator function
const {status, data: signInCheckResult} = useSignInCheck({validateCustomClaims: (userClaims) => {
  // custom validation logic...
}});

// You can optionally force-refresh the token
const {status, data: signInCheckResult} = useSignInCheck({forceRefresh: true, requiredClaims: {admin: true}});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SignInCheckOptionsBasic`](../interfaces/auth.signincheckoptionsbasic.md) \| [`SignInCheckOptionsClaimsObject`](../interfaces/auth.signincheckoptionsclaimsobject.md) \| [`SignInCheckOptionsClaimsValidator`](../interfaces/auth.signincheckoptionsclaimsvalidator.md) |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<[`SigninCheckResult`](auth.md#signincheckresult)\>

#### Defined in

[src/auth.tsx:131](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L131)

___

### useUser

▸ **useUser**<`T`\>(`options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`User`\>

Subscribe to Firebase auth state changes, including token refresh

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`User`\>

#### Defined in

[src/auth.tsx:22](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L22)
