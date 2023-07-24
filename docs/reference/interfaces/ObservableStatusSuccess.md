[ReactFire reference docs](../README.md) / ObservableStatusSuccess

# Interface: ObservableStatusSuccess<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `ObservableStatusBase`<`T`\>

  ↳ **`ObservableStatusSuccess`**

## Table of contents

### Properties

- [data](ObservableStatusSuccess.md#data)
- [error](ObservableStatusSuccess.md#error)
- [firstValuePromise](ObservableStatusSuccess.md#firstvaluepromise)
- [hasEmitted](ObservableStatusSuccess.md#hasemitted)
- [isComplete](ObservableStatusSuccess.md#iscomplete)
- [status](ObservableStatusSuccess.md#status)

## Properties

### data

• **data**: `T`

#### Overrides

ObservableStatusBase.data

#### Defined in

[src/useObservable.ts:69](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L69)

___

### error

• **error**: `undefined` \| `Error`

Any error that may have occurred in the underlying observable

#### Inherited from

ObservableStatusBase.error

#### Defined in

[src/useObservable.ts:60](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L60)

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

• **isComplete**: `boolean`

If this is `true`, the hook will be emitting no further items.

#### Inherited from

ObservableStatusBase.isComplete

#### Defined in

[src/useObservable.ts:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L50)

___

### status

• **status**: ``"success"``

#### Overrides

ObservableStatusBase.status

#### Defined in

[src/useObservable.ts:68](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L68)
