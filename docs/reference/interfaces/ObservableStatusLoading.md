[ReactFire reference docs](../README.md) / ObservableStatusLoading

# Interface: ObservableStatusLoading<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `ObservableStatusBase`<`T`\>

  ↳ **`ObservableStatusLoading`**

## Table of contents

### Properties

- [data](ObservableStatusLoading.md#data)
- [error](ObservableStatusLoading.md#error)
- [firstValuePromise](ObservableStatusLoading.md#firstvaluepromise)
- [hasEmitted](ObservableStatusLoading.md#hasemitted)
- [isComplete](ObservableStatusLoading.md#iscomplete)
- [status](ObservableStatusLoading.md#status)

## Properties

### data

• **data**: `undefined`

#### Overrides

ObservableStatusBase.data

#### Defined in

[src/useObservable.ts:80](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L80)

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

• **hasEmitted**: ``false``

#### Overrides

ObservableStatusBase.hasEmitted

#### Defined in

[src/useObservable.ts:81](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L81)

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

• **status**: ``"loading"``

#### Overrides

ObservableStatusBase.status

#### Defined in

[src/useObservable.ts:79](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L79)
