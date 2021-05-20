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

▸ **useDatabaseList**<T\>(`ref`: firebase.database.Reference \| firebase.database.Query, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<QueryChange[] \| T[]\>

Subscribe to a Realtime Database list

#### Type parameters

| Name | Default |
| :------ | :------ |
| `T` | { [key: string]: *unknown*;  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | firebase.database.Reference \| firebase.database.Query | Reference to the DB List you want to listen to |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\> |  |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<QueryChange[] \| T[]\>

Defined in: [src/database.tsx:73](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L73)

___

### useDatabaseListData

▸ **useDatabaseListData**<T\>(`ref`: firebase.database.Reference \| firebase.database.Query, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T[]\>

#### Type parameters

| Name | Default |
| :------ | :------ |
| `T` | { [key: string]: *unknown*;  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | firebase.database.Reference \| firebase.database.Query |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T[]\> |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T[]\>

Defined in: [src/database.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L83)

___

### useDatabaseObject

▸ **useDatabaseObject**<T\>(`ref`: firebase.database.Reference, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<QueryChange \| T\>

Subscribe to a Realtime Database object

#### Type parameters

| Name | Default |
| :------ | :------ |
| `T` | *unknown* |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | firebase.database.Reference | Reference to the DB object you want to listen to |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |  |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<QueryChange \| T\>

Defined in: [src/database.tsx:29](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L29)

___

### useDatabaseObjectData

▸ **useDatabaseObjectData**<T\>(`ref`: firebase.database.Reference, `options?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\>): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | firebase.database.Reference |
| `options?` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)<T\> |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

Defined in: [src/database.tsx:59](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L59)
