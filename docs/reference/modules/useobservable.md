[ReactFire reference docs](../README.md) / useObservable

# Module: useObservable

## Table of contents

### Interfaces

- [ObservableStatus](../interfaces/useobservable.observablestatus.md)

### Functions

- [preloadObservable](useobservable.md#preloadobservable)
- [useObservable](useobservable.md#useobservable)

## Functions

### preloadObservable

▸ **preloadObservable**<T\>(`source`: *Observable*<T\>, `id`: *string*): [*SuspenseSubject*](../classes/suspensesubject.suspensesubject-1.md)<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `source` | *Observable*<T\> |
| `id` | *string* |

**Returns:** [*SuspenseSubject*](../classes/suspensesubject.suspensesubject-1.md)<T\>

Defined in: [src/useObservable.ts:19](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L19)

___

### useObservable

▸ **useObservable**<T\>(`observableId`: *string*, `source`: *Observable*<T \| any\>, `config?`: [*ReactFireOptions*](../interfaces/index.reactfireoptions.md)): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `observableId` | *string* | - |
| `source` | *Observable*<T \| any\> | - |
| `config` | [*ReactFireOptions*](../interfaces/index.reactfireoptions.md) | {} |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<T\>

Defined in: [src/useObservable.ts:41](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L41)
