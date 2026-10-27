[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useObservable

# ~~Function: useObservable()~~

> **useObservable**\<`T`\>(`observableId`, `source`, `config?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`\>

Defined in: [src/useObservable.ts:46](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L46)

Subscribe to an RxJS `Observable`.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### observableId

`string`

### source

`Observable`\<`T`\>

### config?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md) = `{}`

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`T`\>

## Deprecated

RxJS integration (`useObservable`, `preloadObservable`, `SuspenseSubject`) is deprecated and will be removed in v5.0.0.
