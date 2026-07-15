[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useDatabaseObject

# Function: useDatabaseObject()

> **useDatabaseObject**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T` \| `QueryChange`\>

Defined in: [src/database.tsx:27](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L27)

Subscribe to a Realtime Database object

## Type Parameters

### T

`T` = `unknown`

## Parameters

### ref

`DatabaseReference`

Reference to the DB object you want to listen to

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

## Returns

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T` \| `QueryChange`\>
