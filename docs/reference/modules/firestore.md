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

▸ **preloadFirestoreDoc**(`refProvider`): `Promise`<[`SuspenseSubject`](../classes/suspensesubject.suspensesubject-1.md)<`DocumentSnapshot`<`DocumentData`\>\>\>

Preload a subscription to a Firestore document reference.

Use this to warm up `useFirestoreDoc` for a specific document

#### Parameters

| Name | Type |
| :------ | :------ |
| `refProvider` | () => `Promise`<`DocumentReference`\> |

#### Returns

`Promise`<[`SuspenseSubject`](../classes/suspensesubject.suspensesubject-1.md)<`DocumentSnapshot`<`DocumentData`\>\>\>

#### Defined in

[src/firestore.tsx:28](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L28)

___

### useFirestoreCollection

▸ **useFirestoreCollection**<`T`\>(`query`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`QuerySnapshot`<`T`\>\>

Subscribe to a Firestore collection

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `FirestoreQuery` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`QuerySnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L89)

___

### useFirestoreCollectionData

▸ **useFirestoreCollectionData**<`T`\>(`query`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`[]\>

Subscribe to a Firestore collection and unwrap the snapshot into an array.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { [key: string]: `unknown`;  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `FirestoreQuery` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`[]\>

#### Defined in

[src/firestore.tsx:99](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L99)

___

### useFirestoreDoc

▸ **useFirestoreDoc**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`DocumentSnapshot`<`T`\>\>

Suscribe to Firestore Document changes

You can preload data for this hook by calling `preloadFirestoreDoc`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`DocumentSnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L42)

___

### useFirestoreDocData

▸ **useFirestoreDocData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`\>

Suscribe to Firestore Document changes and unwrap the document into a plain object

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`\>

#### Defined in

[src/firestore.tsx:65](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L65)

___

### useFirestoreDocDataOnce

▸ **useFirestoreDocDataOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`\>

Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`\>

#### Defined in

[src/firestore.tsx:77](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L77)

___

### useFirestoreDocOnce

▸ **useFirestoreDocOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T` extends {} ? `T` : `DocumentSnapshot`\>

Get a firestore document and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference` |
| `options?` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T` extends {} ? `T` : `DocumentSnapshot`\>

#### Defined in

[src/firestore.tsx:52](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L52)
