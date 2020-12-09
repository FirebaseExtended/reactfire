**[reactfire](../README.md)**

> [Globals](../globals.md) / "firestore"

# Module: "firestore"

## Index

### Variables

* [cachedQueries](_firestore_.md#cachedqueries)

### Functions

* [getUniqueIdForFirestoreQuery](_firestore_.md#getuniqueidforfirestorequery)
* [preloadFirestoreDoc](_firestore_.md#preloadfirestoredoc)
* [useFirestoreCollection](_firestore_.md#usefirestorecollection)
* [useFirestoreCollectionData](_firestore_.md#usefirestorecollectiondata)
* [useFirestoreDoc](_firestore_.md#usefirestoredoc)
* [useFirestoreDocData](_firestore_.md#usefirestoredocdata)
* [useFirestoreDocDataOnce](_firestore_.md#usefirestoredocdataonce)
* [useFirestoreDocOnce](_firestore_.md#usefirestoredoconce)

## Variables

### cachedQueries

• `Const` **cachedQueries**: Array\<Query> = ((globalThis as any) as ReactFireGlobals).\_reactFireFirestoreQueryCache \|\| []

*Defined in [src/firestore.tsx:9](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L9)*

## Functions

### getUniqueIdForFirestoreQuery

▸ **getUniqueIdForFirestoreQuery**(`query`: Query): number

*Defined in [src/firestore.tsx:15](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L15)*

#### Parameters:

Name | Type |
------ | ------ |
`query` | Query |

**Returns:** number

___

### preloadFirestoreDoc

▸ **preloadFirestoreDoc**(`refProvider`: (firestore: Firestore) => DocumentReference, `options?`: undefined \| { firebaseApp?: firebase.app.App  }): Promise\<[SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<DocumentSnapshot>>

*Defined in [src/firestore.tsx:29](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L29)*

#### Parameters:

Name | Type |
------ | ------ |
`refProvider` | (firestore: Firestore) => DocumentReference |
`options?` | undefined \| { firebaseApp?: firebase.app.App  } |

**Returns:** Promise\<[SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<DocumentSnapshot>>

___

### useFirestoreCollection

▸ **useFirestoreCollection**\<T>(`query`: Query, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T *extends* {} ? T[] : QuerySnapshot>

*Defined in [src/firestore.tsx:110](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L110)*

Subscribe to a Firestore collection

#### Type parameters:

Name | Default |
------ | ------ |
`T` | { [key:string]: unknown;  } |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`query` | Query | - |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T *extends* {} ? T[] : QuerySnapshot>

___

### useFirestoreCollectionData

▸ **useFirestoreCollectionData**\<T>(`query`: Query, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T[]>

*Defined in [src/firestore.tsx:126](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L126)*

Subscribe to a Firestore collection and unwrap the snapshot.

#### Type parameters:

Name | Default |
------ | ------ |
`T` | { [key:string]: unknown;  } |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`query` | Query | - |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T[]>

___

### useFirestoreDoc

▸ **useFirestoreDoc**\<T>(`ref`: DocumentReference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T *extends* {} ? T : DocumentSnapshot>

*Defined in [src/firestore.tsx:48](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L48)*

Suscribe to Firestore Document changes

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | DocumentReference | Reference to the document you want to listen to |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T *extends* {} ? T : DocumentSnapshot>

___

### useFirestoreDocData

▸ **useFirestoreDocData**\<T>(`ref`: DocumentReference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

*Defined in [src/firestore.tsx:80](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L80)*

Suscribe to Firestore Document changes

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | DocumentReference | Reference to the document you want to listen to |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

___

### useFirestoreDocDataOnce

▸ **useFirestoreDocDataOnce**\<T>(`ref`: DocumentReference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

*Defined in [src/firestore.tsx:95](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L95)*

Get a firestore document and don't subscribe to changes

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | DocumentReference | Reference to the document you want to get |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

___

### useFirestoreDocOnce

▸ **useFirestoreDocOnce**\<T>(`ref`: DocumentReference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T *extends* {} ? T : DocumentSnapshot>

*Defined in [src/firestore.tsx:64](https://github.com/FirebaseExtended/reactfire/blob/master/src/firestore.tsx#L64)*

Get a firestore document and don't subscribe to changes

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | DocumentReference | Reference to the document you want to get |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T *extends* {} ? T : DocumentSnapshot>
