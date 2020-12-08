**[reactfire](../README.md)**

> [Globals](../globals.md) / "remote-config/index"

# Module: "remote-config/index"

## Index

### Interfaces

* [RemoteConfigWithPrivate](../interfaces/_remote_config_index_.remoteconfigwithprivate.md)

### Type aliases

* [Getter$](_remote_config_index_.md#getter$)
* [RemoteConfig](_remote_config_index_.md#remoteconfig)
* [RemoteConfigValue](_remote_config_index_.md#remoteconfigvalue)

### Functions

* [useRemoteConfigAll](_remote_config_index_.md#useremoteconfigall)
* [useRemoteConfigBoolean](_remote_config_index_.md#useremoteconfigboolean)
* [useRemoteConfigNumber](_remote_config_index_.md#useremoteconfignumber)
* [useRemoteConfigString](_remote_config_index_.md#useremoteconfigstring)
* [useRemoteConfigValue](_remote_config_index_.md#useremoteconfigvalue)
* [useRemoteConfigValue\_INTERNAL](_remote_config_index_.md#useremoteconfigvalue_internal)

## Type aliases

### Getter$

Ƭ  **Getter$**\<T>: (remoteConfig: RemoteConfig, key: string) => Observable\<T>

*Defined in [src/remote-config/index.tsx:8](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L8)*

#### Type parameters:

Name |
------ |
`T` |

___

### RemoteConfig

Ƭ  **RemoteConfig**: RemoteConfig

*Defined in [src/remote-config/index.tsx:6](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L6)*

___

### RemoteConfigValue

Ƭ  **RemoteConfigValue**: Value

*Defined in [src/remote-config/index.tsx:7](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L7)*

## Functions

### useRemoteConfigAll

▸ **useRemoteConfigAll**(`key`: string, `remoteConfig?`: [RemoteConfig](_remote_config_index_.md#remoteconfig)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<[AllParameters](_remote_config_getvalue_.md#allparameters)>

*Defined in [src/remote-config/index.tsx:79](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L79)*

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The parameter key in Remote Config |
`remoteConfig?` | [RemoteConfig](_remote_config_index_.md#remoteconfig) | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.  |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<[AllParameters](_remote_config_getvalue_.md#allparameters)>

___

### useRemoteConfigBoolean

▸ **useRemoteConfigBoolean**(`key`: string, `remoteConfig?`: [RemoteConfig](_remote_config_index_.md#remoteconfig)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<boolean>

*Defined in [src/remote-config/index.tsx:70](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L70)*

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The parameter key in Remote Config |
`remoteConfig?` | [RemoteConfig](_remote_config_index_.md#remoteconfig) | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.  |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<boolean>

___

### useRemoteConfigNumber

▸ **useRemoteConfigNumber**(`key`: string, `remoteConfig?`: [RemoteConfig](_remote_config_index_.md#remoteconfig)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<number>

*Defined in [src/remote-config/index.tsx:61](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L61)*

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The parameter key in Remote Config |
`remoteConfig?` | [RemoteConfig](_remote_config_index_.md#remoteconfig) | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.  |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<number>

___

### useRemoteConfigString

▸ **useRemoteConfigString**(`key`: string, `remoteConfig?`: [RemoteConfig](_remote_config_index_.md#remoteconfig)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<string>

*Defined in [src/remote-config/index.tsx:52](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L52)*

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The parameter key in Remote Config |
`remoteConfig?` | [RemoteConfig](_remote_config_index_.md#remoteconfig) | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.  |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<string>

___

### useRemoteConfigValue

▸ **useRemoteConfigValue**(`key`: string, `remoteConfig?`: [RemoteConfig](_remote_config_index_.md#remoteconfig)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<[RemoteConfigValue](_remote_config_index_.md#remoteconfigvalue)>

*Defined in [src/remote-config/index.tsx:43](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L43)*

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The parameter key in Remote Config |
`remoteConfig?` | [RemoteConfig](_remote_config_index_.md#remoteconfig) | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.  |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<[RemoteConfigValue](_remote_config_index_.md#remoteconfigvalue)>

___

### useRemoteConfigValue\_INTERNAL

▸ **useRemoteConfigValue_INTERNAL**\<T>(`key`: string, `getter`: [Getter$](_remote_config_index_.md#getter$)\<T>, `remoteConfig?`: [RemoteConfig](_remote_config_index_.md#remoteconfig)): [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>

*Defined in [src/remote-config/index.tsx:23](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L23)*

Helper function to construct type safe functions. Since Remote Config has
methods that return different types for values, we need to be extra safe
to make sure we are not returning improper types by accident.

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | string |  |
`getter` | [Getter$](_remote_config_index_.md#getter$)\<T> |  |
`remoteConfig?` | [RemoteConfig](_remote_config_index_.md#remoteconfig) |   |

**Returns:** [ObservableStatus](../interfaces/_useobservable_.observablestatus.md)\<T>
