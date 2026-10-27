[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ReactFireOptions

# Interface: ReactFireOptions\<T\>

Defined in: [src/useFirebaseStream.ts:47](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L47)

## Extended by

- [`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### ~~idField?~~

> `optional` **idField?**: `string`

Defined in: [src/useFirebaseStream.ts:51](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L51)

#### Deprecated

`*Data` hooks and `idField` are deprecated and will be removed in v5.0.0. Use snapshot hooks (`useFirestoreDoc`, `useFirestoreCollection`, `useDatabaseObject`, `useDatabaseList`) and read `doc.id` or `child.key` directly.

***

### includeMetadataChanges?

> `optional` **includeMetadataChanges?**: `boolean`

Defined in: [src/useFirebaseStream.ts:68](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L68)

Emit when snapshot metadata (`hasPendingWrites`, `fromCache`) changes (`useFirestoreDoc` / `useFirestoreCollection`).

***

### initialData?

> `optional` **initialData?**: `any`

Defined in: [src/useFirebaseStream.ts:52](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L52)

***

### once?

> `optional` **once?**: `boolean`

Defined in: [src/useFirebaseStream.ts:64](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L64)

Resolve the initial read once and do not keep a real-time listener open (`useFirestoreDoc` / `useFirestoreCollection`).

***

### ~~startWithValue?~~

> `optional` **startWithValue?**: `any`

Defined in: [src/useFirebaseStream.ts:56](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L56)

#### Deprecated

use `initialData` instead

***

### ~~suspense?~~

> `optional` **suspense?**: `boolean`

Defined in: [src/useFirebaseStream.ts:60](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L60)

#### Deprecated

Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense: true`.
