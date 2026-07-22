[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useStorageTask

# Function: useStorageTask()

> **useStorageTask**\<`T`\>(`task`, `ref`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T` \| `UploadTaskSnapshot`\>

Defined in: [src/storage.tsx:16](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L16)

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

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T` \| `UploadTaskSnapshot`\>
