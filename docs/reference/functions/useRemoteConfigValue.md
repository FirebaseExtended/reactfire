[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useRemoteConfigValue

# ~~Function: useRemoteConfigValue()~~

> **useRemoteConfigValue**(`key`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`Value`\>

Defined in: [src/remote-config.tsx:100](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L100)

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

## Parameters

### key

`string`

The parameter key in Remote Config

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`Value`\>

## Deprecated

Call `fetchAndActivate(remoteConfig)` and synchronous getters (`getValue(remoteConfig, key)`) from `firebase/remote-config` directly. Will be removed in v5.0.0.
