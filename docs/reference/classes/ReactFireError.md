[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / ReactFireError

# Class: ReactFireError

Defined in: [src/index.ts:12](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L12)

## Extends

- `Error`

## Constructors

### Constructor

> **new ReactFireError**(`code`, `message`, `customData?`): `ReactFireError`

Defined in: [src/index.ts:15](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L15)

#### Parameters

##### code

`string`

##### message

`string`

##### customData?

`Record`\<`string`, `unknown`\>

#### Returns

`ReactFireError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause?**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

`Error.cause`

***

### code

> `readonly` **code**: `string`

Defined in: [src/index.ts:15](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L15)

***

### customData?

> `optional` **customData?**: `Record`\<`string`, `unknown`\>

Defined in: [src/index.ts:15](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L15)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> `readonly` **name**: `"ReactFireError"` = `'ReactFireError'`

Defined in: [src/index.ts:13](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L13)

#### Overrides

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`

## Methods

### isError()

> `static` **isError**(`error`): `error is Error`

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:21

Indicates whether the argument provided is a built-in Error instance or not.

#### Parameters

##### error

`unknown`

#### Returns

`error is Error`

#### Inherited from

`Error.isError`
