[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / SignInCheckOptionsClaimsObject

# ~~Interface: SignInCheckOptionsClaimsObject~~

Defined in: [src/auth.tsx:315](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L315)

## Deprecated

Will be removed in v5.0.0 along with `useSigninCheck`.

## Extends

- [`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md)

## Properties

### ~~forceRefresh?~~

> `optional` **forceRefresh?**: `boolean`

Defined in: [src/auth.tsx:309](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L309)

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`forceRefresh`](SignInCheckOptionsBasic.md#forcerefresh)

***

### ~~idField?~~

> `optional` **idField?**: `string`

Defined in: [src/useFirebaseStream.ts:36](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L36)

#### Deprecated

`*Data` hooks and `idField` are deprecated and will be removed in v5.0.0. Use snapshot hooks (`useFirestoreDoc`, `useFirestoreCollection`, `useDatabaseObject`, `useDatabaseList`) and read `doc.id` or `child.key` directly.

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`idField`](SignInCheckOptionsBasic.md#idfield)

***

### ~~includeMetadataChanges?~~

> `optional` **includeMetadataChanges?**: `boolean`

Defined in: [src/useFirebaseStream.ts:53](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L53)

Emit when snapshot metadata (`hasPendingWrites`, `fromCache`) changes (`useFirestoreDoc` / `useFirestoreCollection`).

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`includeMetadataChanges`](SignInCheckOptionsBasic.md#includemetadatachanges)

***

### ~~initialData?~~

> `optional` **initialData?**: `any`

Defined in: [src/useFirebaseStream.ts:37](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L37)

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`initialData`](SignInCheckOptionsBasic.md#initialdata)

***

### ~~once?~~

> `optional` **once?**: `boolean`

Defined in: [src/useFirebaseStream.ts:49](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L49)

Resolve the initial read once and do not keep a real-time listener open (`useFirestoreDoc` / `useFirestoreCollection`).

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`once`](SignInCheckOptionsBasic.md#once)

***

### ~~requiredClaims~~

> **requiredClaims**: `ParsedToken`

Defined in: [src/auth.tsx:316](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L316)

***

### ~~startWithValue?~~

> `optional` **startWithValue?**: `any`

Defined in: [src/useFirebaseStream.ts:41](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L41)

#### Deprecated

use `initialData` instead

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`startWithValue`](SignInCheckOptionsBasic.md#startwithvalue)

***

### ~~suspense?~~

> `optional` **suspense?**: `boolean`

Defined in: [src/useFirebaseStream.ts:45](https://github.com/FirebaseExtended/reactfire/blob/main/src/useFirebaseStream.ts#L45)

#### Deprecated

Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense: true`.

#### Inherited from

[`SignInCheckOptionsBasic`](SignInCheckOptionsBasic.md).[`suspense`](SignInCheckOptionsBasic.md#suspense)
