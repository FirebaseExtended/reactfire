**[reactfire](../README.md)**

> [Globals](../globals.md) / "remote-config/getValue"

# Module: "remote-config/getValue"

## Index

### Interfaces

* [ParameterSettings](../interfaces/_remote_config_getvalue_.parametersettings.md)

### Type aliases

* [AllParameters](_remote_config_getvalue_.md#allparameters)
* [RemoteConfig](_remote_config_getvalue_.md#remoteconfig)
* [RemoteConfigValue](_remote_config_getvalue_.md#remoteconfigvalue)

### Functions

* [getAll](_remote_config_getvalue_.md#getall)
* [getBoolean](_remote_config_getvalue_.md#getboolean)
* [getNumber](_remote_config_getvalue_.md#getnumber)
* [getString](_remote_config_getvalue_.md#getstring)
* [getValue](_remote_config_getvalue_.md#getvalue)
* [parameter$](_remote_config_getvalue_.md#parameter$)

## Type aliases

### AllParameters

Ƭ  **AllParameters**: { [key:string]: [RemoteConfigValue](_remote_config_getvalue_.md#remoteconfigvalue);  }

*Defined in [src/remote-config/getValue.tsx:6](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L6)*

___

### RemoteConfig

Ƭ  **RemoteConfig**: RemoteConfig

*Defined in [src/remote-config/getValue.tsx:3](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L3)*

___

### RemoteConfigValue

Ƭ  **RemoteConfigValue**: Value

*Defined in [src/remote-config/getValue.tsx:4](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L4)*

## Functions

### getAll

▸ **getAll**(`remoteConfig`: RemoteConfig): Observable\<[AllParameters](_remote_config_getvalue_.md#allparameters)>

*Defined in [src/remote-config/getValue.tsx:47](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L47)*

#### Parameters:

Name | Type |
------ | ------ |
`remoteConfig` | RemoteConfig |

**Returns:** Observable\<[AllParameters](_remote_config_getvalue_.md#allparameters)>

___

### getBoolean

▸ **getBoolean**(`remoteConfig`: RemoteConfig, `key`: string): Observable\<boolean>

*Defined in [src/remote-config/getValue.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L42)*

#### Parameters:

Name | Type |
------ | ------ |
`remoteConfig` | RemoteConfig |
`key` | string |

**Returns:** Observable\<boolean>

___

### getNumber

▸ **getNumber**(`remoteConfig`: RemoteConfig, `key`: string): Observable\<number>

*Defined in [src/remote-config/getValue.tsx:37](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L37)*

#### Parameters:

Name | Type |
------ | ------ |
`remoteConfig` | RemoteConfig |
`key` | string |

**Returns:** Observable\<number>

___

### getString

▸ **getString**(`remoteConfig`: RemoteConfig, `key`: string): Observable\<string>

*Defined in [src/remote-config/getValue.tsx:32](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L32)*

#### Parameters:

Name | Type |
------ | ------ |
`remoteConfig` | RemoteConfig |
`key` | string |

**Returns:** Observable\<string>

___

### getValue

▸ **getValue**(`remoteConfig`: RemoteConfig, `key`: string): Observable\<Value>

*Defined in [src/remote-config/getValue.tsx:27](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L27)*

#### Parameters:

Name | Type |
------ | ------ |
`remoteConfig` | RemoteConfig |
`key` | string |

**Returns:** Observable\<Value>

___

### parameter$

▸ **parameter$**\<T>(`__namedParameters`: { getter: (key: string) => T ; key: string ; remoteConfig: RemoteConfig  }): Observable\<T>

*Defined in [src/remote-config/getValue.tsx:17](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/remote-config/getValue.tsx#L17)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { getter: (key: string) => T ; key: string ; remoteConfig: RemoteConfig  } |

**Returns:** Observable\<T>
