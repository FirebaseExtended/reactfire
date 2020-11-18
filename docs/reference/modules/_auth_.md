**[reactfire](../README.md)**

> [Globals](../globals.md) / "auth"

# Module: "auth"

## Index

### Interfaces

* [AuthCheckProps](../interfaces/_auth_.authcheckprops.md)
* [ClaimsCheckProps](../interfaces/_auth_.claimscheckprops.md)

### Functions

* [AuthCheck](_auth_.md#authcheck)
* [ClaimsCheck](_auth_.md#claimscheck)
* [preloadUser](_auth_.md#preloaduser)
* [useIdTokenResult](_auth_.md#useidtokenresult)
* [useUser](_auth_.md#useuser)

## Functions

### AuthCheck

▸ **AuthCheck**(`__namedParameters`: { auth: undefined \| Auth ; children: ReactNode ; fallback: ReactNode ; requiredClaims: undefined \| Object  }): Element

*Defined in [src/auth.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/auth.tsx#L89)*

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { auth: undefined \| Auth ; children: ReactNode ; fallback: ReactNode ; requiredClaims: undefined \| Object  } |

**Returns:** Element

___

### ClaimsCheck

▸ **ClaimsCheck**(`__namedParameters`: { children: ReactNode ; fallback: ReactNode ; requiredClaims: undefined \| { [key:string]: any;  } ; user: User  }): Element

*Defined in [src/auth.tsx:66](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/auth.tsx#L66)*

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { children: ReactNode ; fallback: ReactNode ; requiredClaims: undefined \| { [key:string]: any;  } ; user: User  } |

**Returns:** Element

___

### preloadUser

▸ **preloadUser**(`options?`: undefined \| { firebaseApp?: firebase.app.App  }): Promise\<User>

*Defined in [src/auth.tsx:8](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/auth.tsx#L8)*

#### Parameters:

Name | Type |
------ | ------ |
`options?` | undefined \| { firebaseApp?: firebase.app.App  } |

**Returns:** Promise\<User>

___

### useIdTokenResult

▸ **useIdTokenResult**(`user`: User, `forceRefresh?`: boolean, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<IdTokenResult>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<IdTokenResult>

*Defined in [src/auth.tsx:37](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/auth.tsx#L37)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`user` | User | - |
`forceRefresh` | boolean | false |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<IdTokenResult> | - |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<IdTokenResult>

___

### useUser

▸ **useUser**\<T>(`auth?`: auth.Auth, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<User>

*Defined in [src/auth.tsx:24](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/auth.tsx#L24)*

Subscribe to Firebase auth state changes, including token refresh

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`auth?` | auth.Auth | the [firebase.auth](https://firebase.google.com/docs/reference/js/firebase.auth) object |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<User>
