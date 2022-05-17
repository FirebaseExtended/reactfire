[ReactFire reference docs](../README.md) / firestore

# Module: firestore

## Table of contents

### Functions

- [preloadFirestoreDoc](firestore.md#preloadfirestoredoc)
- [useFirestoreCollection](firestore.md#usefirestorecollection)
- [useFirestoreCollectionData](firestore.md#usefirestorecollectiondata)
- [useFirestoreDoc](firestore.md#usefirestoredoc)
- [useFirestoreDocData](firestore.md#usefirestoredocdata)
- [useFirestoreDocDataOnce](firestore.md#usefirestoredocdataonce)
- [useFirestoreDocOnce](firestore.md#usefirestoredoconce)

## Functions

### preloadFirestoreDoc

▸ **preloadFirestoreDoc**(`refProvider`): `Promise`<[`SuspenseSubject`](../classes/SuspenseSubject.SuspenseSubject-1.md)<`DocumentSnapshot`<`DocumentData`\>\>\>

Preload a subscription to a Firestore document reference.

Use this to warm up `useFirestoreDoc` for a specific document

#### Parameters

| Name | Type |
| :------ | :------ |
| `refProvider` | () => `Promise`<`DocumentReference`\> |

#### Returns

`Promise`<[`SuspenseSubject`](../classes/SuspenseSubject.SuspenseSubject-1.md)<`DocumentSnapshot`<`DocumentData`\>\>\>

#### Defined in

[src/firestore.tsx:28](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L28)

___

### useFirestoreCollection

▸ **useFirestoreCollection**<`T`\>(`query`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`QuerySnapshot`<`T`\>\>

Subscribe to a Firestore collection

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `FirestoreQuery`<`T`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`QuerySnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L86)

___

### useFirestoreCollectionData

▸ **useFirestoreCollectionData**<`T`\>(`query`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`T`[]\>

Subscribe to a Firestore collection and unwrap the snapshot into an array.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `FirestoreQuery`<`T`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`T`[]\>

#### Defined in

[src/firestore.tsx:96](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L96)

___

### useFirestoreDoc

▸ **useFirestoreDoc**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`DocumentSnapshot`<`T`\>\>

Suscribe to Firestore Document changes

You can preload data for this hook by calling `preloadFirestoreDoc`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`DocumentSnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L42)

___

### useFirestoreDocData

▸ **useFirestoreDocData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

Suscribe to Firestore Document changes and unwrap the document into a plain object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

#### Defined in

[src/firestore.tsx:62](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L62)

___

### useFirestoreDocDataOnce

▸ **useFirestoreDocDataOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

#### Defined in

[src/firestore.tsx:74](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L74)

___

### useFirestoreDocOnce

▸ **useFirestoreDocOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`DocumentSnapshot`<`T`\>\>

Get a firestore document and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`DocumentSnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:52](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L52)
