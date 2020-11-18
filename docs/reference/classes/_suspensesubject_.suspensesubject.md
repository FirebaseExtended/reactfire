**[reactfire](../README.md)**

> [Globals](../globals.md) / ["SuspenseSubject"](../modules/_suspensesubject_.md) / SuspenseSubject

# Class: SuspenseSubject\<T>

## Type parameters

Name |
------ |
`T` |

## Hierarchy

* Subject\<T>

  ↳ **SuspenseSubject**

## Implements

* Subscribable\<T>
* SubscriptionLike

## Index

### Constructors

* [constructor](_suspensesubject_.suspensesubject.md#constructor)

### Properties

* [\_error](_suspensesubject_.suspensesubject.md#_error)
* [\_firstEmission](_suspensesubject_.suspensesubject.md#_firstemission)
* [\_hasValue](_suspensesubject_.suspensesubject.md#_hasvalue)
* [\_innerObservable](_suspensesubject_.suspensesubject.md#_innerobservable)
* [\_innerSubscriber](_suspensesubject_.suspensesubject.md#_innersubscriber)
* [\_isScalar](_suspensesubject_.suspensesubject.md#_isscalar)
* [\_resolveFirstEmission](_suspensesubject_.suspensesubject.md#_resolvefirstemission)
* [\_timeoutHandler](_suspensesubject_.suspensesubject.md#_timeouthandler)
* [\_timeoutWindow](_suspensesubject_.suspensesubject.md#_timeoutwindow)
* [\_value](_suspensesubject_.suspensesubject.md#_value)
* [\_warmupSubscription](_suspensesubject_.suspensesubject.md#_warmupsubscription)
* [closed](_suspensesubject_.suspensesubject.md#closed)
* [hasError](_suspensesubject_.suspensesubject.md#haserror)
* [isStopped](_suspensesubject_.suspensesubject.md#isstopped)
* [observers](_suspensesubject_.suspensesubject.md#observers)
* [operator](_suspensesubject_.suspensesubject.md#operator)
* [source](_suspensesubject_.suspensesubject.md#source)
* [thrownError](_suspensesubject_.suspensesubject.md#thrownerror)
* [create](_suspensesubject_.suspensesubject.md#create)
* [if](_suspensesubject_.suspensesubject.md#if)
* [throw](_suspensesubject_.suspensesubject.md#throw)

### Accessors

* [firstEmission](_suspensesubject_.suspensesubject.md#firstemission)
* [hasValue](_suspensesubject_.suspensesubject.md#hasvalue)
* [ourError](_suspensesubject_.suspensesubject.md#ourerror)
* [value](_suspensesubject_.suspensesubject.md#value)

### Methods

* [\_next](_suspensesubject_.suspensesubject.md#_next)
* [\_reset](_suspensesubject_.suspensesubject.md#_reset)
* [\_subscribe](_suspensesubject_.suspensesubject.md#_subscribe)
* [\_trySubscribe](_suspensesubject_.suspensesubject.md#_trysubscribe)
* [asObservable](_suspensesubject_.suspensesubject.md#asobservable)
* [complete](_suspensesubject_.suspensesubject.md#complete)
* [error](_suspensesubject_.suspensesubject.md#error)
* [forEach](_suspensesubject_.suspensesubject.md#foreach)
* [lift](_suspensesubject_.suspensesubject.md#lift)
* [next](_suspensesubject_.suspensesubject.md#next)
* [pipe](_suspensesubject_.suspensesubject.md#pipe)
* [subscribe](_suspensesubject_.suspensesubject.md#subscribe)
* [toPromise](_suspensesubject_.suspensesubject.md#topromise)
* [unsubscribe](_suspensesubject_.suspensesubject.md#unsubscribe)

## Constructors

### constructor

\+ **new SuspenseSubject**(`innerObservable`: Observable\<T>, `_timeoutWindow`: number): [SuspenseSubject](_suspensesubject_.suspensesubject.md)

*Overrides void*

*Defined in [src/SuspenseSubject.ts:16](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L16)*

#### Parameters:

Name | Type |
------ | ------ |
`innerObservable` | Observable\<T> |
`_timeoutWindow` | number |

**Returns:** [SuspenseSubject](_suspensesubject_.suspensesubject.md)

## Properties

### \_error

• `Private` **\_error**: any = undefined

*Defined in [src/SuspenseSubject.ts:9](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L9)*

___

### \_firstEmission

• `Private` **\_firstEmission**: Promise\<void>

*Defined in [src/SuspenseSubject.ts:8](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L8)*

___

### \_hasValue

• `Private` **\_hasValue**: boolean = false

*Defined in [src/SuspenseSubject.ts:6](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L6)*

___

### \_innerObservable

• `Private` **\_innerObservable**: Observable\<T>

*Defined in [src/SuspenseSubject.ts:10](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L10)*

___

### \_innerSubscriber

• `Private` **\_innerSubscriber**: Subscription

*Defined in [src/SuspenseSubject.ts:14](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L14)*

___

### \_isScalar

•  **\_isScalar**: boolean

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[_isScalar](_suspensesubject_.suspensesubject.md#_isscalar)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:15*

Internal implementation detail, do not use directly.

___

### \_resolveFirstEmission

• `Private` **\_resolveFirstEmission**: () => void

*Defined in [src/SuspenseSubject.ts:16](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L16)*

___

### \_timeoutHandler

• `Private` **\_timeoutHandler**: Timeout

*Defined in [src/SuspenseSubject.ts:7](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L7)*

___

### \_timeoutWindow

• `Private` **\_timeoutWindow**: number

*Defined in [src/SuspenseSubject.ts:18](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L18)*

___

### \_value

• `Private` **\_value**: T \| undefined

*Defined in [src/SuspenseSubject.ts:5](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L5)*

___

### \_warmupSubscription

• `Private` **\_warmupSubscription**: Subscription

*Defined in [src/SuspenseSubject.ts:11](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L11)*

___

### closed

•  **closed**: boolean

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[closed](_suspensesubject_.suspensesubject.md#closed)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:24*

___

### hasError

•  **hasError**: boolean

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[hasError](_suspensesubject_.suspensesubject.md#haserror)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:26*

___

### isStopped

•  **isStopped**: boolean

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[isStopped](_suspensesubject_.suspensesubject.md#isstopped)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:25*

___

### observers

•  **observers**: Observer\<T>[]

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[observers](_suspensesubject_.suspensesubject.md#observers)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:23*

___

### operator

•  **operator**: Operator\<any, T>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[operator](_suspensesubject_.suspensesubject.md#operator)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:19*

**`deprecated`** This is an internal implementation detail, do not use.

___

### source

•  **source**: Observable\<any>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[source](_suspensesubject_.suspensesubject.md#source)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:17*

**`deprecated`** This is an internal implementation detail, do not use.

___

### thrownError

•  **thrownError**: any

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[thrownError](_suspensesubject_.suspensesubject.md#thrownerror)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:27*

___

### create

▪ `Static` **create**: Function

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[create](_suspensesubject_.suspensesubject.md#create)*

*Overrides void*

*Defined in node_modules/rxjs/internal/Subject.d.ts:32*

**`nocollapse`** 

**`deprecated`** use new Subject() instead

___

### if

▪ `Static` **if**: *typeof* iif

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[if](_suspensesubject_.suspensesubject.md#if)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:71*

**`nocollapse`** 

**`deprecated`** In favor of iif creation function: import { iif } from 'rxjs';

___

### throw

▪ `Static` **throw**: *typeof* throwError

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[throw](_suspensesubject_.suspensesubject.md#throw)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:76*

**`nocollapse`** 

**`deprecated`** In favor of throwError creation function: import { throwError } from 'rxjs';

## Accessors

### firstEmission

• get **firstEmission**(): Promise\<void>

*Defined in [src/SuspenseSubject.ts:61](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L61)*

**Returns:** Promise\<void>

___

### hasValue

• get **hasValue**(): boolean

*Defined in [src/SuspenseSubject.ts:44](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L44)*

**Returns:** boolean

___

### ourError

• get **ourError**(): any

*Defined in [src/SuspenseSubject.ts:90](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L90)*

**Returns:** any

___

### value

• get **value**(): T \| undefined

*Defined in [src/SuspenseSubject.ts:51](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L51)*

**Returns:** T \| undefined

## Methods

### \_next

▸ `Private`**_next**(`value`: T): void

*Defined in [src/SuspenseSubject.ts:65](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L65)*

#### Parameters:

Name | Type |
------ | ------ |
`value` | T |

**Returns:** void

___

### \_reset

▸ `Private`**_reset**(): void

*Defined in [src/SuspenseSubject.ts:71](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L71)*

**Returns:** void

___

### \_subscribe

▸ **_subscribe**(`subscriber`: Subscriber\<T>): Subscription

*Overrides void*

*Defined in [src/SuspenseSubject.ts:82](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/SuspenseSubject.ts#L82)*

#### Parameters:

Name | Type |
------ | ------ |
`subscriber` | Subscriber\<T> |

**Returns:** Subscription

___

### \_trySubscribe

▸ **_trySubscribe**(`subscriber`: Subscriber\<T>): TeardownLogic

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[_trySubscribe](_suspensesubject_.suspensesubject.md#_trysubscribe)*

*Overrides void*

*Defined in node_modules/rxjs/internal/Subject.d.ts:39*

**`deprecated`** This is an internal implementation detail, do not use.

#### Parameters:

Name | Type |
------ | ------ |
`subscriber` | Subscriber\<T> |

**Returns:** TeardownLogic

___

### asObservable

▸ **asObservable**(): Observable\<T>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[asObservable](_suspensesubject_.suspensesubject.md#asobservable)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:48*

Creates a new Observable with this Subject as the source. You can do this
to create customize Observer-side logic of the Subject and conceal it from
code that uses the Observable.

**Returns:** Observable\<T>

Observable that the Subject casts to

___

### complete

▸ **complete**(): void

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[complete](_suspensesubject_.suspensesubject.md#complete)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:36*

**Returns:** void

___

### error

▸ **error**(`err`: any): void

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[error](_suspensesubject_.suspensesubject.md#error)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:35*

#### Parameters:

Name | Type |
------ | ------ |
`err` | any |

**Returns:** void

___

### forEach

▸ **forEach**(`next`: (value: T) => void, `promiseCtor?`: PromiseConstructorLike): Promise\<void>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[forEach](_suspensesubject_.suspensesubject.md#foreach)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:64*

**`method`** forEach

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`next` | (value: T) => void | a handler for each value emitted by the observable |
`promiseCtor?` | PromiseConstructorLike | - |

**Returns:** Promise\<void>

a promise that either resolves on observable completion or
 rejects with the handled error

___

### lift

▸ **lift**\<R>(`operator`: Operator\<T, R>): Observable\<R>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[lift](_suspensesubject_.suspensesubject.md#lift)*

*Overrides void*

*Defined in node_modules/rxjs/internal/Subject.d.ts:33*

#### Type parameters:

Name |
------ |
`R` |

#### Parameters:

Name | Type |
------ | ------ |
`operator` | Operator\<T, R> |

**Returns:** Observable\<R>

___

### next

▸ **next**(`value?`: T): void

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[next](_suspensesubject_.suspensesubject.md#next)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:34*

#### Parameters:

Name | Type |
------ | ------ |
`value?` | T |

**Returns:** void

___

### pipe

▸ **pipe**(): Observable\<T>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:77*

**Returns:** Observable\<T>

▸ **pipe**\<A>(`op1`: OperatorFunction\<T, A>): Observable\<A>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:78*

#### Type parameters:

Name |
------ |
`A` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |

**Returns:** Observable\<A>

▸ **pipe**\<A, B>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>): Observable\<B>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:79*

#### Type parameters:

Name |
------ |
`A` |
`B` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |

**Returns:** Observable\<B>

▸ **pipe**\<A, B, C>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>): Observable\<C>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:80*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |

**Returns:** Observable\<C>

▸ **pipe**\<A, B, C, D>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>): Observable\<D>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:81*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |

**Returns:** Observable\<D>

▸ **pipe**\<A, B, C, D, E>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>, `op5`: OperatorFunction\<D, E>): Observable\<E>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:82*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |
`E` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |
`op5` | OperatorFunction\<D, E> |

**Returns:** Observable\<E>

▸ **pipe**\<A, B, C, D, E, F>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>, `op5`: OperatorFunction\<D, E>, `op6`: OperatorFunction\<E, F>): Observable\<F>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:83*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |
`E` |
`F` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |
`op5` | OperatorFunction\<D, E> |
`op6` | OperatorFunction\<E, F> |

**Returns:** Observable\<F>

▸ **pipe**\<A, B, C, D, E, F, G>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>, `op5`: OperatorFunction\<D, E>, `op6`: OperatorFunction\<E, F>, `op7`: OperatorFunction\<F, G>): Observable\<G>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:84*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |
`E` |
`F` |
`G` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |
`op5` | OperatorFunction\<D, E> |
`op6` | OperatorFunction\<E, F> |
`op7` | OperatorFunction\<F, G> |

**Returns:** Observable\<G>

▸ **pipe**\<A, B, C, D, E, F, G, H>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>, `op5`: OperatorFunction\<D, E>, `op6`: OperatorFunction\<E, F>, `op7`: OperatorFunction\<F, G>, `op8`: OperatorFunction\<G, H>): Observable\<H>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:85*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |
`E` |
`F` |
`G` |
`H` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |
`op5` | OperatorFunction\<D, E> |
`op6` | OperatorFunction\<E, F> |
`op7` | OperatorFunction\<F, G> |
`op8` | OperatorFunction\<G, H> |

**Returns:** Observable\<H>

▸ **pipe**\<A, B, C, D, E, F, G, H, I>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>, `op5`: OperatorFunction\<D, E>, `op6`: OperatorFunction\<E, F>, `op7`: OperatorFunction\<F, G>, `op8`: OperatorFunction\<G, H>, `op9`: OperatorFunction\<H, I>): Observable\<I>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:86*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |
`E` |
`F` |
`G` |
`H` |
`I` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |
`op5` | OperatorFunction\<D, E> |
`op6` | OperatorFunction\<E, F> |
`op7` | OperatorFunction\<F, G> |
`op8` | OperatorFunction\<G, H> |
`op9` | OperatorFunction\<H, I> |

**Returns:** Observable\<I>

▸ **pipe**\<A, B, C, D, E, F, G, H, I>(`op1`: OperatorFunction\<T, A>, `op2`: OperatorFunction\<A, B>, `op3`: OperatorFunction\<B, C>, `op4`: OperatorFunction\<C, D>, `op5`: OperatorFunction\<D, E>, `op6`: OperatorFunction\<E, F>, `op7`: OperatorFunction\<F, G>, `op8`: OperatorFunction\<G, H>, `op9`: OperatorFunction\<H, I>, ...`operations`: OperatorFunction\<any, any>[]): Observable\<{}>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[pipe](_suspensesubject_.suspensesubject.md#pipe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:87*

#### Type parameters:

Name |
------ |
`A` |
`B` |
`C` |
`D` |
`E` |
`F` |
`G` |
`H` |
`I` |

#### Parameters:

Name | Type |
------ | ------ |
`op1` | OperatorFunction\<T, A> |
`op2` | OperatorFunction\<A, B> |
`op3` | OperatorFunction\<B, C> |
`op4` | OperatorFunction\<C, D> |
`op5` | OperatorFunction\<D, E> |
`op6` | OperatorFunction\<E, F> |
`op7` | OperatorFunction\<F, G> |
`op8` | OperatorFunction\<G, H> |
`op9` | OperatorFunction\<H, I> |
`...operations` | OperatorFunction\<any, any>[] |

**Returns:** Observable\<{}>

___

### subscribe

▸ **subscribe**(`observer?`: PartialObserver\<T>): Subscription

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[subscribe](_suspensesubject_.suspensesubject.md#subscribe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:47*

#### Parameters:

Name | Type |
------ | ------ |
`observer?` | PartialObserver\<T> |

**Returns:** Subscription

▸ **subscribe**(`next`: null \| undefined, `error`: null \| undefined, `complete`: () => void): Subscription

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[subscribe](_suspensesubject_.suspensesubject.md#subscribe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:49*

**`deprecated`** Use an observer instead of a complete callback

#### Parameters:

Name | Type |
------ | ------ |
`next` | null \| undefined |
`error` | null \| undefined |
`complete` | () => void |

**Returns:** Subscription

▸ **subscribe**(`next`: null \| undefined, `error`: (error: any) => void, `complete?`: undefined \| () => void): Subscription

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[subscribe](_suspensesubject_.suspensesubject.md#subscribe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:51*

**`deprecated`** Use an observer instead of an error callback

#### Parameters:

Name | Type |
------ | ------ |
`next` | null \| undefined |
`error` | (error: any) => void |
`complete?` | undefined \| () => void |

**Returns:** Subscription

▸ **subscribe**(`next`: (value: T) => void, `error`: null \| undefined, `complete`: () => void): Subscription

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[subscribe](_suspensesubject_.suspensesubject.md#subscribe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:53*

**`deprecated`** Use an observer instead of a complete callback

#### Parameters:

Name | Type |
------ | ------ |
`next` | (value: T) => void |
`error` | null \| undefined |
`complete` | () => void |

**Returns:** Subscription

▸ **subscribe**(`next?`: undefined \| (value: T) => void, `error?`: undefined \| (error: any) => void, `complete?`: undefined \| () => void): Subscription

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[subscribe](_suspensesubject_.suspensesubject.md#subscribe)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:54*

#### Parameters:

Name | Type |
------ | ------ |
`next?` | undefined \| (value: T) => void |
`error?` | undefined \| (error: any) => void |
`complete?` | undefined \| () => void |

**Returns:** Subscription

___

### toPromise

▸ **toPromise**\<T>(`this`: Observable\<T>): Promise\<T>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[toPromise](_suspensesubject_.suspensesubject.md#topromise)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:88*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`this` | Observable\<T> |

**Returns:** Promise\<T>

▸ **toPromise**\<T>(`this`: Observable\<T>, `PromiseCtor`: *typeof* Promise): Promise\<T>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[toPromise](_suspensesubject_.suspensesubject.md#topromise)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:89*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`this` | Observable\<T> |
`PromiseCtor` | *typeof* Promise |

**Returns:** Promise\<T>

▸ **toPromise**\<T>(`this`: Observable\<T>, `PromiseCtor`: PromiseConstructorLike): Promise\<T>

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[toPromise](_suspensesubject_.suspensesubject.md#topromise)*

*Defined in node_modules/rxjs/internal/Observable.d.ts:90*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`this` | Observable\<T> |
`PromiseCtor` | PromiseConstructorLike |

**Returns:** Promise\<T>

___

### unsubscribe

▸ **unsubscribe**(): void

*Inherited from [SuspenseSubject](_suspensesubject_.suspensesubject.md).[unsubscribe](_suspensesubject_.suspensesubject.md#unsubscribe)*

*Defined in node_modules/rxjs/internal/Subject.d.ts:37*

**Returns:** void
