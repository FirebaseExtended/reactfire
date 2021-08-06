[ReactFire reference docs](../README.md) / sdk

# Module: sdk

## Table of contents

### Type aliases

- [PreloadOptions](sdk.md#preloadoptions)

### Variables

- [useAnalytics](sdk.md#useanalytics)
- [useAuth](sdk.md#useauth)
- [useDatabase](sdk.md#usedatabase)
- [useFirestore](sdk.md#usefirestore)
- [useFunctions](sdk.md#usefunctions)
- [useMessaging](sdk.md#usemessaging)
- [useStorage](sdk.md#usestorage)

### Functions

- [preloadAnalytics](sdk.md#preloadanalytics)
- [preloadAppCheck](sdk.md#preloadappcheck)
- [preloadAuth](sdk.md#preloadauth)
- [preloadDatabase](sdk.md#preloaddatabase)
- [preloadFirestore](sdk.md#preloadfirestore)
- [preloadFunctions](sdk.md#preloadfunctions)
- [preloadMessaging](sdk.md#preloadmessaging)
- [preloadPerformance](sdk.md#preloadperformance)
- [preloadRemoteConfig](sdk.md#preloadremoteconfig)
- [preloadStorage](sdk.md#preloadstorage)
- [useAppCheck](sdk.md#useappcheck)
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

[src/sdk.tsx:104](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L104)

## Variables

### useAnalytics

• `Const` **useAnalytics**: typeof `analytics`

#### Defined in

[src/sdk.tsx:95](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L95)

___

### useAuth

• `Const` **useAuth**: typeof `auth`

#### Defined in

[src/sdk.tsx:93](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L93)

___

### useDatabase

• `Const` **useDatabase**: typeof `database`

#### Defined in

[src/sdk.tsx:96](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L96)

___

### useFirestore

• `Const` **useFirestore**: typeof `firestore`

#### Defined in

[src/sdk.tsx:97](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L97)

___

### useFunctions

• `Const` **useFunctions**: typeof `functions`

#### Defined in

[src/sdk.tsx:98](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L98)

___

### useMessaging

• `Const` **useMessaging**: typeof `messaging`

#### Defined in

[src/sdk.tsx:99](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L99)

___

### useStorage

• `Const` **useStorage**: typeof `storage`

#### Defined in

[src/sdk.tsx:102](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L102)

## Functions

### preloadAnalytics

▸ `Const` **preloadAnalytics**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:150](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L150)

___

### preloadAppCheck

▸ `Const` **preloadAppCheck**(`options`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PreloadOptions`](sdk.md#preloadoptions)<`fn`\> |

#### Returns

`Promise`<`fn`\>

#### Defined in

[src/sdk.tsx:149](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L149)

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

[src/sdk.tsx:148](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L148)

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

[src/sdk.tsx:151](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L151)

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

[src/sdk.tsx:152](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L152)

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

[src/sdk.tsx:153](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L153)

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

[src/sdk.tsx:154](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L154)

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

[src/sdk.tsx:155](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L155)

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

[src/sdk.tsx:156](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L156)

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

[src/sdk.tsx:157](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L157)

___

### useAppCheck

▸ `Const` **useAppCheck**(`app?`): `firebase.appCheck.AppCheck`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app?` | `firebase.app.App` |

#### Returns

`firebase.appCheck.AppCheck`

#### Defined in

[src/sdk.tsx:94](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L94)

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

[src/sdk.tsx:100](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L100)

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

[src/sdk.tsx:101](https://github.com/sujishpatel/reactfire/blob/main/src/sdk.tsx#L101)
