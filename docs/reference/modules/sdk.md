[ReactFire reference docs](../README.md) / sdk

# Module: sdk

## Table of contents

### Functions

- [AuthProvider](sdk.md#authprovider)
- [DatabaseProvider](sdk.md#databaseprovider)
- [FirestoreProvider](sdk.md#firestoreprovider)
- [PerformanceProvider](sdk.md#performanceprovider)
- [RemoteConfigProvider](sdk.md#remoteconfigprovider)
- [StorageProvider](sdk.md#storageprovider)
- [useAuth](sdk.md#useauth)
- [useDatabase](sdk.md#usedatabase)
- [useFirestore](sdk.md#usefirestore)
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

### AuthProvider

▸ `Const` **AuthProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`Object`\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L82)

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

[src/sdk.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L83)

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

[src/sdk.tsx:84](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L84)

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

[src/sdk.tsx:85](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L85)

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

[src/sdk.tsx:87](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L87)

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

[src/sdk.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L86)

___

### useAuth

▸ `Const` **useAuth**(): `Auth`

#### Returns

`Auth`

#### Defined in

[src/sdk.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L89)

___

### useDatabase

▸ `Const` **useDatabase**(): `Database`

#### Returns

`Database`

#### Defined in

[src/sdk.tsx:90](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L90)

___

### useFirestore

▸ `Const` **useFirestore**(): `Firestore`

#### Returns

`Firestore`

#### Defined in

[src/sdk.tsx:91](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L91)

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

[src/sdk.tsx:101](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L101)

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

[src/sdk.tsx:102](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L102)

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

[src/sdk.tsx:103](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L103)

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

[src/sdk.tsx:104](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L104)

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

[src/sdk.tsx:106](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L106)

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

[src/sdk.tsx:108](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L108)

___

### usePerformance

▸ `Const` **usePerformance**(): `FirebasePerformance`

#### Returns

`FirebasePerformance`

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useRemoteConfig

▸ `Const` **useRemoteConfig**(): `RemoteConfig`

#### Returns

`RemoteConfig`

#### Defined in

[src/sdk.tsx:94](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L94)

___

### useStorage

▸ `Const` **useStorage**(): `FirebaseStorage`

#### Returns

`FirebaseStorage`

#### Defined in

[src/sdk.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L93)
