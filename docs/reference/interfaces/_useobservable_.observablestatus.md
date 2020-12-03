**[reactfire](../README.md)**

> [Globals](../globals.md) / ["useObservable"](../modules/_useobservable_.md) / ObservableStatus

# Interface: ObservableStatus\<T>

## Type parameters

Name |
------ |
`T` |

## Hierarchy

* **ObservableStatus**

## Index

### Properties

* [data](_useobservable_.observablestatus.md#data)
* [error](_useobservable_.observablestatus.md#error)
* [firstValuePromise](_useobservable_.observablestatus.md#firstvaluepromise)
* [hasEmitted](_useobservable_.observablestatus.md#hasemitted)
* [isComplete](_useobservable_.observablestatus.md#iscomplete)
* [status](_useobservable_.observablestatus.md#status)

## Properties

### data

•  **data**: T

*Defined in [src/useObservable.ts:36](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L36)*

___

### error

•  **error**: Error \| undefined

*Defined in [src/useObservable.ts:37](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L37)*

___

### firstValuePromise

•  **firstValuePromise**: Promise\<void>

*Defined in [src/useObservable.ts:38](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L38)*

___

### hasEmitted

•  **hasEmitted**: boolean

*Defined in [src/useObservable.ts:34](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L34)*

___

### isComplete

•  **isComplete**: boolean

*Defined in [src/useObservable.ts:35](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L35)*

___

### status

•  **status**: \"loading\" \| \"error\" \| \"success\"

*Defined in [src/useObservable.ts:30](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/useObservable.ts#L30)*
