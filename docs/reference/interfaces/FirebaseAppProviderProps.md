[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / FirebaseAppProviderProps

# ~~Interface: FirebaseAppProviderProps~~

Defined in: [src/firebaseApp.tsx:17](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L17)

## Deprecated

`<FirebaseAppProvider>` is deprecated and will be removed in v5.0.0. Initialize your Firebase app at module scope (`export const app = initializeApp(config)`) and pass SDK instances or references directly to ReactFire hooks.

## Properties

### ~~appName?~~

> `optional` **appName?**: `string`

Defined in: [src/firebaseApp.tsx:20](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L20)

***

### ~~firebaseApp?~~

> `optional` **firebaseApp?**: `FirebaseApp`

Defined in: [src/firebaseApp.tsx:18](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L18)

***

### ~~firebaseConfig?~~

> `optional` **firebaseConfig?**: `FirebaseOptions`

Defined in: [src/firebaseApp.tsx:19](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L19)

***

### ~~suspense?~~

> `optional` **suspense?**: `boolean`

Defined in: [src/firebaseApp.tsx:24](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L24)

#### Deprecated

Pass `hook().experimental_usable` (or `hook().usable`) to `React.use()` instead of setting `suspense={true}`.
