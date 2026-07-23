[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatus

# Interface: ObservableStatus\<T\>

Defined in: [src/useObservable.ts:30](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L30)

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: [src/useObservable.ts:56](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L56)

The most recent value.

If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

***

### error

> **error**: `Error` \| `undefined`

Defined in: [src/useObservable.ts:60](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L60)

Any error that may have occurred in the underlying observable

***

### firstValuePromise

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useObservable.ts:64](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L64)

Promise that resolves after first emit from observable

***

### hasEmitted

> **hasEmitted**: `boolean`

Defined in: [src/useObservable.ts:46](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L46)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

***

### isComplete

> **isComplete**: `boolean`

Defined in: [src/useObservable.ts:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L50)

If this is `true`, the hook will be emitting no further items.

***

### status

> **status**: `"error"` \| `"loading"` \| `"success"`

Defined in: [src/useObservable.ts:40](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L40)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.
