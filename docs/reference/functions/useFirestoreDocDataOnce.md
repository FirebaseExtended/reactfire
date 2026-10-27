[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocDataOnce

# ~~Function: useFirestoreDocDataOnce()~~

> **useFirestoreDocDataOnce**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T` \| `undefined`\>

Defined in: [src/firestore.tsx:229](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L229)

Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes

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

Use `useFirestoreDoc(ref, { once: true })` and read `snap.data()` / `snap.id` directly. Will be removed in v5.0.0.
