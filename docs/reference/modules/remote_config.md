[ReactFire reference docs](../README.md) / remote-config

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

▸ **useRemoteConfigAll**(`key`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`AllParameters`\>

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`AllParameters`\>

#### Defined in

[src/remote-config.tsx:66](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L66)

___

### useRemoteConfigBoolean

▸ **useRemoteConfigBoolean**(`key`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`boolean`\>

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`boolean`\>

#### Defined in

[src/remote-config.tsx:58](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L58)

___

### useRemoteConfigNumber

▸ **useRemoteConfigNumber**(`key`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`number`\>

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`number`\>

#### Defined in

[src/remote-config.tsx:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L50)

___

### useRemoteConfigString

▸ **useRemoteConfigString**(`key`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`string`\>

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`string`\>

#### Defined in

[src/remote-config.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L42)

___

### useRemoteConfigValue

▸ **useRemoteConfigValue**(`key`): [`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`RemoteConfigValue`\>

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useObservable.ObservableStatus.md)<`RemoteConfigValue`\>

#### Defined in

[src/remote-config.tsx:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L34)
