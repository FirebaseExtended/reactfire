**[reactfire](../README.md)**

> [Globals](../globals.md) / ["remote-config/index"](../modules/_remote_config_index_.md) / RemoteConfigWithPrivate

# Interface: RemoteConfigWithPrivate

## Hierarchy

* RemoteConfig

  ↳ **RemoteConfigWithPrivate**

## Index

### Properties

* [\_storage](_remote_config_index_.remoteconfigwithprivate.md#_storage)
* [defaultConfig](_remote_config_index_.remoteconfigwithprivate.md#defaultconfig)
* [fetchTimeMillis](_remote_config_index_.remoteconfigwithprivate.md#fetchtimemillis)
* [lastFetchStatus](_remote_config_index_.remoteconfigwithprivate.md#lastfetchstatus)
* [settings](_remote_config_index_.remoteconfigwithprivate.md#settings)

### Methods

* [activate](_remote_config_index_.remoteconfigwithprivate.md#activate)
* [ensureInitialized](_remote_config_index_.remoteconfigwithprivate.md#ensureinitialized)
* [fetch](_remote_config_index_.remoteconfigwithprivate.md#fetch)
* [fetchAndActivate](_remote_config_index_.remoteconfigwithprivate.md#fetchandactivate)
* [getAll](_remote_config_index_.remoteconfigwithprivate.md#getall)
* [getBoolean](_remote_config_index_.remoteconfigwithprivate.md#getboolean)
* [getNumber](_remote_config_index_.remoteconfigwithprivate.md#getnumber)
* [getString](_remote_config_index_.remoteconfigwithprivate.md#getstring)
* [getValue](_remote_config_index_.remoteconfigwithprivate.md#getvalue)
* [setLogLevel](_remote_config_index_.remoteconfigwithprivate.md#setloglevel)

## Properties

### \_storage

• `Optional` **\_storage**: undefined \| { appName: string  }

*Defined in [src/remote-config/index.tsx:12](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/index.tsx#L12)*

___

### defaultConfig

•  **defaultConfig**: { [key:string]: string \| number \| boolean;  }

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[defaultConfig](_remote_config_index_.remoteconfigwithprivate.md#defaultconfig)*

*Defined in node_modules/firebase/index.d.ts:1627*

Object containing default values for conigs.

___

### fetchTimeMillis

•  **fetchTimeMillis**: number

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[fetchTimeMillis](_remote_config_index_.remoteconfigwithprivate.md#fetchtimemillis)*

*Defined in node_modules/firebase/index.d.ts:1634*

The Unix timestamp in milliseconds of the last <i>successful</i> fetch, or negative one if
the [RemoteConfig](../modules/_remote_config_index_.md#remoteconfig) instance either hasn't fetched or initialization
is incomplete.

___

### lastFetchStatus

•  **lastFetchStatus**: FetchStatus

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[lastFetchStatus](_remote_config_index_.remoteconfigwithprivate.md#lastfetchstatus)*

*Defined in node_modules/firebase/index.d.ts:1639*

The status of the last fetch <i>attempt</i>.

___

### settings

•  **settings**: Settings

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[settings](_remote_config_index_.remoteconfigwithprivate.md#settings)*

*Defined in node_modules/firebase/index.d.ts:1622*

Defines configuration for the Remote Config SDK.

## Methods

### activate

▸ **activate**(): Promise\<boolean>

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[activate](_remote_config_index_.remoteconfigwithprivate.md#activate)*

*Defined in node_modules/firebase/index.d.ts:1646*

Makes the last fetched config available to the getters.
Returns a promise which resolves to true if the current call activated the fetched configs.
If the fetched configs were already activated, the promise will resolve to false.

**Returns:** Promise\<boolean>

___

### ensureInitialized

▸ **ensureInitialized**(): Promise\<void>

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[ensureInitialized](_remote_config_index_.remoteconfigwithprivate.md#ensureinitialized)*

*Defined in node_modules/firebase/index.d.ts:1651*

Ensures the last activated config are available to the getters.

**Returns:** Promise\<void>

___

### fetch

▸ **fetch**(): Promise\<void>

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[fetch](_remote_config_index_.remoteconfigwithprivate.md#fetch)*

*Defined in node_modules/firebase/index.d.ts:1656*

Fetches and caches configuration from the Remote Config service.

**Returns:** Promise\<void>

___

### fetchAndActivate

▸ **fetchAndActivate**(): Promise\<boolean>

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[fetchAndActivate](_remote_config_index_.remoteconfigwithprivate.md#fetchandactivate)*

*Defined in node_modules/firebase/index.d.ts:1663*

Performs fetch and activate operations, as a convenience.
Returns a promise which resolves to true if the current call activated the fetched configs.
If the fetched configs were already activated, the promise will resolve to false.

**Returns:** Promise\<boolean>

___

### getAll

▸ **getAll**(): object

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[getAll](_remote_config_index_.remoteconfigwithprivate.md#getall)*

*Defined in node_modules/firebase/index.d.ts:1668*

Gets all config.

**Returns:** object

___

### getBoolean

▸ **getBoolean**(`key`: string): boolean

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[getBoolean](_remote_config_index_.remoteconfigwithprivate.md#getboolean)*

*Defined in node_modules/firebase/index.d.ts:1675*

Gets the value for the given key as a boolean.

Convenience method for calling <code>remoteConfig.getValue(key).asBoolean()</code>.

#### Parameters:

Name | Type |
------ | ------ |
`key` | string |

**Returns:** boolean

___

### getNumber

▸ **getNumber**(`key`: string): number

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[getNumber](_remote_config_index_.remoteconfigwithprivate.md#getnumber)*

*Defined in node_modules/firebase/index.d.ts:1682*

Gets the value for the given key as a number.

Convenience method for calling <code>remoteConfig.getValue(key).asNumber()</code>.

#### Parameters:

Name | Type |
------ | ------ |
`key` | string |

**Returns:** number

___

### getString

▸ **getString**(`key`: string): string

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[getString](_remote_config_index_.remoteconfigwithprivate.md#getstring)*

*Defined in node_modules/firebase/index.d.ts:1689*

Gets the value for the given key as a String.

Convenience method for calling <code>remoteConfig.getValue(key).asString()</code>.

#### Parameters:

Name | Type |
------ | ------ |
`key` | string |

**Returns:** string

___

### getValue

▸ **getValue**(`key`: string): Value

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[getValue](_remote_config_index_.remoteconfigwithprivate.md#getvalue)*

*Defined in node_modules/firebase/index.d.ts:1694*

Gets the {@link Value} for the given key.

#### Parameters:

Name | Type |
------ | ------ |
`key` | string |

**Returns:** Value

___

### setLogLevel

▸ **setLogLevel**(`logLevel`: LogLevel): void

*Inherited from [RemoteConfigWithPrivate](_remote_config_index_.remoteconfigwithprivate.md).[setLogLevel](_remote_config_index_.remoteconfigwithprivate.md#setloglevel)*

*Defined in node_modules/firebase/index.d.ts:1699*

Defines the log level to use.

#### Parameters:

Name | Type |
------ | ------ |
`logLevel` | LogLevel |

**Returns:** void
