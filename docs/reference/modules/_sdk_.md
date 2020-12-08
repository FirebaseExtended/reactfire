**[reactfire](../README.md)**

> [Globals](../globals.md) / "sdk"

# Module: "sdk"

## Index

### Type aliases

* [App](_sdk_.md#app)
* [ComponentName](_sdk_.md#componentname)
* [FirebaseInstanceFactory](_sdk_.md#firebaseinstancefactory)
* [FirebaseNamespaceComponent](_sdk_.md#firebasenamespacecomponent)
* [PreloadOptions](_sdk_.md#preloadoptions)
* [ValueOf](_sdk_.md#valueof)

### Variables

* [analytics](_sdk_.md#analytics)
* [auth](_sdk_.md#auth)
* [database](_sdk_.md#database)
* [firestore](_sdk_.md#firestore)
* [functions](_sdk_.md#functions)
* [messaging](_sdk_.md#messaging)
* [performance](_sdk_.md#performance)
* [preloadAnalytics](_sdk_.md#preloadanalytics)
* [preloadAuth](_sdk_.md#preloadauth)
* [preloadDatabase](_sdk_.md#preloaddatabase)
* [preloadFirestore](_sdk_.md#preloadfirestore)
* [preloadFunctions](_sdk_.md#preloadfunctions)
* [preloadMessaging](_sdk_.md#preloadmessaging)
* [preloadPerformance](_sdk_.md#preloadperformance)
* [preloadRemoteConfig](_sdk_.md#preloadremoteconfig)
* [preloadStorage](_sdk_.md#preloadstorage)
* [remoteConfig](_sdk_.md#remoteconfig)
* [storage](_sdk_.md#storage)
* [useAnalytics](_sdk_.md#useanalytics)
* [useAuth](_sdk_.md#useauth)
* [useDatabase](_sdk_.md#usedatabase)
* [useFirestore](_sdk_.md#usefirestore)
* [useFunctions](_sdk_.md#usefunctions)
* [useMessaging](_sdk_.md#usemessaging)
* [usePerformance](_sdk_.md#useperformance)
* [useRemoteConfig](_sdk_.md#useremoteconfig)
* [useStorage](_sdk_.md#usestorage)

### Functions

* [importSDK](_sdk_.md#importsdk)
* [preload](_sdk_.md#preload)
* [preloadFactory](_sdk_.md#preloadfactory)
* [proxyComponent](_sdk_.md#proxycomponent)

## Type aliases

### App

Ƭ  **App**: App

*Defined in [src/sdk.tsx:8](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L8)*

___

### ComponentName

Ƭ  **ComponentName**: \"analytics\" \| \"auth\" \| \"database\" \| \"firestore\" \| \"functions\" \| \"messaging\" \| \"performance\" \| \"remoteConfig\" \| \"storage\"

*Defined in [src/sdk.tsx:5](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L5)*

___

### FirebaseInstanceFactory

Ƭ  **FirebaseInstanceFactory**: [ValueOf](_sdk_.md#valueof)\<Pick\<App, [ComponentName](_sdk_.md#componentname)>>

*Defined in [src/sdk.tsx:9](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L9)*

___

### FirebaseNamespaceComponent

Ƭ  **FirebaseNamespaceComponent**: [ValueOf](_sdk_.md#valueof)\<Pick\<*typeof* firebase, [ComponentName](_sdk_.md#componentname)>>

*Defined in [src/sdk.tsx:10](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L10)*

___

### PreloadOptions

Ƭ  **PreloadOptions**\<T>: { firebaseApp: App ; setup?: undefined \| (instanceFactory: T) => void \| Promise\<any> ; suspense?: undefined \| false \| true  }

*Defined in [src/sdk.tsx:99](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L99)*

#### Type parameters:

Name |
------ |
`T` |

#### Type declaration:

Name | Type |
------ | ------ |
`firebaseApp` | App |
`setup?` | undefined \| (instanceFactory: T) => void \| Promise\<any> |
`suspense?` | undefined \| false \| true |

___

### ValueOf

Ƭ  **ValueOf**\<T>: T[keyof T]

*Defined in [src/sdk.tsx:7](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L7)*

#### Type parameters:

Name |
------ |
`T` |

## Variables

### analytics

• `Const` **analytics**: analytics = useAnalytics

*Defined in [src/sdk.tsx:90](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L90)*

___

### auth

• `Const` **auth**: auth = useAuth

*Defined in [src/sdk.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L89)*

___

### database

• `Const` **database**: database = useDatabase

*Defined in [src/sdk.tsx:91](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L91)*

___

### firestore

• `Const` **firestore**: firestore = useFirestore

*Defined in [src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L92)*

___

### functions

• `Const` **functions**: functions = useFunctions

*Defined in [src/sdk.tsx:93](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L93)*

___

### messaging

• `Const` **messaging**: messaging = useMessaging

*Defined in [src/sdk.tsx:94](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L94)*

___

### performance

• `Const` **performance**: performance = usePerformance

*Defined in [src/sdk.tsx:95](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L95)*

___

### preloadAnalytics

• `Const` **preloadAnalytics**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"analytics\"]>) => Promise\<App[\"analytics\"]> = preloadFactory('analytics')

*Defined in [src/sdk.tsx:141](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L141)*

___

### preloadAuth

• `Const` **preloadAuth**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"auth\"]>) => Promise\<App[\"auth\"]> = preloadFactory('auth')

*Defined in [src/sdk.tsx:140](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L140)*

___

### preloadDatabase

• `Const` **preloadDatabase**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"database\"]>) => Promise\<App[\"database\"]> = preloadFactory('database')

*Defined in [src/sdk.tsx:142](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L142)*

___

### preloadFirestore

• `Const` **preloadFirestore**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"firestore\"]>) => Promise\<App[\"firestore\"]> = preloadFactory('firestore')

*Defined in [src/sdk.tsx:143](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L143)*

___

### preloadFunctions

• `Const` **preloadFunctions**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"functions\"]>) => Promise\<App[\"functions\"]> = preloadFactory('functions')

*Defined in [src/sdk.tsx:144](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L144)*

___

### preloadMessaging

• `Const` **preloadMessaging**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"messaging\"]>) => Promise\<App[\"messaging\"]> = preloadFactory('messaging')

*Defined in [src/sdk.tsx:145](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L145)*

___

### preloadPerformance

• `Const` **preloadPerformance**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"performance\"]>) => Promise\<App[\"performance\"]> = preloadFactory('performance')

*Defined in [src/sdk.tsx:146](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L146)*

___

### preloadRemoteConfig

• `Const` **preloadRemoteConfig**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"remoteConfig\"]>) => Promise\<App[\"remoteConfig\"]> = preloadFactory('remoteConfig')

*Defined in [src/sdk.tsx:147](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L147)*

___

### preloadStorage

• `Const` **preloadStorage**: (options: [PreloadOptions](_sdk_.md#preloadoptions)\<App[\"storage\"]>) => Promise\<App[\"storage\"]> = preloadFactory('storage')

*Defined in [src/sdk.tsx:148](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L148)*

___

### remoteConfig

• `Const` **remoteConfig**: remoteConfig = useRemoteConfig

*Defined in [src/sdk.tsx:96](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L96)*

___

### storage

• `Const` **storage**: storage = useStorage

*Defined in [src/sdk.tsx:97](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L97)*

___

### useAnalytics

• `Const` **useAnalytics**: analytics = proxyComponent('analytics')

*Defined in [src/sdk.tsx:80](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L80)*

___

### useAuth

• `Const` **useAuth**: auth = proxyComponent('auth')

*Defined in [src/sdk.tsx:79](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L79)*

___

### useDatabase

• `Const` **useDatabase**: database = proxyComponent('database')

*Defined in [src/sdk.tsx:81](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L81)*

___

### useFirestore

• `Const` **useFirestore**: firestore = proxyComponent('firestore')

*Defined in [src/sdk.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L82)*

___

### useFunctions

• `Const` **useFunctions**: functions = proxyComponent('functions')

*Defined in [src/sdk.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L83)*

___

### useMessaging

• `Const` **useMessaging**: messaging = proxyComponent('messaging')

*Defined in [src/sdk.tsx:84](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L84)*

___

### usePerformance

• `Const` **usePerformance**: performance = proxyComponent('performance')

*Defined in [src/sdk.tsx:85](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L85)*

___

### useRemoteConfig

• `Const` **useRemoteConfig**: remoteConfig = proxyComponent('remoteConfig')

*Defined in [src/sdk.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L86)*

___

### useStorage

• `Const` **useStorage**: storage = proxyComponent('storage')

*Defined in [src/sdk.tsx:87](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L87)*

## Functions

### importSDK

▸ **importSDK**(`sdk`: [ComponentName](_sdk_.md#componentname)): Promise\<any>

*Defined in [src/sdk.tsx:12](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L12)*

#### Parameters:

Name | Type |
------ | ------ |
`sdk` | [ComponentName](_sdk_.md#componentname) |

**Returns:** Promise\<any>

___

### preload

▸ **preload**(`componentName`: [ComponentName](_sdk_.md#componentname), `firebaseApp`: App, `settingsCallback?`: (instanceFactory: [FirebaseInstanceFactory](_sdk_.md#firebaseinstancefactory)) => any): [SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<unknown>

*Defined in [src/sdk.tsx:118](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L118)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`componentName` | [ComponentName](_sdk_.md#componentname) | - |
`firebaseApp` | App | - |
`settingsCallback` | (instanceFactory: [FirebaseInstanceFactory](_sdk_.md#firebaseinstancefactory)) => any | () => {} |

**Returns:** [SuspenseSubject](../classes/_suspensesubject_.suspensesubject.md)\<unknown>

___

### preloadFactory

▸ **preloadFactory**(`componentName`: \"auth\"): function

*Defined in [src/sdk.tsx:105](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L105)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"auth\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"analytics\"): function

*Defined in [src/sdk.tsx:106](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L106)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"analytics\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"database\"): function

*Defined in [src/sdk.tsx:107](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L107)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"database\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"firestore\"): function

*Defined in [src/sdk.tsx:108](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L108)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"firestore\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"functions\"): function

*Defined in [src/sdk.tsx:109](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L109)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"functions\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"messaging\"): function

*Defined in [src/sdk.tsx:110](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L110)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"messaging\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"performance\"): function

*Defined in [src/sdk.tsx:111](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L111)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"performance\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"remoteConfig\"): function

*Defined in [src/sdk.tsx:112](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L112)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"remoteConfig\" |

**Returns:** function

▸ **preloadFactory**(`componentName`: \"storage\"): function

*Defined in [src/sdk.tsx:113](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L113)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"storage\" |

**Returns:** function

___

### proxyComponent

▸ **proxyComponent**(`componentName`: \"auth\"): *typeof* auth

*Defined in [src/sdk.tsx:35](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L35)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"auth\" |

**Returns:** *typeof* auth

▸ **proxyComponent**(`componentName`: \"analytics\"): *typeof* analytics

*Defined in [src/sdk.tsx:36](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L36)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"analytics\" |

**Returns:** *typeof* analytics

▸ **proxyComponent**(`componentName`: \"database\"): *typeof* database

*Defined in [src/sdk.tsx:37](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L37)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"database\" |

**Returns:** *typeof* database

▸ **proxyComponent**(`componentName`: \"firestore\"): *typeof* firestore

*Defined in [src/sdk.tsx:38](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L38)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"firestore\" |

**Returns:** *typeof* firestore

▸ **proxyComponent**(`componentName`: \"functions\"): *typeof* functions

*Defined in [src/sdk.tsx:39](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L39)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"functions\" |

**Returns:** *typeof* functions

▸ **proxyComponent**(`componentName`: \"messaging\"): *typeof* messaging

*Defined in [src/sdk.tsx:40](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L40)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"messaging\" |

**Returns:** *typeof* messaging

▸ **proxyComponent**(`componentName`: \"performance\"): *typeof* performance

*Defined in [src/sdk.tsx:41](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L41)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"performance\" |

**Returns:** *typeof* performance

▸ **proxyComponent**(`componentName`: \"remoteConfig\"): *typeof* remoteConfig

*Defined in [src/sdk.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L42)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"remoteConfig\" |

**Returns:** *typeof* remoteConfig

▸ **proxyComponent**(`componentName`: \"storage\"): *typeof* storage

*Defined in [src/sdk.tsx:43](https://github.com/FirebaseExtended/reactfire/blob/master/src/sdk.tsx#L43)*

#### Parameters:

Name | Type |
------ | ------ |
`componentName` | \"storage\" |

**Returns:** *typeof* storage
