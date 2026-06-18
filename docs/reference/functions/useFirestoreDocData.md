[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocData

# Function: useFirestoreDocData()

> **useFirestoreDocData**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T`\>

Defined in: [src/firestore.tsx:62](https://github.com/tyler-reitz/reactfire/blob/main/src/firestore.tsx#L62)

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

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T`\>
