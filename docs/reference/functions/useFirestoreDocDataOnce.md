[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocDataOnce

# Function: useFirestoreDocDataOnce()

> **useFirestoreDocDataOnce**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T` \| `undefined`\>

Defined in: [src/firestore.tsx:74](https://github.com/tyler-reitz/reactfire/blob/main/src/firestore.tsx#L74)

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

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T` \| `undefined`\>
