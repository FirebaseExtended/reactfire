[ReactFire reference docs](../README.md) / [useObservable](../modules/useobservable.md) / ObservableStatus

# Interface: ObservableStatus<T\>

[useObservable](../modules/useobservable.md).ObservableStatus

## Type parameters

Name |
:------ |
`T` |

## Table of contents

### Properties

- [data](useobservable.observablestatus.md#data)
- [error](useobservable.observablestatus.md#error)
- [firstValuePromise](useobservable.observablestatus.md#firstvaluepromise)
- [hasEmitted](useobservable.observablestatus.md#hasemitted)
- [isComplete](useobservable.observablestatus.md#iscomplete)
- [status](useobservable.observablestatus.md#status)

## Properties

### data

• **data**: T

Defined in: [src/useObservable.ts:36](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L36)

___

### error

• **error**: *undefined* \| Error

Defined in: [src/useObservable.ts:37](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L37)

___

### firstValuePromise

• **firstValuePromise**: *Promise*<void\>

Defined in: [src/useObservable.ts:38](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L38)

___

### hasEmitted

• **hasEmitted**: *boolean*

Defined in: [src/useObservable.ts:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L34)

___

### isComplete

• **isComplete**: *boolean*

Defined in: [src/useObservable.ts:35](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L35)

___

### status

• **status**: *loading* \| *error* \| *success*

Defined in: [src/useObservable.ts:30](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L30)
