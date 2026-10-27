[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreCollectionData

# ~~Function: useFirestoreCollectionData()~~

> **useFirestoreCollectionData**\<`T`\>(`query`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`[]\>

Defined in: [src/firestore.tsx:335](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L335)

Subscribe to a Firestore collection and unwrap the snapshot into an array.

## Type Parameters

### T

`T` = `DocumentData`

## Parameters

### query

`Query`\<`T`\>

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`[]\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`[]\>

## Deprecated

Use `useFirestoreCollection(query)` and map `snap.docs` directly. Will be removed in v5.0.0.
