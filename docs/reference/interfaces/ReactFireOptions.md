[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ReactFireOptions

# Interface: ReactFireOptions\<T\>

Defined in: [src/useFirebaseStream.ts:32](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L32)

## Extended by

- [`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### ~~idField?~~

> `optional` **idField?**: `string`

Defined in: [src/useFirebaseStream.ts:36](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L36)

#### Deprecated

`*Data` hooks and `idField` are deprecated and will be removed in v5.0.0. Use snapshot hooks (`useFirestoreDoc`, `useFirestoreCollection`, `useDatabaseObject`, `useDatabaseList`) and read `doc.id` or `child.key` directly.

***

### includeMetadataChanges?

> `optional` **includeMetadataChanges?**: `boolean`

Defined in: [src/useFirebaseStream.ts:53](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L53)

Emit when snapshot metadata (`hasPendingWrites`, `fromCache`) changes (`useFirestoreDoc` / `useFirestoreCollection`).

***

### initialData?

> `optional` **initialData?**: `any`

Defined in: [src/useFirebaseStream.ts:37](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L37)

***

### once?

> `optional` **once?**: `boolean`

Defined in: [src/useFirebaseStream.ts:49](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L49)

Resolve the initial read once and do not keep a real-time listener open (`useFirestoreDoc` / `useFirestoreCollection`).

***

### ~~startWithValue?~~

> `optional` **startWithValue?**: `any`

Defined in: [src/useFirebaseStream.ts:41](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L41)

#### Deprecated

use `initialData` instead

***

### ~~suspense?~~

> `optional` **suspense?**: `boolean`

Defined in: [src/useFirebaseStream.ts:45](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L45)

#### Deprecated

Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense: true`.
