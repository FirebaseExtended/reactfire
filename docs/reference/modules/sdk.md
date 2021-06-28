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

Ƭ **PreloadOptions**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `firebaseApp` | `App` |
| `setup?` | (`instanceFactory`: `T`) => `void` \| `Promise`<`any`\> |
| `suspense?` | `boolean` |

#### Defined in

[src/sdk.tsx:101](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L101)

## Variables

### analytics

• `Const` **analytics**: typeof `analytics`

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### auth

• `Const` **auth**: typeof `auth`

#### Defined in

[src/sdk.tsx:91](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L91)

___

### database

• `Const` **database**: typeof `database`

#### Defined in

[src/sdk.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L93)

___

### firestore

• `Const` **firestore**: typeof `firestore`

#### Defined in

[src/sdk.tsx:94](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L94)

___

### functions

• `Const` **functions**: typeof `functions`

#### Defined in

[src/sdk.tsx:95](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L95)

___

### messaging

• `Const` **messaging**: typeof `messaging`

#### Defined in

[src/sdk.tsx:96](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L96)

___

### storage

• `Const` **storage**: typeof `storage`

#### Defined in

[src/sdk.tsx:99](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L99)

___

### useAnalytics

• `Const` **useAnalytics**: typeof `analytics`

#### Defined in

[src/sdk.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L82)

___

### useAuth

• `Const` **useAuth**: typeof `auth`

#### Defined in

[src/sdk.tsx:81](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L81)

___

### useDatabase

• `Const` **useDatabase**: typeof `database`

#### Defined in

[src/sdk.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L83)

___

### useFirestore

• `Const` **useFirestore**: typeof `firestore`

#### Defined in

[src/sdk.tsx:84](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L84)

___

### useFunctions

• `Const` **useFunctions**: typeof `functions`

#### Defined in

[src/sdk.tsx:85](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L85)

___

### useMessaging

• `Const` **useMessaging**: typeof `messaging`

#### Defined in

[src/sdk.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L86)

___

### useStorage

• `Const` **useStorage**: typeof `storage`

#### Defined in

[src/sdk.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L89)

## Functions

### performance

▸ `Const` **performance**(`app?`): `firebase.performance.Performance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app?` | `firebase.app.App` |

#### Returns

`firebase.performance.Performance`

#### Defined in

[src/sdk.tsx:97](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L97)

___

### preloadAnalytics

▸ `Const` **preloadAnalytics**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:145](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L145)

___

### preloadAuth

▸ `Const` **preloadAuth**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:144](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L144)

___

### preloadDatabase

▸ `Const` **preloadDatabase**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:146](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L146)

___

### preloadFirestore

▸ `Const` **preloadFirestore**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:147](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L147)

___

### preloadFunctions

▸ `Const` **preloadFunctions**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:148](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L148)

___

### preloadMessaging

▸ `Const` **preloadMessaging**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:149](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L149)

___

### preloadPerformance

▸ `Const` **preloadPerformance**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:150](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L150)

___

### preloadRemoteConfig

▸ `Const` **preloadRemoteConfig**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:151](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L151)

___

### preloadStorage

▸ `Const` **preloadStorage**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:152](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L152)

___

### remoteConfig

▸ `Const` **remoteConfig**(`app?`): `firebase.remoteConfig.RemoteConfig`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app?` | `firebase.app.App` |

#### Returns

`firebase.remoteConfig.RemoteConfig`

#### Defined in

[src/sdk.tsx:98](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L98)

___

### usePerformance

▸ `Const` **usePerformance**(`app?`): `firebase.performance.Performance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app?` | `firebase.app.App` |

#### Returns

`firebase.performance.Performance`

#### Defined in

[src/sdk.tsx:87](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L87)

___

### useRemoteConfig

▸ `Const` **useRemoteConfig**(`app?`): `firebase.remoteConfig.RemoteConfig`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app?` | `firebase.app.App` |

#### Returns

`firebase.remoteConfig.RemoteConfig`

#### Defined in

[src/sdk.tsx:88](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L88)
