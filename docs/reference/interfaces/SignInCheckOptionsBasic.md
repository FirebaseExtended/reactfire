[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / SignInCheckOptionsBasic

# ~~Interface: SignInCheckOptionsBasic~~

Defined in: [src/auth.tsx:308](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L308)

## Deprecated

Will be removed in v5.0.0 along with `useSigninCheck`.

## Extends

- [`ReactFireOptions`](ReactFireOptions.md)\<[`SigninCheckResult`](../type-aliases/SigninCheckResult.md)\>

## Extended by

- [`SignInCheckOptionsClaimsObject`](SignInCheckOptionsClaimsObject.md)
- [`SignInCheckOptionsClaimsValidator`](SignInCheckOptionsClaimsValidator.md)

## Properties

### ~~forceRefresh?~~

> `optional` **forceRefresh?**: `boolean`

Defined in: [src/auth.tsx:309](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L309)

***

### ~~idField?~~

> `optional` **idField?**: `string`

Defined in: [src/useFirebaseStream.ts:36](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L36)

#### Deprecated

`*Data` hooks and `idField` are deprecated and will be removed in v5.0.0. Use snapshot hooks (`useFirestoreDoc`, `useFirestoreCollection`, `useDatabaseObject`, `useDatabaseList`) and read `doc.id` or `child.key` directly.

#### Inherited from

[`ReactFireOptions`](ReactFireOptions.md).[`idField`](ReactFireOptions.md#idfield)

***

### ~~includeMetadataChanges?~~

> `optional` **includeMetadataChanges?**: `boolean`

Defined in: [src/useFirebaseStream.ts:53](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L53)

Emit when snapshot metadata (`hasPendingWrites`, `fromCache`) changes (`useFirestoreDoc` / `useFirestoreCollection`).

#### Inherited from

[`ReactFireOptions`](ReactFireOptions.md).[`includeMetadataChanges`](ReactFireOptions.md#includemetadatachanges)

***

### ~~initialData?~~

> `optional` **initialData?**: `any`

Defined in: [src/useFirebaseStream.ts:37](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L37)

#### Inherited from

[`ReactFireOptions`](ReactFireOptions.md).[`initialData`](ReactFireOptions.md#initialdata)

***

### ~~once?~~

> `optional` **once?**: `boolean`

Defined in: [src/useFirebaseStream.ts:49](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L49)

Resolve the initial read once and do not keep a real-time listener open (`useFirestoreDoc` / `useFirestoreCollection`).

#### Inherited from

[`ReactFireOptions`](ReactFireOptions.md).[`once`](ReactFireOptions.md#once)

***

### ~~startWithValue?~~

> `optional` **startWithValue?**: `any`

Defined in: [src/useFirebaseStream.ts:41](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L41)

#### Deprecated

use `initialData` instead

#### Inherited from

[`ReactFireOptions`](ReactFireOptions.md).[`startWithValue`](ReactFireOptions.md#startwithvalue)

***

### ~~suspense?~~

> `optional` **suspense?**: `boolean`

Defined in: [src/useFirebaseStream.ts:45](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L45)

#### Deprecated

Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense: true`.

#### Inherited from

[`ReactFireOptions`](ReactFireOptions.md).[`suspense`](ReactFireOptions.md#suspense)
