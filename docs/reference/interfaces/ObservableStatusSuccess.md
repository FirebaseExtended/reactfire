[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatusSuccess

# Interface: ObservableStatusSuccess\<T\>

Defined in: [src/useObservable.ts:67](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L67)

## Extends

- `ObservableStatusBase`\<`T`\>

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: [src/useObservable.ts:69](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L69)

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

[`ObservableStatusLoading`](ObservableStatusLoading.md).[`error`](ObservableStatusLoading.md#error)

***

### firstValuePromise

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useObservable.ts:64](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L64)

Promise that resolves after first emit from observable

#### Inherited from

[`ObservableStatusError`](ObservableStatusError.md).[`firstValuePromise`](ObservableStatusError.md#firstvaluepromise)

***

### hasEmitted

> **hasEmitted**: `boolean`

Defined in: [src/useObservable.ts:46](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L46)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

#### Inherited from

[`ObservableStatusError`](ObservableStatusError.md).[`hasEmitted`](ObservableStatusError.md#hasemitted)

***

### isComplete

> **isComplete**: `boolean`

Defined in: [src/useObservable.ts:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L50)

If this is `true`, the hook will be emitting no further items.

#### Inherited from

[`ObservableStatusLoading`](ObservableStatusLoading.md).[`isComplete`](ObservableStatusLoading.md#iscomplete)

***

### status

> **status**: `"success"`

Defined in: [src/useObservable.ts:68](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L68)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.

#### Overrides

`ObservableStatusBase.status`
