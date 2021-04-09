[reactfire](../README.md) / [Exports](../modules.md) / remote-config

# Module: remote-config

## Table of contents

### Functions

- [useRemoteConfigAll](remote_config.md#useremoteconfigall)
- [useRemoteConfigBoolean](remote_config.md#useremoteconfigboolean)
- [useRemoteConfigNumber](remote_config.md#useremoteconfignumber)
- [useRemoteConfigString](remote_config.md#useremoteconfigstring)
- [useRemoteConfigValue](remote_config.md#useremoteconfigvalue)

## Functions

### useRemoteConfigAll

▸ **useRemoteConfigAll**(`key`: *string*, `remoteConfig?`: RemoteConfig): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<[*AllParameters*](remote_config_getvalue.md#allparameters)\>

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | *string* | The parameter key in Remote Config   |
`remoteConfig?` | RemoteConfig | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.    |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<[*AllParameters*](remote_config_getvalue.md#allparameters)\>

Defined in: [src/remote-config/index.tsx:79](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L79)

___

### useRemoteConfigBoolean

▸ **useRemoteConfigBoolean**(`key`: *string*, `remoteConfig?`: RemoteConfig): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<boolean\>

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | *string* | The parameter key in Remote Config   |
`remoteConfig?` | RemoteConfig | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.    |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<boolean\>

Defined in: [src/remote-config/index.tsx:70](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L70)

___

### useRemoteConfigNumber

▸ **useRemoteConfigNumber**(`key`: *string*, `remoteConfig?`: RemoteConfig): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<number\>

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | *string* | The parameter key in Remote Config   |
`remoteConfig?` | RemoteConfig | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.    |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<number\>

Defined in: [src/remote-config/index.tsx:61](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L61)

___

### useRemoteConfigString

▸ **useRemoteConfigString**(`key`: *string*, `remoteConfig?`: RemoteConfig): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<string\>

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | *string* | The parameter key in Remote Config   |
`remoteConfig?` | RemoteConfig | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.    |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<string\>

Defined in: [src/remote-config/index.tsx:52](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L52)

___

### useRemoteConfigValue

▸ **useRemoteConfigValue**(`key`: *string*, `remoteConfig?`: RemoteConfig): [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<RemoteConfigValue\>

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | *string* | The parameter key in Remote Config   |
`remoteConfig?` | RemoteConfig | Optional instance. If not provided ReactFire will either grab the default instance or lazy load.    |

**Returns:** [*ObservableStatus*](../interfaces/useobservable.observablestatus.md)<RemoteConfigValue\>

Defined in: [src/remote-config/index.tsx:43](https://github.com/FirebaseExtended/reactfire/blob/master/src/remote-config/index.tsx#L43)
