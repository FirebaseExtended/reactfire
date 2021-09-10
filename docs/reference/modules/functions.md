[ReactFire reference docs](../README.md) / functions

# Module: functions

## Table of contents

### Functions

- [useCallableFunctionResponse](functions.md#usecallablefunctionresponse)

## Functions

### useCallableFunctionResponse

▸ **useCallableFunctionResponse**<`RequestData`, `ResponseData`\>(`functionName`, `options?`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`ResponseData`\>

Calls a callable function.

#### Type parameters

| Name |
| :------ |
| `RequestData` |
| `ResponseData` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `functionName` | `string` | The name of the function to call |
| `options?` | [`ReactFireOptions`](../interfaces/index.ReactFireOptions.md)<`ResponseData`\> & { `data?`: `RequestData` ; `httpsCallableOptions?`: `HttpsCallableOptions`  } |  |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`ResponseData`\>

#### Defined in

[src/functions.tsx:13](https://github.com/FirebaseExtended/reactfire/blob/main/src/functions.tsx#L13)
