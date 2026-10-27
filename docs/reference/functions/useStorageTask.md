[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useStorageTask

# ~~Function: useStorageTask()~~

> **useStorageTask**\<`T`\>(`task`, `ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`UploadTaskSnapshot` \| `T`\>

Defined in: [src/storage.tsx:54](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L54)

Subscribe to the progress of a storage task

## Type Parameters

### T

`T` = `unknown`

## Parameters

### task

`UploadTask`

the task you want to listen to

### ref

`StorageReference`

reference to the blob the task is acting on

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`UploadTaskSnapshot` \| `T`\>

## Deprecated

Track `uploadBytesResumable` progress inside your upload handler or action instead. Will be removed in v5.0.0.
