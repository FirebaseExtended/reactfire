[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocOnce

# Function: useFirestoreDocOnce()

> **useFirestoreDocOnce**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`DocumentSnapshot`\<`T`, `DocumentData`\>\>

Defined in: [src/firestore.tsx:53](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L53)

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
