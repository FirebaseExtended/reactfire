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

▸ **useRemoteConfigAll**(`key`): [`ObservableStatus`](useObservable.md#observablestatus)<`AllParameters`\>

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`AllParameters`\>

#### Defined in

[src/remote-config.tsx:66](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L66)

___

### useRemoteConfigBoolean

▸ **useRemoteConfigBoolean**(`key`): [`ObservableStatus`](useObservable.md#observablestatus)<`boolean`\>

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`boolean`\>

#### Defined in

[src/remote-config.tsx:58](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L58)

___

### useRemoteConfigNumber

▸ **useRemoteConfigNumber**(`key`): [`ObservableStatus`](useObservable.md#observablestatus)<`number`\>

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`number`\>

#### Defined in

[src/remote-config.tsx:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L50)

___

### useRemoteConfigString

▸ **useRemoteConfigString**(`key`): [`ObservableStatus`](useObservable.md#observablestatus)<`string`\>

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`string`\>

#### Defined in

[src/remote-config.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L42)

___

### useRemoteConfigValue

▸ **useRemoteConfigValue**(`key`): [`ObservableStatus`](useObservable.md#observablestatus)<`RemoteConfigValue`\>

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](useObservable.md#observablestatus)<`RemoteConfigValue`\>

#### Defined in

[src/remote-config.tsx:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L34)
