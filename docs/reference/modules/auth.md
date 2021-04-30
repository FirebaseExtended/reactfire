[ReactFire reference docs](../README.md) / auth

# Module: auth

## Table of contents

### Interfaces

- [AuthCheckProps](../interfaces/auth.authcheckprops.md)
- [ClaimsCheckProps](../interfaces/auth.claimscheckprops.md)

### Functions

- [AuthCheck](auth.md#authcheck)
- [ClaimsCheck](auth.md#claimscheck)
- [preloadUser](auth.md#preloaduser)
- [useIdTokenResult](auth.md#useidtokenresult)
- [useUser](auth.md#useuser)

## Functions

### AuthCheck

▸ **AuthCheck**(`__namedParameters`: [*AuthCheckProps*](../interfaces/auth.authcheckprops.md)): JSX.Element

#### Parameters:

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [*AuthCheckProps*](../interfaces/auth.authcheckprops.md) |

**Returns:** JSX.Element

Defined in: [src/auth.tsx:88](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L88)

___

### ClaimsCheck

▸ **ClaimsCheck**(`__namedParameters`: [*ClaimsCheckProps*](../interfaces/auth.claimscheckprops.md)): *Element*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [*ClaimsCheckProps*](../interfaces/auth.claimscheckprops.md) |

**Returns:** *Element*

Defined in: [src/auth.tsx:65](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L65)

___

### preloadUser

▸ **preloadUser**(`options`: { `firebaseApp`: firebase.app.App  }): *Promise*<User\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `options` | *object* |
| `options.firebaseApp` | firebase.app.App |

**Returns:** *Promise*<User\>

Defined in: [src/auth.tsx:7](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L7)

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

Defined in: [src/auth.tsx:37](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L37)

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

Defined in: [src/auth.tsx:21](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L21)
