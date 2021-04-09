[ReactFire reference docs](../README.md) / sdk

# Module: sdk

## Table of contents

### Type aliases

- [PreloadOptions](sdk.md#preloadoptions)

### Variables

- [analytics](sdk.md#analytics)
- [auth](sdk.md#auth)
- [database](sdk.md#database)
- [firestore](sdk.md#firestore)
- [functions](sdk.md#functions)
- [messaging](sdk.md#messaging)
- [storage](sdk.md#storage)
- [useAnalytics](sdk.md#useanalytics)
- [useAuth](sdk.md#useauth)
- [useDatabase](sdk.md#usedatabase)
- [useFirestore](sdk.md#usefirestore)
- [useFunctions](sdk.md#usefunctions)
- [useMessaging](sdk.md#usemessaging)
- [useStorage](sdk.md#usestorage)

### Functions

- [performance](sdk.md#performance)
- [preloadAnalytics](sdk.md#preloadanalytics)
- [preloadAuth](sdk.md#preloadauth)
- [preloadDatabase](sdk.md#preloaddatabase)
- [preloadFirestore](sdk.md#preloadfirestore)
- [preloadFunctions](sdk.md#preloadfunctions)
- [preloadMessaging](sdk.md#preloadmessaging)
- [preloadPerformance](sdk.md#preloadperformance)
- [preloadRemoteConfig](sdk.md#preloadremoteconfig)
- [preloadStorage](sdk.md#preloadstorage)
- [remoteConfig](sdk.md#remoteconfig)
- [usePerformance](sdk.md#useperformance)
- [useRemoteConfig](sdk.md#useremoteconfig)

## Type aliases

### PreloadOptions

Ƭ **PreloadOptions**<T\>: *object*

#### Type parameters:

Name |
:------ |
`T` |

#### Type declaration:

Name | Type |
:------ | :------ |
`firebaseApp` | App |
`setup`? | (`instanceFactory`: T) => *void* \| *Promise*<any\> |
`suspense`? | *boolean* |

Defined in: [src/sdk.tsx:99](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L99)

## Variables

### analytics

• `Const` **analytics**: *typeof* analytics

Defined in: [src/sdk.tsx:90](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L90)

___

### auth

• `Const` **auth**: *typeof* auth

Defined in: [src/sdk.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L89)

___

### database

• `Const` **database**: *typeof* database

Defined in: [src/sdk.tsx:91](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L91)

___

### firestore

• `Const` **firestore**: *typeof* firestore

Defined in: [src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### functions

• `Const` **functions**: *typeof* functions

Defined in: [src/sdk.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L93)

___

### messaging

• `Const` **messaging**: *typeof* messaging

Defined in: [src/sdk.tsx:94](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L94)

___

### storage

• `Const` **storage**: *typeof* storage

Defined in: [src/sdk.tsx:97](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L97)

___

### useAnalytics

• `Const` **useAnalytics**: *typeof* analytics

Defined in: [src/sdk.tsx:80](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L80)

___

### useAuth

• `Const` **useAuth**: *typeof* auth

Defined in: [src/sdk.tsx:79](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L79)

___

### useDatabase

• `Const` **useDatabase**: *typeof* database

Defined in: [src/sdk.tsx:81](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L81)

___

### useFirestore

• `Const` **useFirestore**: *typeof* firestore

Defined in: [src/sdk.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L82)

___

### useFunctions

• `Const` **useFunctions**: *typeof* functions

Defined in: [src/sdk.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L83)

___

### useMessaging

• `Const` **useMessaging**: *typeof* messaging

Defined in: [src/sdk.tsx:84](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L84)

___

### useStorage

• `Const` **useStorage**: *typeof* storage

Defined in: [src/sdk.tsx:87](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L87)

## Functions

### performance

▸ `Const`**performance**(`app?`: firebase.app.App): firebase.performance.Performance

#### Parameters:

Name | Type |
:------ | :------ |
`app?` | firebase.app.App |

**Returns:** firebase.performance.Performance

Defined in: [src/sdk.tsx:95](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L95)

___

### preloadAnalytics

▸ `Const`**preloadAnalytics**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<() => Analytics\>): *Promise*<() => Analytics\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<() => Analytics\> |

**Returns:** *Promise*<() => Analytics\>

Defined in: [src/sdk.tsx:141](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L141)

___

### preloadAuth

▸ `Const`**preloadAuth**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<() => Auth\>): *Promise*<() => Auth\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<() => Auth\> |

**Returns:** *Promise*<() => Auth\>

Defined in: [src/sdk.tsx:140](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L140)

___

### preloadDatabase

▸ `Const`**preloadDatabase**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<(`url?`: *string*) => Database\>): *Promise*<(`url?`: *string*) => Database\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<(`url?`: *string*) => Database\> |

**Returns:** *Promise*<(`url?`: *string*) => Database\>

Defined in: [src/sdk.tsx:142](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L142)

___

### preloadFirestore

▸ `Const`**preloadFirestore**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<() => *Firestore*\>): *Promise*<() => *Firestore*\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<() => *Firestore*\> |

**Returns:** *Promise*<() => *Firestore*\>

Defined in: [src/sdk.tsx:143](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L143)

___

### preloadFunctions

▸ `Const`**preloadFunctions**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<(`regionOrCustomDomain?`: *string*) => *Functions*\>): *Promise*<(`regionOrCustomDomain?`: *string*) => *Functions*\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<(`regionOrCustomDomain?`: *string*) => *Functions*\> |

**Returns:** *Promise*<(`regionOrCustomDomain?`: *string*) => *Functions*\>

Defined in: [src/sdk.tsx:144](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L144)

___

### preloadMessaging

▸ `Const`**preloadMessaging**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<() => Messaging\>): *Promise*<() => Messaging\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<() => Messaging\> |

**Returns:** *Promise*<() => Messaging\>

Defined in: [src/sdk.tsx:145](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L145)

___

### preloadPerformance

▸ `Const`**preloadPerformance**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<() => Performance\>): *Promise*<() => Performance\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<() => Performance\> |

**Returns:** *Promise*<() => Performance\>

Defined in: [src/sdk.tsx:146](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L146)

___

### preloadRemoteConfig

▸ `Const`**preloadRemoteConfig**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<() => RemoteConfig\>): *Promise*<() => RemoteConfig\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<() => RemoteConfig\> |

**Returns:** *Promise*<() => RemoteConfig\>

Defined in: [src/sdk.tsx:147](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L147)

___

### preloadStorage

▸ `Const`**preloadStorage**(`options`: [*PreloadOptions*](sdk.md#preloadoptions)<(`url?`: *string*) => Storage\>): *Promise*<(`url?`: *string*) => Storage\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*PreloadOptions*](sdk.md#preloadoptions)<(`url?`: *string*) => Storage\> |

**Returns:** *Promise*<(`url?`: *string*) => Storage\>

Defined in: [src/sdk.tsx:148](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L148)

___

### remoteConfig

▸ `Const`**remoteConfig**(`app?`: firebase.app.App): firebase.remoteConfig.RemoteConfig

#### Parameters:

Name | Type |
:------ | :------ |
`app?` | firebase.app.App |

**Returns:** firebase.remoteConfig.RemoteConfig

Defined in: [src/sdk.tsx:96](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L96)

___

### usePerformance

▸ `Const`**usePerformance**(`app?`: firebase.app.App): firebase.performance.Performance

#### Parameters:

Name | Type |
:------ | :------ |
`app?` | firebase.app.App |

**Returns:** firebase.performance.Performance

Defined in: [src/sdk.tsx:85](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L85)

___

### useRemoteConfig

▸ `Const`**useRemoteConfig**(`app?`: firebase.app.App): firebase.remoteConfig.RemoteConfig

#### Parameters:

Name | Type |
:------ | :------ |
`app?` | firebase.app.App |

**Returns:** firebase.remoteConfig.RemoteConfig

Defined in: [src/sdk.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L86)
