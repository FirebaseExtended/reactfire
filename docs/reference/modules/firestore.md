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

▸ **preloadFirestoreDoc**(`refProvider`: (`firestore`: firebase.firestore.Firestore) => firebase.firestore.DocumentReference, `options`: { `firebaseApp`: firebase.app.App  }): *Promise*<[*SuspenseSubject*](../classes/suspensesubject.suspensesubject-1.md)<DocumentSnapshot\>\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `refProvider` | (`firestore`: firebase.firestore.Firestore) => firebase.firestore.DocumentReference |
| `options` | *object* |
| `options.firebaseApp` | firebase.app.App |

**Returns:** *Promise*<[*SuspenseSubject*](../classes/suspensesubject.suspensesubject-1.md)<DocumentSnapshot\>\>

Defined in: [src/firestore.tsx:28](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L28)

___

### useFirestoreCollection

▸ **useFirestoreCollection**<T\>(`query`: firebase.firestore.Query, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T *extends* {} ? T[] : firebase.firestore.QuerySnapshot\>

Subscribe to a Firestore collection

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | { [key: string]: *unknown*;  } |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `query` | firebase.firestore.Query |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\> |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T *extends* {} ? T[] : firebase.firestore.QuerySnapshot\>

Defined in: [src/firestore.tsx:108](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L108)

___

### useFirestoreCollectionData

▸ **useFirestoreCollectionData**<T\>(`query`: firebase.firestore.Query, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T[]\>

Subscribe to a Firestore collection and unwrap the snapshot.

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | { [key: string]: *unknown*;  } |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `query` | firebase.firestore.Query |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\> |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T[]\>

Defined in: [src/firestore.tsx:124](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L124)

___

### useFirestoreDoc

▸ **useFirestoreDoc**<T\>(`ref`: firebase.firestore.DocumentReference, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T *extends* {} ? T : firebase.firestore.DocumentSnapshot\>

Suscribe to Firestore Document changes

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | *unknown* |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | firebase.firestore.DocumentReference | Reference to the document you want to listen to |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |  |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T *extends* {} ? T : firebase.firestore.DocumentSnapshot\>

Defined in: [src/firestore.tsx:46](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L46)

___

### useFirestoreDocData

▸ **useFirestoreDocData**<T\>(`ref`: firebase.firestore.DocumentReference, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

Suscribe to Firestore Document changes

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | firebase.firestore.DocumentReference | Reference to the document you want to listen to |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |  |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

Defined in: [src/firestore.tsx:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L78)

___

### useFirestoreDocDataOnce

▸ **useFirestoreDocDataOnce**<T\>(`ref`: firebase.firestore.DocumentReference, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

Get a firestore document and don't subscribe to changes

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | *unknown* |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | firebase.firestore.DocumentReference | Reference to the document you want to get |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |  |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

Defined in: [src/firestore.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L93)

___

### useFirestoreDocOnce

▸ **useFirestoreDocOnce**<T\>(`ref`: firebase.firestore.DocumentReference, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T *extends* {} ? T : firebase.firestore.DocumentSnapshot\>

Get a firestore document and don't subscribe to changes

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | *unknown* |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | firebase.firestore.DocumentReference | Reference to the document you want to get |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |  |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T *extends* {} ? T : firebase.firestore.DocumentSnapshot\>

Defined in: [src/firestore.tsx:62](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L62)
