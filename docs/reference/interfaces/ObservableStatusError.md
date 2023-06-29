[ReactFire reference docs](../README.md) / ObservableStatusError

# Interface: ObservableStatusError<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `ObservableStatusBase`<`T`\>

  ↳ **`ObservableStatusError`**

## Table of contents

### Properties

- [data](ObservableStatusError.md#data)
- [error](ObservableStatusError.md#error)
- [firstValuePromise](ObservableStatusError.md#firstvaluepromise)
- [hasEmitted](ObservableStatusError.md#hasemitted)
- [isComplete](ObservableStatusError.md#iscomplete)
- [status](ObservableStatusError.md#status)

## Properties

### data

• **data**: `undefined` \| `T`

The most recent value.

If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

#### Inherited from

ObservableStatusBase.data

#### Defined in

[src/useObservable.ts:56](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L56)

___

### error

• **error**: `Error`

#### Overrides

ObservableStatusBase.error

#### Defined in

[src/useObservable.ts:75](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L75)

___

### firstValuePromise

• **firstValuePromise**: `Promise`<`void`\>

Promise that resolves after first emit from observable

#### Inherited from

ObservableStatusBase.firstValuePromise

#### Defined in

[src/useObservable.ts:64](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L64)

___

### hasEmitted

• **hasEmitted**: `boolean`

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

#### Inherited from

ObservableStatusBase.hasEmitted

#### Defined in

[src/useObservable.ts:46](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L46)

___

### isComplete

• **isComplete**: ``true``

#### Overrides

ObservableStatusBase.isComplete

#### Defined in

[src/useObservable.ts:74](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L74)

___

### status

• **status**: ``"error"``

#### Overrides

ObservableStatusBase.status

#### Defined in

[src/useObservable.ts:73](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L73)
