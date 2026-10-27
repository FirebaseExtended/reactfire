[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ObservableStatus

# Interface: ObservableStatus\<T\>

Defined in: [src/useFirebaseStream.ts:97](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L97)

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: [src/useFirebaseStream.ts:127](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L127)

The most recent value.

If `initialData` is passed in, the first value of `data` will be the value provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.

***

### error

> **error**: `Error` \| `undefined`

Defined in: [src/useFirebaseStream.ts:131](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L131)

Any error that may have occurred in the underlying observable

***

### experimental\_usable

> `readonly` **experimental\_usable**: [`ReactFireUsable`](../type-aliases/ReactFireUsable.md)\<`T`\>

Defined in: [src/useFirebaseStream.ts:153](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L153)

A React 19 `Usable<T>` that can be passed directly into `React.use()`
(`const data = use(useFirestoreDoc(ref).experimental_usable)`).

Suspends on initial load when no data is available yet, and synchronously
unwraps the latest live value on all subsequent renders without re-suspending.

***

### ~~firstValuePromise~~

> **firstValuePromise**: `Promise`\<`void`\>

Defined in: [src/useFirebaseStream.ts:137](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L137)

Promise that resolves after first emit from observable

#### Deprecated

Pass `.experimental_usable` (or `.usable`) to `React.use()` instead. Will be removed in v5.0.0.

***

### ~~hasEmitted~~

> **hasEmitted**: `boolean`

Defined in: [src/useFirebaseStream.ts:115](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L115)

Indicates whether the hook has emitted a value at some point

If `initialData` is passed in, this will be `true`.

#### Deprecated

Check `status === 'success'` or pass `.experimental_usable` to `React.use()` instead. Will be removed in v5.0.0.

***

### ~~isComplete~~

> **isComplete**: `boolean`

Defined in: [src/useFirebaseStream.ts:121](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L121)

If this is `true`, the hook will be emitting no further items.

#### Deprecated

Will be removed in v5.0.0.

***

### status

> **status**: `"loading"` \| `"error"` \| `"success"`

Defined in: [src/useFirebaseStream.ts:107](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L107)

The loading status.

- `loading`: Waiting for the first value from an observable
- `error`: Something went wrong. Check `ObservableStatus.error` for more details
- `success`: The hook has emitted at least one value

If `initialData` is passed in, this will skip `loading` and go straight to `success`.

***

### usable

> `readonly` **usable**: [`ReactFireUsable`](../type-aliases/ReactFireUsable.md)\<`T`\>

Defined in: [src/useFirebaseStream.ts:145](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L145)

A React 19 `Usable<T>` that can be passed directly into `React.use()`
(`const data = use(useFirestoreDoc(ref).usable)`).

Suspends on initial load when no data is available yet, and synchronously
unwraps the latest live value on all subsequent renders without re-suspending.
