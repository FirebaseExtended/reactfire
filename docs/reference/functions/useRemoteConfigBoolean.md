[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useRemoteConfigBoolean

# ~~Function: useRemoteConfigBoolean()~~

> **useRemoteConfigBoolean**(`key`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`boolean`\>

Defined in: [src/remote-config.tsx:130](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L130)

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

## Parameters

### key

`string`

The parameter key in Remote Config

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`boolean`\>

## Deprecated

Call `fetchAndActivate(remoteConfig)` and `getBoolean(remoteConfig, key)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
