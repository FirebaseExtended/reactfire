[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useDatabaseList

# Function: useDatabaseList()

> **useDatabaseList**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T`[] \| `QueryChange`[]\>

Defined in: [src/database.tsx:48](https://github.com/tyler-reitz/reactfire/blob/main/src/database.tsx#L48)

Subscribe to a Realtime Database list

## Type Parameters

### T

`T` = \{\[`key`: `string`\]: `unknown`; \}

## Parameters

### ref

`Query` \| `DatabaseReference`

Reference to the DB List you want to listen to

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`[]\>

## Returns

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T`[] \| `QueryChange`[]\>
