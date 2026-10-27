[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useRemoteConfigNumber

# ~~Function: useRemoteConfigNumber()~~

> **useRemoteConfigNumber**(`key`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`number`\>

Defined in: [src/remote-config.tsx:120](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L120)

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

## Parameters

### key

`string`

The parameter key in Remote Config

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`number`\>

## Deprecated

Call `fetchAndActivate(remoteConfig)` and `getNumber(remoteConfig, key)` from `firebase/remote-config` directly. Will be removed in v5.0.0.
