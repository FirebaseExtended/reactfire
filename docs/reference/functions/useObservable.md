[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useObservable

# Function: useObservable()

> **useObservable**\<`T`\>(`observableId`, `source`, `config?`): [`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T`\>

Defined in: [src/useObservable.ts:97](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L97)

Subscribe to an Observable and return its current status.

Error handling depends on the suspense mode:
- Non-suspense mode (default): errors are returned as `{ status: 'error', error }` so the
  component can handle them locally without needing a React Error Boundary.
- Suspense mode (`suspense: true`): errors are re-thrown so a React Error Boundary can catch them.

If the observable emits a value and then errors, `data` retains the last emitted value and
`status` changes to `'error'`. There is no automatic retry path once an error occurs.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### observableId

`string`

### source

`Observable`\<`T`\>

### config?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md) = `{}`

## Returns

[`ObservableStatus`](../type-aliases/ObservableStatus.md)\<`T`\>
