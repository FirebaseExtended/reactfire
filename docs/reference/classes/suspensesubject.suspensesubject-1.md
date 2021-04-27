[ReactFire reference docs](../README.md) / [SuspenseSubject](../modules/suspensesubject.md) / SuspenseSubject

# Class: SuspenseSubject<T\>

[SuspenseSubject](../modules/suspensesubject.md).SuspenseSubject

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

* *Subject*<T\>

  ↳ **SuspenseSubject**

## Table of contents

### Constructors

- [constructor](suspensesubject.suspensesubject-1.md#constructor)

### Properties

- [\_error](suspensesubject.suspensesubject-1.md#_error)
- [\_firstEmission](suspensesubject.suspensesubject-1.md#_firstemission)
- [\_hasValue](suspensesubject.suspensesubject-1.md#_hasvalue)
- [\_innerObservable](suspensesubject.suspensesubject-1.md#_innerobservable)
- [\_innerSubscriber](suspensesubject.suspensesubject-1.md#_innersubscriber)
- [\_isScalar](suspensesubject.suspensesubject-1.md#_isscalar)
- [\_resolveFirstEmission](suspensesubject.suspensesubject-1.md#_resolvefirstemission)
- [\_timeoutHandler](suspensesubject.suspensesubject-1.md#_timeouthandler)
- [\_value](suspensesubject.suspensesubject-1.md#_value)
- [\_warmupSubscription](suspensesubject.suspensesubject-1.md#_warmupsubscription)
- [closed](suspensesubject.suspensesubject-1.md#closed)
- [hasError](suspensesubject.suspensesubject-1.md#haserror)
- [isStopped](suspensesubject.suspensesubject-1.md#isstopped)
- [observers](suspensesubject.suspensesubject-1.md#observers)
- [operator](suspensesubject.suspensesubject-1.md#operator)
- [source](suspensesubject.suspensesubject-1.md#source)
- [thrownError](suspensesubject.suspensesubject-1.md#thrownerror)
- [create](suspensesubject.suspensesubject-1.md#create)
- [if](suspensesubject.suspensesubject-1.md#if)
- [throw](suspensesubject.suspensesubject-1.md#throw)

### Accessors

- [firstEmission](suspensesubject.suspensesubject-1.md#firstemission)
- [hasValue](suspensesubject.suspensesubject-1.md#hasvalue)
- [ourError](suspensesubject.suspensesubject-1.md#ourerror)
- [value](suspensesubject.suspensesubject-1.md#value)

### Methods

- [\_next](suspensesubject.suspensesubject-1.md#_next)
- [\_reset](suspensesubject.suspensesubject-1.md#_reset)
- [\_subscribe](suspensesubject.suspensesubject-1.md#_subscribe)
- [\_trySubscribe](suspensesubject.suspensesubject-1.md#_trysubscribe)
- [asObservable](suspensesubject.suspensesubject-1.md#asobservable)
- [complete](suspensesubject.suspensesubject-1.md#complete)
- [error](suspensesubject.suspensesubject-1.md#error)
- [forEach](suspensesubject.suspensesubject-1.md#foreach)
- [lift](suspensesubject.suspensesubject-1.md#lift)
- [next](suspensesubject.suspensesubject-1.md#next)
- [pipe](suspensesubject.suspensesubject-1.md#pipe)
- [subscribe](suspensesubject.suspensesubject-1.md#subscribe)
- [toPromise](suspensesubject.suspensesubject-1.md#topromise)
- [unsubscribe](suspensesubject.suspensesubject-1.md#unsubscribe)

## Constructors

### constructor

\+ **new SuspenseSubject**<T\>(`innerObservable`: *Observable*<T\>, `_timeoutWindow`: *number*): [*SuspenseSubject*](suspensesubject.suspensesubject-1.md)<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `innerObservable` | *Observable*<T\> |
| `_timeoutWindow` | *number* |

**Returns:** [*SuspenseSubject*](suspensesubject.suspensesubject-1.md)<T\>

Overrides: Subject&lt;T\&gt;.constructor

Defined in: [src/SuspenseSubject.ts:16](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L16)

## Properties

### \_error

• `Private` **\_error**: *any*

Defined in: [src/SuspenseSubject.ts:9](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L9)

___

### \_firstEmission

• `Private` **\_firstEmission**: *Promise*<void\>

Defined in: [src/SuspenseSubject.ts:8](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L8)

___

### \_hasValue

• `Private` **\_hasValue**: *boolean*= false

Defined in: [src/SuspenseSubject.ts:6](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L6)

___

### \_innerObservable

• `Private` **\_innerObservable**: *Observable*<T\>

Defined in: [src/SuspenseSubject.ts:10](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L10)

___

### \_innerSubscriber

• `Private` **\_innerSubscriber**: *Subscription*

Defined in: [src/SuspenseSubject.ts:14](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L14)

___

### \_isScalar

• **\_isScalar**: *boolean*

Internal implementation detail, do not use directly.

Inherited from: Subject.\_isScalar

Defined in: node_modules/rxjs/internal/Observable.d.ts:15

___

### \_resolveFirstEmission

• `Private` **\_resolveFirstEmission**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [src/SuspenseSubject.ts:16](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L16)

Defined in: [src/SuspenseSubject.ts:16](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L16)

___

### \_timeoutHandler

• `Private` **\_timeoutHandler**: *Timeout*

Defined in: [src/SuspenseSubject.ts:7](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L7)

___

### \_value

• `Private` **\_value**: *undefined* \| T

Defined in: [src/SuspenseSubject.ts:5](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L5)

___

### \_warmupSubscription

• `Private` **\_warmupSubscription**: *Subscription*

Defined in: [src/SuspenseSubject.ts:11](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L11)

___

### closed

• **closed**: *boolean*

Inherited from: Subject.closed

Defined in: node_modules/rxjs/internal/Subject.d.ts:24

___

### hasError

• **hasError**: *boolean*

Inherited from: Subject.hasError

Defined in: node_modules/rxjs/internal/Subject.d.ts:26

___

### isStopped

• **isStopped**: *boolean*

Inherited from: Subject.isStopped

Defined in: node_modules/rxjs/internal/Subject.d.ts:25

___

### observers

• **observers**: *Observer*<T\>[]

Inherited from: Subject.observers

Defined in: node_modules/rxjs/internal/Subject.d.ts:23

___

### operator

• **operator**: *Operator*<any, T\>

**`deprecated`** This is an internal implementation detail, do not use.

Inherited from: Subject.operator

Defined in: node_modules/rxjs/internal/Observable.d.ts:19

___

### source

• **source**: *Observable*<any\>

**`deprecated`** This is an internal implementation detail, do not use.

Inherited from: Subject.source

Defined in: node_modules/rxjs/internal/Observable.d.ts:17

___

### thrownError

• **thrownError**: *any*

Inherited from: Subject.thrownError

Defined in: node_modules/rxjs/internal/Subject.d.ts:27

___

### create

▪ `Static` **create**: Function

**`nocollapse`** 

**`deprecated`** use new Subject() instead

Inherited from: Subject.create

Defined in: node_modules/rxjs/internal/Subject.d.ts:32

___

### if

▪ `Static` **if**: <T, F\>(`condition`: () => *boolean*, `trueResult?`: *SubscribableOrPromise*<T\>, `falseResult?`: *SubscribableOrPromise*<F\>) => *Observable*<T \| F\>

**`nocollapse`** 

**`deprecated`** In favor of iif creation function: import { iif } from 'rxjs';

#### Type declaration:

▸ <T, F\>(`condition`: () => *boolean*, `trueResult?`: *SubscribableOrPromise*<T\>, `falseResult?`: *SubscribableOrPromise*<F\>): *Observable*<T \| F\>

Decides at subscription time which Observable will actually be subscribed.

<span class="informal">`If` statement for Observables.</span>

`iif` accepts a condition function and two Observables. When
an Observable returned by the operator is subscribed, condition function will be called.
Based on what boolean it returns at that moment, consumer will subscribe either to
the first Observable (if condition was true) or to the second (if condition was false). Condition
function may also not return anything - in that case condition will be evaluated as false and
second Observable will be subscribed.

Note that Observables for both cases (true and false) are optional. If condition points to an Observable that
was left undefined, resulting stream will simply complete immediately. That allows you to, rather
than controlling which Observable will be subscribed, decide at runtime if consumer should have access
to given Observable or not.

If you have more complex logic that requires decision between more than two Observables, {@link defer}
will probably be a better choice. Actually `iif` can be easily implemented with {@link defer}
and exists only for convenience and readability reasons.

## Examples
### Change at runtime which Observable will be subscribed
```ts
import { iif, of } from 'rxjs';

let subscribeToFirst;
const firstOrSecond = iif(
  () => subscribeToFirst,
  of('first'),
  of('second'),
);

subscribeToFirst = true;
firstOrSecond.subscribe(value => console.log(value));

// Logs:
// "first"

subscribeToFirst = false;
firstOrSecond.subscribe(value => console.log(value));

// Logs:
// "second"

```

### Control an access to an Observable
```ts
let accessGranted;
const observableIfYouHaveAccess = iif(
  () => accessGranted,
  of('It seems you have an access...'), // Note that only one Observable is passed to the operator.
);

accessGranted = true;
observableIfYouHaveAccess.subscribe(
  value => console.log(value),
  err => {},
  () => console.log('The end'),
);

// Logs:
// "It seems you have an access..."
// "The end"

accessGranted = false;
observableIfYouHaveAccess.subscribe(
  value => console.log(value),
  err => {},
  () => console.log('The end'),
);

// Logs:
// "The end"
```

**`see`** {@link defer}

**`static`** true

**`name`** iif

**`owner`** Observable

#### Type parameters:

| Name | Default |
| :------ | :------ |
| `T` | *never* |
| `F` | *never* |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `condition` | () => *boolean* | Condition which Observable should be chosen. |
| `trueResult?` | *SubscribableOrPromise*<T\> | - |
| `falseResult?` | *SubscribableOrPromise*<F\> | - |

**Returns:** *Observable*<T \| F\>

Either first or second Observable, depending on condition.

Defined in: node_modules/rxjs/internal/observable/iif.d.ts:91

Inherited from: Subject.if

Defined in: node_modules/rxjs/internal/Observable.d.ts:71

___

### throw

▪ `Static` **throw**: (`error`: *any*, `scheduler?`: SchedulerLike) => *Observable*<never\>

**`nocollapse`** 

**`deprecated`** In favor of throwError creation function: import { throwError } from 'rxjs';

#### Type declaration:

▸ (`error`: *any*, `scheduler?`: SchedulerLike): *Observable*<never\>

Creates an Observable that emits no items to the Observer and immediately
emits an error notification.

<span class="informal">Just emits 'error', and nothing else.
</span>

![](throw.png)

This static operator is useful for creating a simple Observable that only
emits the error notification. It can be used for composing with other
Observables, such as in a {@link mergeMap}.

## Examples
### Emit the number 7, then emit an error
```ts
import { throwError, concat, of } from 'rxjs';

const result = concat(of(7), throwError(new Error('oops!')));
result.subscribe(x => console.log(x), e => console.error(e));

// Logs:
// 7
// Error: oops!
```

---

### Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 2
```ts
import { throwError, interval, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interval(1000).pipe(
  mergeMap(x => x === 2
    ? throwError('Twos are bad')
    : of('a', 'b', 'c')
  ),
).subscribe(x => console.log(x), e => console.error(e));

// Logs:
// a
// b
// c
// a
// b
// c
// Twos are bad
```

**`see`** {@link Observable}

**`see`** {@link empty}

**`see`** {@link never}

**`see`** {@link of}

**`static`** true

**`name`** throwError

**`owner`** Observable

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | *any* | The particular Error to pass to the error notification. |
| `scheduler?` | SchedulerLike | - |

**Returns:** *Observable*<never\>

An error Observable: emits only the error notification
using the given error argument.

Defined in: node_modules/rxjs/internal/observable/throwError.d.ts:67

Inherited from: Subject.throw

Defined in: node_modules/rxjs/internal/Observable.d.ts:76

## Accessors

### firstEmission

• get **firstEmission**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [src/SuspenseSubject.ts:61](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L61)

___

### hasValue

• get **hasValue**(): *boolean*

**Returns:** *boolean*

Defined in: [src/SuspenseSubject.ts:44](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L44)

___

### ourError

• get **ourError**(): *any*

**Returns:** *any*

Defined in: [src/SuspenseSubject.ts:90](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L90)

___

### value

• get **value**(): *undefined* \| T

**Returns:** *undefined* \| T

Defined in: [src/SuspenseSubject.ts:51](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L51)

## Methods

### \_next

▸ `Private`**_next**(`value`: T): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `value` | T |

**Returns:** *void*

Defined in: [src/SuspenseSubject.ts:65](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L65)

___

### \_reset

▸ `Private`**_reset**(): *void*

**Returns:** *void*

Defined in: [src/SuspenseSubject.ts:71](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L71)

___

### \_subscribe

▸ **_subscribe**(`subscriber`: *Subscriber*<T\>): *Subscription*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `subscriber` | *Subscriber*<T\> |

**Returns:** *Subscription*

Overrides: Subject.\_subscribe

Defined in: [src/SuspenseSubject.ts:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/SuspenseSubject.ts#L82)

___

### \_trySubscribe

▸ **_trySubscribe**(`subscriber`: *Subscriber*<T\>): TeardownLogic

**`deprecated`** This is an internal implementation detail, do not use.

#### Parameters:

| Name | Type |
| :------ | :------ |
| `subscriber` | *Subscriber*<T\> |

**Returns:** TeardownLogic

Inherited from: Subject.\_trySubscribe

Defined in: node_modules/rxjs/internal/Subject.d.ts:39

___

### asObservable

▸ **asObservable**(): *Observable*<T\>

Creates a new Observable with this Subject as the source. You can do this
to create customize Observer-side logic of the Subject and conceal it from
code that uses the Observable.

**Returns:** *Observable*<T\>

Observable that the Subject casts to

Inherited from: Subject.asObservable

Defined in: node_modules/rxjs/internal/Subject.d.ts:48

___

### complete

▸ **complete**(): *void*

**Returns:** *void*

Inherited from: Subject.complete

Defined in: node_modules/rxjs/internal/Subject.d.ts:36

___

### error

▸ **error**(`err`: *any*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `err` | *any* |

**Returns:** *void*

Inherited from: Subject.error

Defined in: node_modules/rxjs/internal/Subject.d.ts:35

___

### forEach

▸ **forEach**(`next`: (`value`: T) => *void*, `promiseCtor?`: PromiseConstructorLike): *Promise*<void\>

**`method`** forEach

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `next` | (`value`: T) => *void* | a handler for each value emitted by the observable |
| `promiseCtor?` | PromiseConstructorLike | - |

**Returns:** *Promise*<void\>

a promise that either resolves on observable completion or
 rejects with the handled error

Inherited from: Subject.forEach

Defined in: node_modules/rxjs/internal/Observable.d.ts:64

___

### lift

▸ **lift**<R\>(`operator`: *Operator*<T, R\>): *Observable*<R\>

#### Type parameters:

| Name |
| :------ |
| `R` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `operator` | *Operator*<T, R\> |

**Returns:** *Observable*<R\>

Inherited from: Subject.lift

Defined in: node_modules/rxjs/internal/Subject.d.ts:33

___

### next

▸ **next**(`value?`: T): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `value?` | T |

**Returns:** *void*

Inherited from: Subject.next

Defined in: node_modules/rxjs/internal/Subject.d.ts:34

___

### pipe

▸ **pipe**(): *Observable*<T\>

**Returns:** *Observable*<T\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:77

▸ **pipe**<A\>(`op1`: *OperatorFunction*<T, A\>): *Observable*<A\>

#### Type parameters:

| Name |
| :------ |
| `A` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |

**Returns:** *Observable*<A\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:78

▸ **pipe**<A, B\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>): *Observable*<B\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |

**Returns:** *Observable*<B\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:79

▸ **pipe**<A, B, C\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>): *Observable*<C\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |

**Returns:** *Observable*<C\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:80

▸ **pipe**<A, B, C, D\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>): *Observable*<D\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |

**Returns:** *Observable*<D\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:81

▸ **pipe**<A, B, C, D, E\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>, `op5`: *OperatorFunction*<D, E\>): *Observable*<E\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |
| `E` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |
| `op5` | *OperatorFunction*<D, E\> |

**Returns:** *Observable*<E\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:82

▸ **pipe**<A, B, C, D, E, F\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>, `op5`: *OperatorFunction*<D, E\>, `op6`: *OperatorFunction*<E, F\>): *Observable*<F\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |
| `E` |
| `F` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |
| `op5` | *OperatorFunction*<D, E\> |
| `op6` | *OperatorFunction*<E, F\> |

**Returns:** *Observable*<F\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:83

▸ **pipe**<A, B, C, D, E, F, G\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>, `op5`: *OperatorFunction*<D, E\>, `op6`: *OperatorFunction*<E, F\>, `op7`: *OperatorFunction*<F, G\>): *Observable*<G\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |
| `E` |
| `F` |
| `G` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |
| `op5` | *OperatorFunction*<D, E\> |
| `op6` | *OperatorFunction*<E, F\> |
| `op7` | *OperatorFunction*<F, G\> |

**Returns:** *Observable*<G\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:84

▸ **pipe**<A, B, C, D, E, F, G, H\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>, `op5`: *OperatorFunction*<D, E\>, `op6`: *OperatorFunction*<E, F\>, `op7`: *OperatorFunction*<F, G\>, `op8`: *OperatorFunction*<G, H\>): *Observable*<H\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |
| `E` |
| `F` |
| `G` |
| `H` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |
| `op5` | *OperatorFunction*<D, E\> |
| `op6` | *OperatorFunction*<E, F\> |
| `op7` | *OperatorFunction*<F, G\> |
| `op8` | *OperatorFunction*<G, H\> |

**Returns:** *Observable*<H\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:85

▸ **pipe**<A, B, C, D, E, F, G, H, I\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>, `op5`: *OperatorFunction*<D, E\>, `op6`: *OperatorFunction*<E, F\>, `op7`: *OperatorFunction*<F, G\>, `op8`: *OperatorFunction*<G, H\>, `op9`: *OperatorFunction*<H, I\>): *Observable*<I\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |
| `E` |
| `F` |
| `G` |
| `H` |
| `I` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |
| `op5` | *OperatorFunction*<D, E\> |
| `op6` | *OperatorFunction*<E, F\> |
| `op7` | *OperatorFunction*<F, G\> |
| `op8` | *OperatorFunction*<G, H\> |
| `op9` | *OperatorFunction*<H, I\> |

**Returns:** *Observable*<I\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:86

▸ **pipe**<A, B, C, D, E, F, G, H, I\>(`op1`: *OperatorFunction*<T, A\>, `op2`: *OperatorFunction*<A, B\>, `op3`: *OperatorFunction*<B, C\>, `op4`: *OperatorFunction*<C, D\>, `op5`: *OperatorFunction*<D, E\>, `op6`: *OperatorFunction*<E, F\>, `op7`: *OperatorFunction*<F, G\>, `op8`: *OperatorFunction*<G, H\>, `op9`: *OperatorFunction*<H, I\>, ...`operations`: *OperatorFunction*<any, any\>[]): *Observable*<{}\>

#### Type parameters:

| Name |
| :------ |
| `A` |
| `B` |
| `C` |
| `D` |
| `E` |
| `F` |
| `G` |
| `H` |
| `I` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `op1` | *OperatorFunction*<T, A\> |
| `op2` | *OperatorFunction*<A, B\> |
| `op3` | *OperatorFunction*<B, C\> |
| `op4` | *OperatorFunction*<C, D\> |
| `op5` | *OperatorFunction*<D, E\> |
| `op6` | *OperatorFunction*<E, F\> |
| `op7` | *OperatorFunction*<F, G\> |
| `op8` | *OperatorFunction*<G, H\> |
| `op9` | *OperatorFunction*<H, I\> |
| `...operations` | *OperatorFunction*<any, any\>[] |

**Returns:** *Observable*<{}\>

Inherited from: Subject.pipe

Defined in: node_modules/rxjs/internal/Observable.d.ts:87

___

### subscribe

▸ **subscribe**(`observer?`: *PartialObserver*<T\>): *Subscription*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `observer?` | *PartialObserver*<T\> |

**Returns:** *Subscription*

Inherited from: Subject.subscribe

Defined in: node_modules/rxjs/internal/Observable.d.ts:47

▸ **subscribe**(`next`: *undefined* \| ``null``, `error`: *undefined* \| ``null``, `complete`: () => *void*): *Subscription*

**`deprecated`** Use an observer instead of a complete callback

#### Parameters:

| Name | Type |
| :------ | :------ |
| `next` | *undefined* \| ``null`` |
| `error` | *undefined* \| ``null`` |
| `complete` | () => *void* |

**Returns:** *Subscription*

Inherited from: Subject.subscribe

Defined in: node_modules/rxjs/internal/Observable.d.ts:49

▸ **subscribe**(`next`: *undefined* \| ``null``, `error`: (`error`: *any*) => *void*, `complete?`: () => *void*): *Subscription*

**`deprecated`** Use an observer instead of an error callback

#### Parameters:

| Name | Type |
| :------ | :------ |
| `next` | *undefined* \| ``null`` |
| `error` | (`error`: *any*) => *void* |
| `complete?` | () => *void* |

**Returns:** *Subscription*

Inherited from: Subject.subscribe

Defined in: node_modules/rxjs/internal/Observable.d.ts:51

▸ **subscribe**(`next`: (`value`: T) => *void*, `error`: *undefined* \| ``null``, `complete`: () => *void*): *Subscription*

**`deprecated`** Use an observer instead of a complete callback

#### Parameters:

| Name | Type |
| :------ | :------ |
| `next` | (`value`: T) => *void* |
| `error` | *undefined* \| ``null`` |
| `complete` | () => *void* |

**Returns:** *Subscription*

Inherited from: Subject.subscribe

Defined in: node_modules/rxjs/internal/Observable.d.ts:53

▸ **subscribe**(`next?`: (`value`: T) => *void*, `error?`: (`error`: *any*) => *void*, `complete?`: () => *void*): *Subscription*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `next?` | (`value`: T) => *void* |
| `error?` | (`error`: *any*) => *void* |
| `complete?` | () => *void* |

**Returns:** *Subscription*

Inherited from: Subject.subscribe

Defined in: node_modules/rxjs/internal/Observable.d.ts:54

___

### toPromise

▸ **toPromise**<T\>(): *Promise*<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

**Returns:** *Promise*<T\>

Inherited from: Subject.toPromise

Defined in: node_modules/rxjs/internal/Observable.d.ts:88

▸ **toPromise**<T\>(`PromiseCtor`: PromiseConstructor): *Promise*<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `PromiseCtor` | PromiseConstructor |

**Returns:** *Promise*<T\>

Inherited from: Subject.toPromise

Defined in: node_modules/rxjs/internal/Observable.d.ts:89

▸ **toPromise**<T\>(`PromiseCtor`: PromiseConstructorLike): *Promise*<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `PromiseCtor` | PromiseConstructorLike |

**Returns:** *Promise*<T\>

Inherited from: Subject.toPromise

Defined in: node_modules/rxjs/internal/Observable.d.ts:90

___

### unsubscribe

▸ **unsubscribe**(): *void*

**Returns:** *void*

Inherited from: Subject.unsubscribe

Defined in: node_modules/rxjs/internal/Subject.d.ts:37
