[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatus

# Interface: ObservableStatus\<T\>

Defined in: [src/useFirebaseStream.ts:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L82)

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: [src/useFirebaseStream.ts:112](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L112)

The most recent value.

If `initialData` is passed in, the first value of `data` will be the value provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

***

### error

> **error**: `Error` \| `undefined`

Defined in: [src/useFirebaseStream.ts:116](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L116)

Any error that may have occurred in the underlying observable

***

### experimental\_usable

> `readonly` **experimental\_usable**: [`ReactFireUsable`](../type-aliases/ReactFireUsable.md)\<`T`\>

Defined in: [src/useFirebaseStream.ts:138](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L138)

A React 19 `Usable<T>` that can be passed directly into `React.use()`
(`const data = use(useFirestoreDoc(ref).experimental_usable)`).

Suspends on initial load when no data is available yet, and synchronously
unwraps the latest live value on all subsequent renders without re-suspending.

***

### ~~firstValuePromise~~

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useFirebaseStream.ts:122](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L122)

Promise that resolves after first emit from observable

#### Deprecated

Pass `.experimental_usable` (or `.usable`) to `React.use()` instead. Will be removed in v5.0.0.

***

### ~~hasEmitted~~

> **hasEmitted**: `boolean`

Defined in: [src/useFirebaseStream.ts:100](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L100)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

#### Deprecated

Check `status === 'success'` or pass `.experimental_usable` to `React.use()` instead. Will be removed in v5.0.0.

***

### ~~isComplete~~

> **isComplete**: `boolean`

Defined in: [src/useFirebaseStream.ts:106](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L106)

If this is `true`, the hook will be emitting no further items.

#### Deprecated

Will be removed in v5.0.0.

***

### status

> **status**: `"loading"` \| `"error"` \| `"success"`

Defined in: [src/useFirebaseStream.ts:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L92)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.

***

### usable

> `readonly` **usable**: [`ReactFireUsable`](../type-aliases/ReactFireUsable.md)\<`T`\>

Defined in: [src/useFirebaseStream.ts:130](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L130)

A React 19 `Usable<T>` that can be passed directly into `React.use()`
(`const data = use(useFirestoreDoc(ref).usable)`).

Suspends on initial load when no data is available yet, and synchronously
unwraps the latest live value on all subsequent renders without re-suspending.
