[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useDatabaseListData

# ~~Function: useDatabaseListData()~~

> **useDatabaseListData**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`[] \| `null`\>

Defined in: [src/database.tsx:167](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L167)

Subscribe to a Realtime Database list and unwrap the snapshots into an array.

## Type Parameters

### T

`T` = \{\[`key`: `string`\]: `unknown`; \}

## Parameters

### ref

`DatabaseReference` \| `Query`

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`[]\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`[] \| `null`\>

## Deprecated

Use `useDatabaseList` and read `child.val()` / `child.key` directly. Will be removed in v5.0.0.
