[ReactFire reference docs](../README.md) / remote-config/getValue

# Module: remote-config/getValue

## Table of contents

### Type aliases

- [AllParameters](remote_config_getvalue.md#allparameters)

### Functions

- [getAll](remote_config_getvalue.md#getall)
- [getBoolean](remote_config_getvalue.md#getboolean)
- [getNumber](remote_config_getvalue.md#getnumber)
- [getString](remote_config_getvalue.md#getstring)
- [getValue](remote_config_getvalue.md#getvalue)

## Type aliases

### AllParameters

Ƭ **AllParameters**: *object*

#### Type declaration:

Defined in: [src/remote-config/getValue.tsx:6](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config/getValue.tsx#L6)

## Functions

### getAll

▸ **getAll**(`remoteConfig`: RemoteConfig): *Observable*<[*AllParameters*](remote_config_getvalue.md#allparameters)\>

#### Parameters:

Name | Type |
:------ | :------ |
`remoteConfig` | RemoteConfig |

**Returns:** *Observable*<[*AllParameters*](remote_config_getvalue.md#allparameters)\>

Defined in: [src/remote-config/getValue.tsx:47](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config/getValue.tsx#L47)

___

### getBoolean

▸ **getBoolean**(`remoteConfig`: RemoteConfig, `key`: *string*): *Observable*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`remoteConfig` | RemoteConfig |
`key` | *string* |

**Returns:** *Observable*<boolean\>

Defined in: [src/remote-config/getValue.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config/getValue.tsx#L42)

___

### getNumber

▸ **getNumber**(`remoteConfig`: RemoteConfig, `key`: *string*): *Observable*<number\>

#### Parameters:

Name | Type |
:------ | :------ |
`remoteConfig` | RemoteConfig |
`key` | *string* |

**Returns:** *Observable*<number\>

Defined in: [src/remote-config/getValue.tsx:37](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config/getValue.tsx#L37)

___

### getString

▸ **getString**(`remoteConfig`: RemoteConfig, `key`: *string*): *Observable*<string\>

#### Parameters:

Name | Type |
:------ | :------ |
`remoteConfig` | RemoteConfig |
`key` | *string* |

**Returns:** *Observable*<string\>

Defined in: [src/remote-config/getValue.tsx:32](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config/getValue.tsx#L32)

___

### getValue

▸ **getValue**(`remoteConfig`: RemoteConfig, `key`: *string*): *Observable*<Value\>

#### Parameters:

Name | Type |
:------ | :------ |
`remoteConfig` | RemoteConfig |
`key` | *string* |

**Returns:** *Observable*<Value\>

Defined in: [src/remote-config/getValue.tsx:27](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config/getValue.tsx#L27)
