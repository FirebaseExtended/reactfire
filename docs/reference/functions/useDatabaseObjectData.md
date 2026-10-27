[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useDatabaseObjectData

# ~~Function: useDatabaseObjectData()~~

> **useDatabaseObjectData**\<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`\>

Defined in: [src/database.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L93)

Subscribe to a Realtime Database object and unwrap the snapshot into a plain object.

## Type Parameters

### T

`T`

## Parameters

### ref

`DatabaseReference`

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`\>

## Deprecated

Use `useDatabaseObject` and read `snapshot.val()` / `snapshot.key` directly. Will be removed in v5.0.0.
