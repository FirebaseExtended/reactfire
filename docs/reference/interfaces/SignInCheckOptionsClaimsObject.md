[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / SignInCheckOptionsClaimsObject

# ~~Interface: SignInCheckOptionsClaimsObject~~

Defined in: [src/auth.tsx:306](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L306)

## Deprecated

Will be removed in v5.0.0 along with `useSigninCheck`.

## Extends

- [`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md)

## Properties

### ~~forceRefresh?~~

> `optional` **forceRefresh?**: `boolean`

Defined in: [src/auth.tsx:300](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L300)

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`forceRefresh`](SignInCheckOptionsBasic.md#forcerefresh)

***

### ~~idField?~~

> `optional` **idField?**: `string`

Defined in: [src/useFirebaseStream.ts:51](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L51)

#### Deprecated

`*Data` hooks and `idField` are deprecated and will be removed in v5.0.0. Use snapshot hooks (`useFirestoreDoc`, `useFirestoreCollection`, `useDatabaseObject`, `useDatabaseList`) and read `doc.id` or `child.key` directly.

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`idField`](SignInCheckOptionsBasic.md#idfield)

***

### ~~includeMetadataChanges?~~

> `optional` **includeMetadataChanges?**: `boolean`

Defined in: [src/useFirebaseStream.ts:68](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L68)

Emit when snapshot metadata (`hasPendingWrites`, `fromCache`) changes (`useFirestoreDoc` / `useFirestoreCollection`).

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`includeMetadataChanges`](SignInCheckOptionsBasic.md#includemetadatachanges)

***

### ~~initialData?~~

> `optional` **initialData?**: `any`

Defined in: [src/useFirebaseStream.ts:52](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L52)

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`initialData`](SignInCheckOptionsBasic.md#initialdata)

***

### ~~once?~~

> `optional` **once?**: `boolean`

Defined in: [src/useFirebaseStream.ts:64](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L64)

Resolve the initial read once and do not keep a real-time listener open (`useFirestoreDoc` / `useFirestoreCollection`).

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`once`](SignInCheckOptionsBasic.md#once)

***

### ~~requiredClaims~~

> **requiredClaims**: `ParsedToken`

Defined in: [src/auth.tsx:307](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L307)

***

### ~~startWithValue?~~

> `optional` **startWithValue?**: `any`

Defined in: [src/useFirebaseStream.ts:56](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L56)

#### Deprecated

use `initialData` instead

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`startWithValue`](SignInCheckOptionsBasic.md#startwithvalue)

***

### ~~suspense?~~

> `optional` **suspense?**: `boolean`

Defined in: [src/useFirebaseStream.ts:60](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L60)

#### Deprecated

Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense: true`.

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`suspense`](SignInCheckOptionsBasic.md#suspense)
