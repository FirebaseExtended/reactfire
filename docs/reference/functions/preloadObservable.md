[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / preloadObservable

# ~~Function: preloadObservable()~~

> **preloadObservable**\<`T`\>(`source`, `id`, `suspenseEnabled?`): `SuspenseSubject`\<`T`\>

Defined in: [src/useObservable.ts:30](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L30)

Starts listening to an Observable.
Call this once you know you're going to render a
child that will consume the observable.

## Type Parameters

### T

`T`

## Parameters

### source

`Observable`\<`T`\>

### id

`string`

### suspenseEnabled?

`boolean` = `false`

## Returns

`SuspenseSubject`\<`T`\>

## Deprecated

RxJS integration (`preloadObservable`, `useObservable`, `SuspenseSubject`) is deprecated and will be removed in v5.0.0.
