[ReactFire reference docs](../README.md) / useObservable

# Module: useObservable

## Table of contents

### Type aliases

- [ObservableStatus](useObservable.md#observablestatus)

### Functions

- [preloadObservable](useObservable.md#preloadobservable)
- [useObservable](useObservable.md#useobservable)

## Type aliases

### ObservableStatus

Ƭ **ObservableStatus**<`T`\>: `ObservableStatusLoading`<`T`\> \| `ObservableStatusWithData`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/useObservable.ts:76](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L76)

## Functions

### preloadObservable

▸ **preloadObservable**<`T`\>(`source`, `id`): [`SuspenseSubject`](../classes/SuspenseSubject.SuspenseSubject-1.md)<`T`\>

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

[`SuspenseSubject`](../classes/SuspenseSubject.SuspenseSubject-1.md)<`T`\>

#### Defined in

[src/useObservable.ts:19](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L19)

___

### useObservable

▸ **useObservable**<`T`\>(`observableId`, `source`, `config?`): [`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `observableId` | `string` |
| `source` | `Observable`<`T`\> |
| `config` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md) |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`T`\>

#### Defined in

[src/useObservable.ts:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L78)
