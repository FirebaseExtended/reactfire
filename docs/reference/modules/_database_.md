**[reactfire](../README.md)**

> [Globals](../globals.md) / "database"

# Module: "database"

## Index

### Variables

* [cachedQueries](_database_.md#cachedqueries)

### Functions

* [changeToData](_database_.md#changetodata)
* [getUniqueIdForDatabaseQuery](_database_.md#getuniqueidfordatabasequery)
* [objectVal](_database_.md#objectval)
* [useDatabaseList](_database_.md#usedatabaselist)
* [useDatabaseListData](_database_.md#usedatabaselistdata)
* [useDatabaseObject](_database_.md#usedatabaseobject)
* [useDatabaseObjectData](_database_.md#usedatabaseobjectdata)

## Variables

### cachedQueries

• `Const` **cachedQueries**: Array\<Query> = ((globalThis as any) as ReactFireGlobals).\_reactFireDatabaseCachedQueries \|\| []

*Defined in [src/database.tsx:9](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L9)*

## Functions

### changeToData

▸ **changeToData**(`change`: QueryChange, `keyField?`: undefined \| string): object

*Defined in [src/database.tsx:44](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L44)*

#### Parameters:

Name | Type |
------ | ------ |
`change` | QueryChange |
`keyField?` | undefined \| string |

**Returns:** object

___

### getUniqueIdForDatabaseQuery

▸ **getUniqueIdForDatabaseQuery**(`query`: Query): number

*Defined in [src/database.tsx:15](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L15)*

#### Parameters:

Name | Type |
------ | ------ |
`query` | Query |

**Returns:** number

___

### objectVal

▸ **objectVal**\<T>(`query`: Query, `keyField?`: undefined \| string): Observable\<T>

*Defined in [src/database.tsx:40](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L40)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`query` | Query |
`keyField?` | undefined \| string |

**Returns:** Observable\<T>

___

### useDatabaseList

▸ **useDatabaseList**\<T>(`ref`: Reference \| Query, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<QueryChange[] \| T[]>

*Defined in [src/database.tsx:73](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L73)*

Subscribe to a Realtime Database list

#### Type parameters:

Name | Default |
------ | ------ |
`T` | { [key:string]: unknown;  } |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | Reference \| Query | Reference to the DB List you want to listen to |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<QueryChange[] \| T[]>

___

### useDatabaseListData

▸ **useDatabaseListData**\<T>(`ref`: Reference \| Query, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T[]>

*Defined in [src/database.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L83)*

#### Type parameters:

Name | Default |
------ | ------ |
`T` | { [key:string]: unknown;  } |

#### Parameters:

Name | Type |
------ | ------ |
`ref` | Reference \| Query |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T[]> |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T[]>

___

### useDatabaseObject

▸ **useDatabaseObject**\<T>(`ref`: Reference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<QueryChange \| T>

*Defined in [src/database.tsx:29](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L29)*

Subscribe to a Realtime Database object

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ref` | Reference | Reference to the DB object you want to listen to |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<QueryChange \| T>

___

### useDatabaseObjectData

▸ **useDatabaseObjectData**\<T>(`ref`: Reference, `options?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T>): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

*Defined in [src/database.tsx:59](https://github.com/FirebaseExtended/reactfire/blob/master/src/database.tsx#L59)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`ref` | Reference |
`options?` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)\<T> |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>
