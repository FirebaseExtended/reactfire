**[reactfire](../README.md)**

> [Globals](../globals.md) / "firebaseApp"

# Module: "firebaseApp"

## Index

### References

* [PreloadOptions](_firebaseapp_.md#preloadoptions)
* [analytics](_firebaseapp_.md#analytics)
* [auth](_firebaseapp_.md#auth)
* [database](_firebaseapp_.md#database)
* [firestore](_firebaseapp_.md#firestore)
* [functions](_firebaseapp_.md#functions)
* [messaging](_firebaseapp_.md#messaging)
* [performance](_firebaseapp_.md#performance)
* [preloadAnalytics](_firebaseapp_.md#preloadanalytics)
* [preloadAuth](_firebaseapp_.md#preloadauth)
* [preloadDatabase](_firebaseapp_.md#preloaddatabase)
* [preloadFirestore](_firebaseapp_.md#preloadfirestore)
* [preloadFunctions](_firebaseapp_.md#preloadfunctions)
* [preloadMessaging](_firebaseapp_.md#preloadmessaging)
* [preloadPerformance](_firebaseapp_.md#preloadperformance)
* [preloadRemoteConfig](_firebaseapp_.md#preloadremoteconfig)
* [preloadStorage](_firebaseapp_.md#preloadstorage)
* [remoteConfig](_firebaseapp_.md#remoteconfig)
* [storage](_firebaseapp_.md#storage)
* [useAnalytics](_firebaseapp_.md#useanalytics)
* [useAuth](_firebaseapp_.md#useauth)
* [useDatabase](_firebaseapp_.md#usedatabase)
* [useFirestore](_firebaseapp_.md#usefirestore)
* [useFunctions](_firebaseapp_.md#usefunctions)
* [useMessaging](_firebaseapp_.md#usemessaging)
* [usePerformance](_firebaseapp_.md#useperformance)
* [useRemoteConfig](_firebaseapp_.md#useremoteconfig)
* [useStorage](_firebaseapp_.md#usestorage)

### Type aliases

* [FirebaseAppContextValue](_firebaseapp_.md#firebaseappcontextvalue)
* [Props](_firebaseapp_.md#props)

### Variables

* [DEFAULT\_APP\_NAME](_firebaseapp_.md#default_app_name)
* [FirebaseAppContext](_firebaseapp_.md#firebaseappcontext)
* [SuspenseEnabledContext](_firebaseapp_.md#suspenseenabledcontext)
* [version](_firebaseapp_.md#version)

### Functions

* [FirebaseAppProvider](_firebaseapp_.md#firebaseappprovider)
* [shallowEq](_firebaseapp_.md#shalloweq)
* [useFirebaseApp](_firebaseapp_.md#usefirebaseapp)
* [useIsSuspenseEnabled](_firebaseapp_.md#useissuspenseenabled)
* [useSuspenseEnabledFromConfigAndContext](_firebaseapp_.md#usesuspenseenabledfromconfigandcontext)

## References

### PreloadOptions

Re-exports: [PreloadOptions](_sdk_.md#preloadoptions)

___

### analytics

Re-exports: [analytics](_sdk_.md#analytics)

___

### auth

Re-exports: [auth](_sdk_.md#auth)

___

### database

Re-exports: [database](_sdk_.md#database)

___

### firestore

Re-exports: [firestore](_sdk_.md#firestore)

___

### functions

Re-exports: [functions](_sdk_.md#functions)

___

### messaging

Re-exports: [messaging](_sdk_.md#messaging)

___

### performance

Re-exports: [performance](_sdk_.md#performance)

___

### preloadAnalytics

Re-exports: [preloadAnalytics](_sdk_.md#preloadanalytics)

___

### preloadAuth

Re-exports: [preloadAuth](_sdk_.md#preloadauth)

___

### preloadDatabase

Re-exports: [preloadDatabase](_sdk_.md#preloaddatabase)

___

### preloadFirestore

Re-exports: [preloadFirestore](_sdk_.md#preloadfirestore)

___

### preloadFunctions

Re-exports: [preloadFunctions](_sdk_.md#preloadfunctions)

___

### preloadMessaging

Re-exports: [preloadMessaging](_sdk_.md#preloadmessaging)

___

### preloadPerformance

Re-exports: [preloadPerformance](_sdk_.md#preloadperformance)

___

### preloadRemoteConfig

Re-exports: [preloadRemoteConfig](_sdk_.md#preloadremoteconfig)

___

### preloadStorage

Re-exports: [preloadStorage](_sdk_.md#preloadstorage)

___

### remoteConfig

Re-exports: [remoteConfig](_sdk_.md#remoteconfig)

___

### storage

Re-exports: [storage](_sdk_.md#storage)

___

### useAnalytics

Re-exports: [useAnalytics](_sdk_.md#useanalytics)

___

### useAuth

Re-exports: [useAuth](_sdk_.md#useauth)

___

### useDatabase

Re-exports: [useDatabase](_sdk_.md#usedatabase)

___

### useFirestore

Re-exports: [useFirestore](_sdk_.md#usefirestore)

___

### useFunctions

Re-exports: [useFunctions](_sdk_.md#usefunctions)

___

### useMessaging

Re-exports: [useMessaging](_sdk_.md#usemessaging)

___

### usePerformance

Re-exports: [usePerformance](_sdk_.md#useperformance)

___

### useRemoteConfig

Re-exports: [useRemoteConfig](_sdk_.md#useremoteconfig)

___

### useStorage

Re-exports: [useStorage](_sdk_.md#usestorage)

## Type aliases

### FirebaseAppContextValue

Ƭ  **FirebaseAppContextValue**: App

*Defined in [src/firebaseApp.tsx:6](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L6)*

___

### Props

Ƭ  **Props**: { appName?: undefined \| string ; firebaseApp?: firebase.app.App ; firebaseConfig?: Object ; suspense?: undefined \| false \| true  }

*Defined in [src/firebaseApp.tsx:15](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L15)*

#### Type declaration:

Name | Type |
------ | ------ |
`appName?` | undefined \| string |
`firebaseApp?` | firebase.app.App |
`firebaseConfig?` | Object |
`suspense?` | undefined \| false \| true |

## Variables

### DEFAULT\_APP\_NAME

• `Const` **DEFAULT\_APP\_NAME**: \"[DEFAULT]\" = "[DEFAULT]"

*Defined in [src/firebaseApp.tsx:9](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L9)*

___

### FirebaseAppContext

• `Const` **FirebaseAppContext**: Context\<undefined \| App> = React.createContext\<FirebaseAppContextValue \| undefined>(undefined)

*Defined in [src/firebaseApp.tsx:11](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L11)*

___

### SuspenseEnabledContext

• `Const` **SuspenseEnabledContext**: Context\<boolean> = React.createContext\<boolean>(false)

*Defined in [src/firebaseApp.tsx:13](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L13)*

___

### version

• `Const` **version**: any = \_\_REACTFIRE\_VERSION\_\_

*Defined in [src/firebaseApp.tsx:23](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L23)*

## Functions

### FirebaseAppProvider

▸ **FirebaseAppProvider**(`props`: [Props](_firebaseapp_.md#props) & { [key:string]: unknown;  }): Element

*Defined in [src/firebaseApp.tsx:27](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L27)*

#### Parameters:

Name | Type |
------ | ------ |
`props` | [Props](_firebaseapp_.md#props) & { [key:string]: unknown;  } |

**Returns:** Element

___

### shallowEq

▸ `Const`**shallowEq**(`a`: { [key:string]: any;  }, `b`: { [key:string]: any;  }): boolean

*Defined in [src/firebaseApp.tsx:25](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L25)*

#### Parameters:

Name | Type |
------ | ------ |
`a` | { [key:string]: any;  } |
`b` | { [key:string]: any;  } |

**Returns:** boolean

___

### useFirebaseApp

▸ **useFirebaseApp**(): App

*Defined in [src/firebaseApp.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L82)*

**Returns:** App

___

### useIsSuspenseEnabled

▸ **useIsSuspenseEnabled**(): boolean

*Defined in [src/firebaseApp.tsx:64](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L64)*

**Returns:** boolean

___

### useSuspenseEnabledFromConfigAndContext

▸ **useSuspenseEnabledFromConfigAndContext**(`suspenseFromConfig?`: undefined \| false \| true): boolean

*Defined in [src/firebaseApp.tsx:71](https://github.com/FirebaseExtended/reactfire/blob/16b6188/src/firebaseApp.tsx#L71)*

#### Parameters:

Name | Type |
------ | ------ |
`suspenseFromConfig?` | undefined \| false \| true |

**Returns:** boolean
