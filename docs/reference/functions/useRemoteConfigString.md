[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useRemoteConfigString

# ~~Function: useRemoteConfigString()~~

> **useRemoteConfigString**(`key`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`string`\>

Defined in: [src/remote-config.tsx:110](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L110)

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

## Parameters

### key

`string`

The parameter key in Remote Config

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`string`\>

## Deprecated

Call `fetchAndActivate(remoteConfig)` and `getString(remoteConfig, key)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
