[ReactFire reference docs](../README.md) / sdk

# Module: sdk

## Table of contents

### Functions

- [AnalyticsProvider](sdk.md#analyticsprovider)
- [AuthProvider](sdk.md#authprovider)
- [DatabaseProvider](sdk.md#databaseprovider)
- [FirestoreProvider](sdk.md#firestoreprovider)
- [PerformanceProvider](sdk.md#performanceprovider)
- [RemoteConfigProvider](sdk.md#remoteconfigprovider)
- [StorageProvider](sdk.md#storageprovider)
- [useAnalytics](sdk.md#useanalytics)
- [useAuth](sdk.md#useauth)
- [useDatabase](sdk.md#usedatabase)
- [useFirestore](sdk.md#usefirestore)
- [useInitAnalytics](sdk.md#useinitanalytics)
- [useInitAuth](sdk.md#useinitauth)
- [useInitDatabase](sdk.md#useinitdatabase)
- [useInitFirestore](sdk.md#useinitfirestore)
- [useInitPerformance](sdk.md#useinitperformance)
- [useInitRemoteConfig](sdk.md#useinitremoteconfig)
- [useInitStorage](sdk.md#useinitstorage)
- [usePerformance](sdk.md#useperformance)
- [useRemoteConfig](sdk.md#useremoteconfig)
- [useStorage](sdk.md#usestorage)

## Functions

### AnalyticsProvider

▸ `Const` **AnalyticsProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:69](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L69)

___

### AuthProvider

▸ `Const` **AuthProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:68](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L68)

___

### DatabaseProvider

▸ `Const` **DatabaseProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:70](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L70)

___

### FirestoreProvider

▸ `Const` **FirestoreProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:71](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L71)

___

### PerformanceProvider

▸ `Const` **PerformanceProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:72](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L72)

___

### RemoteConfigProvider

▸ `Const` **RemoteConfigProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:74](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L74)

___

### StorageProvider

▸ `Const` **StorageProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:73](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L73)

___

### useAnalytics

▸ `Const` **useAnalytics**(): `Analytics`

#### Returns

`Analytics`

#### Defined in

[src/sdk.tsx:77](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L77)

___

### useAuth

▸ `Const` **useAuth**(): `Auth`

#### Returns

`Auth`

#### Defined in

[src/sdk.tsx:76](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L76)

___

### useDatabase

▸ `Const` **useDatabase**(): `Database`

#### Returns

`Database`

#### Defined in

[src/sdk.tsx:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L78)

___

### useFirestore

▸ `Const` **useFirestore**(): `Firestore`

#### Returns

`Firestore`

#### Defined in

[src/sdk.tsx:79](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L79)

___

### useInitAnalytics

▸ `Const` **useInitAnalytics**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Analytics`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Analytics`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`Analytics`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Analytics`\>

#### Defined in

[src/sdk.tsx:90](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L90)

___

### useInitAuth

▸ `Const` **useInitAuth**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Auth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Auth`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`Auth`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Auth`\>

#### Defined in

[src/sdk.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L89)

___

### useInitDatabase

▸ `Const` **useInitDatabase**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Database`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Database`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`Database`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Database`\>

#### Defined in

[src/sdk.tsx:91](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L91)

___

### useInitFirestore

▸ `Const` **useInitFirestore**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Firestore`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Firestore`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`Firestore`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`Firestore`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitPerformance

▸ `Const` **useInitPerformance**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`FirebasePerformance`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`FirebasePerformance`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`FirebasePerformance`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`FirebasePerformance`\>

#### Defined in

[src/sdk.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L93)

___

### useInitRemoteConfig

▸ `Const` **useInitRemoteConfig**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`RemoteConfig`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`RemoteConfig`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`RemoteConfig`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`RemoteConfig`\>

#### Defined in

[src/sdk.tsx:95](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L95)

___

### useInitStorage

▸ `Const` **useInitStorage**(`initializer`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`FirebaseStorage`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`FirebaseStorage`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`FirebaseStorage`\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`FirebaseStorage`\>

#### Defined in

[src/sdk.tsx:97](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L97)

___

### usePerformance

▸ `Const` **usePerformance**(): `FirebasePerformance`

#### Returns

`FirebasePerformance`

#### Defined in

[src/sdk.tsx:80](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L80)

___

### useRemoteConfig

▸ `Const` **useRemoteConfig**(): `RemoteConfig`

#### Returns

`RemoteConfig`

#### Defined in

[src/sdk.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L82)

___

### useStorage

▸ `Const` **useStorage**(): `FirebaseStorage`

#### Returns

`FirebaseStorage`

#### Defined in

[src/sdk.tsx:81](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L81)
