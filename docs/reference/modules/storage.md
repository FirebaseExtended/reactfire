[ReactFire reference docs](../README.md) / storage

# Module: storage

## Table of contents

### Functions

- [StorageImage](storage.md#storageimage)
- [useStorageDownloadURL](storage.md#usestoragedownloadurl)
- [useStorageTask](storage.md#usestoragetask)

## Functions

### StorageImage

▸ **StorageImage**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StorageImageProps` & `React.DetailedHTMLProps`<`React.ImgHTMLAttributes`<`HTMLImageElement`\>, `HTMLImageElement`\> |

#### Returns

`Element`

#### Defined in

[src/storage.tsx:102](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L102)

___

### useStorageDownloadURL

▸ **useStorageDownloadURL**<`T`\>(`ref`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`string` \| `T`\>

Subscribe to a storage ref's download URL

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `firebase.storage.Reference` | reference to the blob you want to download |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`string` \| `T`\>

#### Defined in

[src/storage.tsx:53](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L53)

___

### useStorageTask

▸ **useStorageTask**<`T`\>(`task`, `ref`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`firebase.storage.UploadTaskSnapshot` \| `T`\>

Subscribe to the progress of a storage task

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `task` | `firebase.storage.UploadTask` | the task you want to listen to |
| `ref` | `firebase.storage.Reference` | reference to the blob the task is acting on |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`firebase.storage.UploadTaskSnapshot` \| `T`\>

#### Defined in

[src/storage.tsx:36](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L36)
