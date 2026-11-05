[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatus

# Interface: ObservableStatus\<T\>

Defined in: [src/useObservable.ts:35](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L35)

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: [src/useObservable.ts:61](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L61)

The most recent value.

If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

***

### error

> **error**: `Error` \| `undefined`

Defined in: [src/useObservable.ts:65](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L65)

Any error that may have occurred in the underlying observable

***

### firstValuePromise

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useObservable.ts:69](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L69)

Promise that resolves after first emit from observable

***

### hasEmitted

> **hasEmitted**: `boolean`

Defined in: [src/useObservable.ts:51](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L51)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

***

### isComplete

> **isComplete**: `boolean`

Defined in: [src/useObservable.ts:55](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L55)

If this is `true`, the hook will be emitting no further items.

***

### status

> **status**: `"error"` \| `"loading"` \| `"success"`

Defined in: [src/useObservable.ts:45](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L45)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.
