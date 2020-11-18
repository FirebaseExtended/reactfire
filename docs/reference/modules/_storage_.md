**[reactfire](../README.md)**

> [Globals](../globals.md) / "storage"

# Module: "storage"

## Index

### Type aliases

* [StorageImageProps](_storage_.md#storageimageprops)

### Functions

* [INTERNALStorageImage](_storage_.md#internalstorageimage)
* [StorageFromContext](_storage_.md#storagefromcontext)
* [StorageImage](_storage_.md#storageimage)
* [\_fromTask](_storage_.md#_fromtask)
* [useStorageDownloadURL](_storage_.md#usestoragedownloadurl)
* [useStorageTask](_storage_.md#usestoragetask)

## Type aliases

### StorageImageProps

Ƭ  **StorageImageProps**: { placeHolder?: JSX.Element ; storage?: firebase.storage.Storage ; storagePath: string ; suspense?: undefined \| false \| true  }

*Defined in [src/storage.tsx:60](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L60)*

#### Type declaration:

Name | Type |
------ | ------ |
`placeHolder?` | JSX.Element |
`storage?` | firebase.storage.Storage |
`storagePath` | string |
`suspense?` | undefined \| false \| true |

## Functions

### INTERNALStorageImage

▸ **INTERNALStorageImage**(`props`: [StorageImageProps](_storage_.md#storageimageprops) & React.DetailedHTMLProps\<ImgHTMLAttributes\<HTMLImageElement>, HTMLImageElement>): Element

*Defined in [src/storage.tsx:75](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L75)*

#### Parameters:

Name | Type |
------ | ------ |
`props` | [StorageImageProps](_storage_.md#storageimageprops) & React.DetailedHTMLProps\<ImgHTMLAttributes\<HTMLImageElement>, HTMLImageElement> |

**Returns:** Element

___

### StorageFromContext

▸ **StorageFromContext**(`props`: [StorageImageProps](_storage_.md#storageimageprops) & React.DetailedHTMLProps\<ImgHTMLAttributes\<HTMLImageElement>, HTMLImageElement>): Element

*Defined in [src/storage.tsx:67](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L67)*

#### Parameters:

Name | Type |
------ | ------ |
`props` | [StorageImageProps](_storage_.md#storageimageprops) & React.DetailedHTMLProps\<ImgHTMLAttributes\<HTMLImageElement>, HTMLImageElement> |

**Returns:** Element

___

### StorageImage

▸ **StorageImage**(`props`: [StorageImageProps](_storage_.md#storageimageprops) & React.DetailedHTMLProps\<ImgHTMLAttributes\<HTMLImageElement>, HTMLImageElement>): Element

*Defined in [src/storage.tsx:102](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L102)*

#### Parameters:

Name | Type |
------ | ------ |
`props` | [StorageImageProps](_storage_.md#storageimageprops) & React.DetailedHTMLProps\<ImgHTMLAttributes\<HTMLImageElement>, HTMLImageElement> |

**Returns:** Element

___

### \_fromTask

▸ **_fromTask**(`task`: UploadTask): Observable\<UploadTaskSnapshot>

*Defined in [src/storage.tsx:13](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L13)*

modified version of rxFire's _fromTask

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`task` | UploadTask |   |

**Returns:** Observable\<UploadTaskSnapshot>

___

### useStorageDownloadURL

▸ **useStorageDownloadURL**\<T>(`ref`: Reference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<string \| T>

*Defined in [src/storage.tsx:53](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L53)*

Subscribe to a storage ref's download URL

#### Type parameters:

Name | Default |
------ | ------ |
`T` | string |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | Reference | reference to the blob you want to download |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<string \| T>

___

### useStorageTask

▸ **useStorageTask**\<T>(`task`: UploadTask, `ref`: Reference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<UploadTaskSnapshot \| T>

*Defined in [src/storage.tsx:36](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/storage.tsx#L36)*

Subscribe to the progress of a storage task

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`task` | UploadTask | the task you want to listen to |
`ref` | Reference | reference to the blob the task is acting on |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<UploadTaskSnapshot \| T>
