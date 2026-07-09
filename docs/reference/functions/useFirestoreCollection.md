[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useFirestoreCollection

# Function: useFirestoreCollection()

> **useFirestoreCollection**\<`T`\>(`query`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`QuerySnapshot`\<`T`, `DocumentData`\>\>

Defined in: [src/firestore.tsx:86](https://github.com/tyler-reitz/reactfire/blob/main/src/firestore.tsx#L86)

Subscribe to a Firestore collection

## Type Parameters

### T

`T` = `DocumentData`

## Parameters

### query

`Query`\<`T`\>

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`[]\>

## Returns

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`QuerySnapshot`\<`T`, `DocumentData`\>\>
