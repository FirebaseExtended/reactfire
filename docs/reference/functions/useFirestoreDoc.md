[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreDoc

# Function: useFirestoreDoc()

> **useFirestoreDoc**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`DocumentSnapshot`\<`T`\>\>

Defined in: [src/firestore.tsx:42](https://github.com/tyler-reitz/reactfire/blob/main/src/firestore.tsx#L42)

Subscribe to Firestore Document changes

You can preload data for this hook by calling `preloadFirestoreDoc`

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
