[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatusError

# Interface: ObservableStatusError\<T\>

Defined in: [src/useObservable.ts:72](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L72)

## Extends

- `ObservableStatusBase`\<`T`\>

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T` \| `undefined`

Defined in: [src/useObservable.ts:56](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L56)

The most recent value.

If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

#### Inherited from

`ObservableStatusBase.data`

***

### error

> **error**: `Error`

Defined in: [src/useObservable.ts:75](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L75)

Any error that may have occurred in the underlying observable

#### Overrides

`ObservableStatusBase.error`

***

### firstValuePromise

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useObservable.ts:64](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L64)

Promise that resolves after first emit from observable

#### Inherited from

`ObservableStatusBase.firstValuePromise`

***

### hasEmitted

> **hasEmitted**: `boolean`

Defined in: [src/useObservable.ts:46](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L46)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

#### Inherited from

`ObservableStatusBase.hasEmitted`

***

### isComplete

> **isComplete**: `true`

Defined in: [src/useObservable.ts:74](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L74)

If this is `true`, the hook will be emitting no further items.

#### Overrides

`ObservableStatusBase.isComplete`

***

### status

> **status**: `"error"`

Defined in: [src/useObservable.ts:73](https://github.com/tyler-reitz/reactfire/blob/main/src/useObservable.ts#L73)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.

#### Overrides

`ObservableStatusBase.status`
