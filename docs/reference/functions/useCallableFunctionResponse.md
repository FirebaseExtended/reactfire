[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useCallableFunctionResponse

# ~~Function: useCallableFunctionResponse()~~

> **useCallableFunctionResponse**\<`RequestData`, `ResponseData`\>(`functionName`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`ResponseData`\>

Defined in: [src/functions.tsx:35](https://github.com/FirebaseExtended/reactfire/blob/main/src/functions.tsx#L35)

Calls a callable function.

## Type Parameters

### RequestData

`RequestData`

### ResponseData

`ResponseData`

## Parameters

### functionName

`string`

The name of the function to call

### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`ResponseData`\> & `object`

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`ResponseData`\>

## Deprecated

Call `httpsCallable(functions, functionName)` directly (e.g. inside React 19 `useActionState` or an event handler). Will be removed in v5.0.0.
