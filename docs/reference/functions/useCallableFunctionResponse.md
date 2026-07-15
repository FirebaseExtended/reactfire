[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useCallableFunctionResponse

# Function: useCallableFunctionResponse()

> **useCallableFunctionResponse**\<`RequestData`, `ResponseData`\>(`functionName`, `options?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`ResponseData`\>

Defined in: [src/functions.tsx:13](https://github.com/tyler-reitz/reactfire/blob/main/src/functions.tsx#L13)

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

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`ResponseData`\>
