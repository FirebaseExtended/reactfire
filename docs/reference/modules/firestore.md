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

▸ **preloadFirestoreDoc**(`refProvider`, `options`): `Promise`<[`SuspenseSubject`](../classes/SuspenseSubject.SuspenseSubject-1.md)<`DocumentSnapshot`<`DocumentData`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `refProvider` | (`firestore`: `firebase.firestore.Firestore`) => `firebase.firestore.DocumentReference` |
| `options` | `Object` |
| `options.firebaseApp` | `firebase.app.App` |

#### Returns

`Promise`<[`SuspenseSubject`](../classes/SuspenseSubject.SuspenseSubject-1.md)<`DocumentSnapshot`<`DocumentData`\>\>\>

#### Defined in

[src/firestore.tsx:28](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L28)

___

### useFirestoreCollection

▸ **useFirestoreCollection**<`T`\>(`query`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`firebase.firestore.QuerySnapshot`<`T`\>\>

Subscribe to a Firestore collection

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `firebase.firestore.Query` |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`firebase.firestore.QuerySnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:108](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L108)

___

### useFirestoreCollectionData

▸ **useFirestoreCollectionData**<`T`\>(`query`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T`[]\>

Subscribe to a Firestore collection and unwrap the snapshot.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { [key: string]: `unknown`;  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `firebase.firestore.Query` |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T`[]\>

#### Defined in

[src/firestore.tsx:124](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L124)

___

### useFirestoreDoc

▸ **useFirestoreDoc**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`firebase.firestore.DocumentSnapshot`<`T`\>\>

Suscribe to Firestore Document changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `firebase.firestore.DocumentReference` | Reference to the document you want to listen to |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`firebase.firestore.DocumentSnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:46](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L46)

___

### useFirestoreDocData

▸ **useFirestoreDocData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T`\>

Suscribe to Firestore Document changes

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `firebase.firestore.DocumentReference` | Reference to the document you want to listen to |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T`\>

#### Defined in

[src/firestore.tsx:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L78)

___

### useFirestoreDocDataOnce

▸ **useFirestoreDocDataOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T`\>

Get a firestore document and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `firebase.firestore.DocumentReference` | Reference to the document you want to get |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T`\>

#### Defined in

[src/firestore.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L93)

___

### useFirestoreDocOnce

▸ **useFirestoreDocOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T` extends {} ? `T` : `firebase.firestore.DocumentSnapshot`\>

Get a firestore document and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `firebase.firestore.DocumentReference` | Reference to the document you want to get |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`T` extends {} ? `T` : `firebase.firestore.DocumentSnapshot`\>

#### Defined in

[src/firestore.tsx:62](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L62)
