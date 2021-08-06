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

▸ **preloadObservable**<`T`\>(`source`, `id`): [`SuspenseSubject`](../classes/suspensesubject.suspensesubject-1.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Observable`<`T`\> |
| `id` | `string` |

#### Returns

[`SuspenseSubject`](../classes/suspensesubject.suspensesubject-1.md)<`T`\>

#### Defined in

[src/useObservable.ts:19](https://github.com/sujishpatel/reactfire/blob/main/src/useObservable.ts#L19)

___

### useObservable

▸ **useObservable**<`T`\>(`observableId`, `source`, `config?`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `observableId` | `string` |
| `source` | `Observable`<`T` \| `any`\> |
| `config` | [`ReactFireOptions`](../interfaces/index.reactfireoptions.md) |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`T`\>

#### Defined in

[src/useObservable.ts:66](https://github.com/sujishpatel/reactfire/blob/main/src/useObservable.ts#L66)
