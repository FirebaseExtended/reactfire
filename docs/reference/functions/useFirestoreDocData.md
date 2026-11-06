[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDocData

# Function: useFirestoreDocData()

> **useFirestoreDocData**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T` \| `undefined`\>

Defined in: [src/firestore.tsx:63](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L63)

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
