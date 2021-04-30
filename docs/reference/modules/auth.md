[ReactFire reference docs](../README.md) / auth

# Module: auth

## Table of contents

### Interfaces

- [AuthCheckProps](../interfaces/auth.authcheckprops.md)
- [ClaimsCheckProps](../interfaces/auth.claimscheckprops.md)
- [SignInCheckOptions](../interfaces/auth.signincheckoptions.md)

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

Ƭ **SigninCheckResult**: { `hasRequiredClaims`: ``false`` ; `signedIn`: ``false``  } \| { `hasRequiredClaims`: *boolean* ; `missingClaims?`: MissingClaims ; `signedIn`: ``true`` ; `user`: firebase.User  }

Defined in: [src/auth.tsx:70](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L70)

## Functions

### AuthCheck

▸ **AuthCheck**(`__namedParameters`: [*AuthCheckProps*](../interfaces/auth.authcheckprops.md)): JSX.Element

**`deprecated`** Use `useSignInCheck` instead

Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).

#### Parameters:

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [*AuthCheckProps*](../interfaces/auth.authcheckprops.md) |

**Returns:** JSX.Element

Defined in: [src/auth.tsx:199](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L199)

___

### ClaimsCheck

▸ **ClaimsCheck**(`__namedParameters`: [*ClaimsCheckProps*](../interfaces/auth.claimscheckprops.md)): *Element*

**`deprecated`** Use `useSignInCheck` instead

Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).

#### Parameters:

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [*ClaimsCheckProps*](../interfaces/auth.claimscheckprops.md) |

**Returns:** *Element*

Defined in: [src/auth.tsx:169](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L169)

___

### preloadUser

▸ **preloadUser**(`options`: { `firebaseApp`: firebase.app.App  }): *Promise*<User\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `options` | *object* |
| `options.firebaseApp` | firebase.app.App |

**Returns:** *Promise*<User\>

Defined in: [src/auth.tsx:8](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L8)

___

### useIdTokenResult

▸ **useIdTokenResult**(`user`: firebase.User, `forceRefresh?`: *boolean*, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<firebase.auth.IdTokenResult\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<firebase.auth.IdTokenResult\>

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `user` | firebase.User | - |
| `forceRefresh` | *boolean* | false |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<firebase.auth.IdTokenResult\> | - |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<firebase.auth.IdTokenResult\>

Defined in: [src/auth.tsx:38](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L38)

___

### useSigninCheck

▸ **useSigninCheck**(`options?`: [*SignInCheckOptions*](../interfaces/auth.signincheckoptions.md)): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<[*SigninCheckResult*](auth.md#signincheckresult)\>

Subscribe to the signed-in status of a user.

Simple use case:

```jsx
function UserFavorites() {
   const {status, data: signInCheckResult} = useSigninCheck();

   if (status === 'loading') {
     return <LoadingSpinner />
   }

   if (signInCheckResult.signedIn === true) {
     return <FavoritesList />
   } else {
     return <SignInForm />
   }
}
```

Advanced: You can also optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims). Example:

```jsx
function ProductPricesAdminPanel() {
   const {status, data: signInCheckResult} = useSigninCheck({requiredClaims: {admin: true, canModifyPrices: true}});

   if (status === 'loading') {
     return <LoadingSpinner />
   }

   if (signInCheckResult.signedIn && signInCheckResult.hasRequiredClaims) {
     return <FavoritesList />
   } else {
     console.warn('missing claims', signInCheckResult.missingClaims);
     return <SignInForm />
   }
}
```

#### Parameters:

| Name | Type |
| :------ | :------ |
| `options?` | [*SignInCheckOptions*](../interfaces/auth.signincheckoptions.md) |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<[*SigninCheckResult*](auth.md#signincheckresult)\>

Defined in: [src/auth.tsx:127](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L127)

___

### useUser

▸ **useUser**<T\>(`options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<firebase.User\>

Subscribe to Firebase auth state changes, including token refresh

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | *unknown* |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<firebase.User\>

Defined in: [src/auth.tsx:22](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L22)
