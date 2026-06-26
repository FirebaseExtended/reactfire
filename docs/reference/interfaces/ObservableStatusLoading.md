[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatusLoading

# Interface: ObservableStatusLoading\<T\>

Defined in: [src/useObservable.ts:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L78)

## Extends

- `ObservableStatusBase`\<`T`\>

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `undefined`

Defined in: [src/useObservable.ts:80](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L80)

The most recent value.

If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

#### Overrides

`ObservableStatusBase.data`

***

### error

> **error**: `Error` \| `undefined`

Defined in: [src/useObservable.ts:60](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L60)

Any error that may have occurred in the underlying observable

#### Inherited from

`ObservableStatusBase.error`

***

### firstValuePromise

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useObservable.ts:64](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L64)

Promise that resolves after first emit from observable

#### Inherited from

`ObservableStatusBase.firstValuePromise`

***

### hasEmitted

> **hasEmitted**: `false`

Defined in: [src/useObservable.ts:81](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L81)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

#### Overrides

`ObservableStatusBase.hasEmitted`

***

### isComplete

> **isComplete**: `boolean`

Defined in: [src/useObservable.ts:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L50)

If this is `true`, the hook will be emitting no further items.

#### Inherited from

`ObservableStatusBase.isComplete`

***

### status

> **status**: `"loading"`

Defined in: [src/useObservable.ts:79](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L79)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.

#### Overrides

`ObservableStatusBase.status`
