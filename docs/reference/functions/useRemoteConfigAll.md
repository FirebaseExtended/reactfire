[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useRemoteConfigAll

# ~~Function: useRemoteConfigAll()~~

> **useRemoteConfigAll**(`key`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`AllParameters`](../type-aliases/AllParameters.md)\>

Defined in: [src/remote-config.tsx:140](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L140)

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

## Parameters

### key

`string`

The parameter key in Remote Config

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`AllParameters`](../type-aliases/AllParameters.md)\>

## Deprecated

Call `fetchAndActivate(remoteConfig)` and `getAll(remoteConfig)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
