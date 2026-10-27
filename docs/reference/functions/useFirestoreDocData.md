[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocData

# ~~Function: useFirestoreDocData()~~

> **useFirestoreDocData**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T` \| `undefined`\>

Defined in: [src/firestore.tsx:197](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L197)

Subscribe to Firestore Document changes and unwrap the document into a plain object

## Type Parameters

### T

`T` = `unknown`

## Parameters

### ref

`DocumentReference`\<`T`\>

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T` \| `undefined`\>

## Deprecated

Use `useFirestoreDoc(ref)` and read `snap.data()` / `snap.id` / `snap.exists()` directly. Will be removed in v5.0.0.
