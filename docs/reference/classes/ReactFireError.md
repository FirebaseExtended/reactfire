[ReactFire reference docs](../README.md) / ReactFireError

# Class: ReactFireError

## Hierarchy

- `Error`

  ↳ **`ReactFireError`**

## Table of contents

### Constructors

- [constructor](ReactFireError.md#constructor)

### Properties

- [cause](ReactFireError.md#cause)
- [code](ReactFireError.md#code)
- [customData](ReactFireError.md#customdata)
- [message](ReactFireError.md#message)
- [name](ReactFireError.md#name)
- [stack](ReactFireError.md#stack)
- [prepareStackTrace](ReactFireError.md#preparestacktrace)
- [stackTraceLimit](ReactFireError.md#stacktracelimit)

### Methods

- [captureStackTrace](ReactFireError.md#capturestacktrace)

## Constructors

### constructor

• **new ReactFireError**(`code`, `message`, `customData?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `message` | `string` |
| `customData?` | `Record`<`string`, `unknown`\> |

#### Overrides

Error.constructor

#### Defined in

[src/index.ts:15](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L15)

## Properties

### cause

• `Optional` **cause**: `Error`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### code

• `Readonly` **code**: `string`

#### Defined in

[src/index.ts:15](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L15)

___

### customData

• `Optional` **customData**: `Record`<`string`, `unknown`\>

#### Defined in

[src/index.ts:15](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L15)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1029

___

### name

• `Readonly` **name**: ``"ReactFireError"``

#### Overrides

Error.name

#### Defined in

[src/index.ts:13](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L13)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1030

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
