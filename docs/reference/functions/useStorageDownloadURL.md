[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useStorageDownloadURL

# Function: useStorageDownloadURL()

> **useStorageDownloadURL**\<`T`\>(`storageRef`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`string` \| `T`\>

Defined in: [src/storage.tsx:111](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L111)

Subscribe to a storage ref's download URL

## Type Parameters

### T

`T` = `string`

## Parameters

### storageRef

`StorageReference`

reference to the blob you want to download

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`string` \| `T`\>
