[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useDatabaseList

# Function: useDatabaseList()

> **useDatabaseList**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`QueryChange`](../interfaces/QueryChange.md)[] \| `T`[]\>

Defined in: [src/database.tsx:139](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L139)

Subscribe to a Realtime Database list

## Type Parameters

### T

`T` = \{\[`key`: `string`\]: `unknown`; \}

## Parameters

### ref

`DatabaseReference` \| `Query`

Reference to the DB List you want to listen to

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`[]\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`QueryChange`](../interfaces/QueryChange.md)[] \| `T`[]\>
