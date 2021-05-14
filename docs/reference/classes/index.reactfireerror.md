[ReactFire reference docs](../README.md) / [index](../modules/index.md) / ReactFireError

# Class: ReactFireError

[index](../modules/index.md).ReactFireError

## Hierarchy

* *Error*

  ↳ **ReactFireError**

## Table of contents

### Constructors

- [constructor](index.reactfireerror.md#constructor)

### Properties

- [code](index.reactfireerror.md#code)
- [customData](index.reactfireerror.md#customdata)
- [message](index.reactfireerror.md#message)
- [name](index.reactfireerror.md#name)
- [stack](index.reactfireerror.md#stack)
- [prepareStackTrace](index.reactfireerror.md#preparestacktrace)
- [stackTraceLimit](index.reactfireerror.md#stacktracelimit)

### Methods

- [captureStackTrace](index.reactfireerror.md#capturestacktrace)

## Constructors

### constructor

\+ **new ReactFireError**(`code`: *string*, `message`: *string*, `customData?`: *Record*<string, unknown\>): [*ReactFireError*](index.reactfireerror.md)

#### Parameters:

| Name | Type |
| :------ | :------ |
| `code` | *string* |
| `message` | *string* |
| `customData?` | *Record*<string, unknown\> |

**Returns:** [*ReactFireError*](index.reactfireerror.md)

Overrides: Error.constructor

Defined in: [src/index.ts:11](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L11)

## Properties

### code

• `Readonly` **code**: *string*

___

### customData

• `Optional` **customData**: *Record*<string, unknown\>

___

### message

• **message**: *string*

Inherited from: Error.message

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• `Readonly` **name**: ``"ReactFireError"``= 'ReactFireError'

Overrides: Error.name

Defined in: [src/index.ts:11](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L11)

___

### stack

• `Optional` **stack**: *string*

Inherited from: Error.stack

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration:

▸ (`err`: Error, `stackTraces`: CallSite[]): *any*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `err` | Error |
| `stackTraces` | CallSite[] |

**Returns:** *any*

Defined in: node_modules/@types/node/globals.d.ts:11

Inherited from: Error.prepareStackTrace

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Inherited from: Error.stackTraceLimit

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

| Name | Type |
| :------ | :------ |
| `targetObject` | *object* |
| `constructorOpt?` | Function |

**Returns:** *void*

Inherited from: Error.captureStackTrace

Defined in: node_modules/@types/node/globals.d.ts:4
