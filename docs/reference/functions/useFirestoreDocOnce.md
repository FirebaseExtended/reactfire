[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocOnce

# Function: useFirestoreDocOnce()

> **useFirestoreDocOnce**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`DocumentSnapshot`\<`T`\>\>

Defined in: [src/firestore.tsx:52](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L52)

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

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`DocumentSnapshot`\<`T`\>\>
