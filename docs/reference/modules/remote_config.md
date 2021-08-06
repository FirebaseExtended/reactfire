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

▸ **useRemoteConfigAll**(`key`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<[`AllParameters`](remote_config_getvalue.md#allparameters)\>

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<[`AllParameters`](remote_config_getvalue.md#allparameters)\>

#### Defined in

[src/remote-config/index.tsx:78](https://github.com/sujishpatel/reactfire/blob/main/src/remote-config/index.tsx#L78)

___

### useRemoteConfigBoolean

▸ **useRemoteConfigBoolean**(`key`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`boolean`\>

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`boolean`\>

#### Defined in

[src/remote-config/index.tsx:69](https://github.com/sujishpatel/reactfire/blob/main/src/remote-config/index.tsx#L69)

___

### useRemoteConfigNumber

▸ **useRemoteConfigNumber**(`key`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`number`\>

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`number`\>

#### Defined in

[src/remote-config/index.tsx:60](https://github.com/sujishpatel/reactfire/blob/main/src/remote-config/index.tsx#L60)

___

### useRemoteConfigString

▸ **useRemoteConfigString**(`key`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`string`\>

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`string`\>

#### Defined in

[src/remote-config/index.tsx:51](https://github.com/sujishpatel/reactfire/blob/main/src/remote-config/index.tsx#L51)

___

### useRemoteConfigValue

▸ **useRemoteConfigValue**(`key`): [`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`RemoteConfigValue`\>

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](../interfaces/useobservable.observablestatus.md)<`RemoteConfigValue`\>

#### Defined in

[src/remote-config/index.tsx:42](https://github.com/sujishpatel/reactfire/blob/main/src/remote-config/index.tsx#L42)
