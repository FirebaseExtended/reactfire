**[reactfire](../README.md)**

> [Globals](../globals.md) / "useObservable"

# Module: "useObservable"

## Index

### Interfaces

* [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)

### Variables

* [DEFAULT\_TIMEOUT](_useobservable_.md#default_timeout)
* [preloadedObservables](_useobservable_.md#preloadedobservables)

### Functions

* [preloadObservable](_useobservable_.md#preloadobservable)
* [useObservable](_useobservable_.md#useobservable)

## Variables

### DEFAULT\_TIMEOUT

• `Const` **DEFAULT\_TIMEOUT**: 30000 = 30000

*Defined in [src/useObservable.ts:7](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L7)*

___

### preloadedObservables

• `Const` **preloadedObservables**: Map\<string, [SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<any>> = ((globalThis as any) as ReactFireGlobals).\_reactFirePreloadedObservables \|\| new Map()

*Defined in [src/useObservable.ts:10](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L10)*

## Functions

### preloadObservable

▸ **preloadObservable**\<T>(`source`: Observable\<T>, `id`: string): [SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<T>

*Defined in [src/useObservable.ts:19](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L19)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`source` | Observable\<T> |
`id` | string |

**Returns:** [SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<T>

___

### useObservable

▸ **useObservable**\<T>(`observableId`: string, `source`: Observable\<T \| any>, `config?`: [ReactFireOptions](../interfaces/_index_.reactfireoptions.md)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

*Defined in [src/useObservable.ts:41](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L41)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`observableId` | string | - |
`source` | Observable\<T \| any> | - |
`config` | [ReactFireOptions](../interfaces/_index_.reactfireoptions.md) | {} |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>
