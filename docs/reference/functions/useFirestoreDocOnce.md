[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocOnce

# ~~Function: useFirestoreDocOnce()~~

> **useFirestoreDocOnce**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`DocumentSnapshot`\<`T`, `DocumentData`\>\>

Defined in: [src/firestore.tsx:167](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L167)

Get a firestore document and don't subscribe to changes

## Type Parameters

### T

`T` = `DocumentData`

## Parameters

### ref

`DocumentReference`\<`T`\>

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`DocumentSnapshot`\<`T`, `DocumentData`\>\>

## Deprecated

Pass `{ once: true }` to `useFirestoreDoc(ref, { once: true })` instead. Will be removed in v5.0.0.
