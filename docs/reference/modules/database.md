[ReactFire reference docs](../README.md) / database

# Module: database

## Table of contents

### Functions

- [useDatabaseList](database.md#usedatabaselist)
- [useDatabaseListData](database.md#usedatabaselistdata)
- [useDatabaseObject](database.md#usedatabaseobject)
- [useDatabaseObjectData](database.md#usedatabaseobjectdata)

## Functions

### useDatabaseList

▸ **useDatabaseList**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`QueryChange`[] \| `T`[]\>

Subscribe to a Realtime Database list

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { [key: string]: `unknown`;  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `DatabaseReference` \| `DatabaseQuery` | Reference to the DB List you want to listen to |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`[]\> |  |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`QueryChange`[] \| `T`[]\>

#### Defined in

[src/database.tsx:48](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L48)

___

### useDatabaseListData

▸ **useDatabaseListData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`T`[] \| ``null``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { [key: string]: `unknown`;  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DatabaseReference` \| `DatabaseQuery` |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`T`[] \| ``null``\>

#### Defined in

[src/database.tsx:58](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L58)

___

### useDatabaseObject

▸ **useDatabaseObject**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`QueryChange` \| `T`\>

Subscribe to a Realtime Database object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `DatabaseReference` | Reference to the DB object you want to listen to |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`QueryChange` \| `T`\>

#### Defined in

[src/database.tsx:27](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L27)

___

### useDatabaseObjectData

▸ **useDatabaseObjectData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DatabaseReference` |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

#### Defined in

[src/database.tsx:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L34)
