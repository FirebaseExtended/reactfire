ReactFire reference docs

# ReactFire reference docs

## Table of contents

### Classes

- [ReactFireError](classes/ReactFireError.md)

### Interfaces

- [AuthCheckProps](interfaces/AuthCheckProps.md)
- [ClaimCheckErrors](interfaces/ClaimCheckErrors.md)
- [ClaimsCheckProps](interfaces/ClaimsCheckProps.md)
- [ClaimsValidator](interfaces/ClaimsValidator.md)
- [ObservableStatus](interfaces/ObservableStatus.md)
- [ReactFireOptions](interfaces/ReactFireOptions.md)
- [SignInCheckOptionsBasic](interfaces/SignInCheckOptionsBasic.md)
- [SignInCheckOptionsClaimsObject](interfaces/SignInCheckOptionsClaimsObject.md)
- [SignInCheckOptionsClaimsValidator](interfaces/SignInCheckOptionsClaimsValidator.md)
- [SuspensePerfProps](interfaces/SuspensePerfProps.md)

### Type Aliases

- [ReactFireGlobals](README.md#reactfireglobals)
- [SigninCheckResult](README.md#signincheckresult)

### Variables

- [AnalyticsSdkContext](README.md#analyticssdkcontext)
- [AppCheckSdkContext](README.md#appchecksdkcontext)
- [AuthSdkContext](README.md#authsdkcontext)
- [DatabaseSdkContext](README.md#databasesdkcontext)
- [FirestoreSdkContext](README.md#firestoresdkcontext)
- [FunctionsSdkContext](README.md#functionssdkcontext)
- [PerformanceSdkContext](README.md#performancesdkcontext)
- [RemoteConfigSdkContext](README.md#remoteconfigsdkcontext)
- [StorageSdkContext](README.md#storagesdkcontext)
- [version](README.md#version)

### Functions

- [AnalyticsProvider](README.md#analyticsprovider)
- [AppCheckProvider](README.md#appcheckprovider)
- [AuthCheck](README.md#authcheck)
- [AuthProvider](README.md#authprovider)
- [ClaimsCheck](README.md#claimscheck)
- [DatabaseProvider](README.md#databaseprovider)
- [FirebaseAppProvider](README.md#firebaseappprovider)
- [FirestoreProvider](README.md#firestoreprovider)
- [FunctionsProvider](README.md#functionsprovider)
- [PerformanceProvider](README.md#performanceprovider)
- [RemoteConfigProvider](README.md#remoteconfigprovider)
- [StorageImage](README.md#storageimage)
- [StorageProvider](README.md#storageprovider)
- [SuspenseWithPerf](README.md#suspensewithperf)
- [checkIdField](README.md#checkidfield)
- [checkOptions](README.md#checkoptions)
- [checkinitialData](README.md#checkinitialdata)
- [preloadFirestoreDoc](README.md#preloadfirestoredoc)
- [preloadObservable](README.md#preloadobservable)
- [preloadUser](README.md#preloaduser)
- [useAnalytics](README.md#useanalytics)
- [useAppCheck](README.md#useappcheck)
- [useAuth](README.md#useauth)
- [useCallableFunctionResponse](README.md#usecallablefunctionresponse)
- [useDatabase](README.md#usedatabase)
- [useDatabaseList](README.md#usedatabaselist)
- [useDatabaseListData](README.md#usedatabaselistdata)
- [useDatabaseObject](README.md#usedatabaseobject)
- [useDatabaseObjectData](README.md#usedatabaseobjectdata)
- [useFirebaseApp](README.md#usefirebaseapp)
- [useFirestore](README.md#usefirestore)
- [useFirestoreCollection](README.md#usefirestorecollection)
- [useFirestoreCollectionData](README.md#usefirestorecollectiondata)
- [useFirestoreDoc](README.md#usefirestoredoc)
- [useFirestoreDocData](README.md#usefirestoredocdata)
- [useFirestoreDocDataOnce](README.md#usefirestoredocdataonce)
- [useFirestoreDocOnce](README.md#usefirestoredoconce)
- [useFunctions](README.md#usefunctions)
- [useIdTokenResult](README.md#useidtokenresult)
- [useInitAnalytics](README.md#useinitanalytics)
- [useInitAppCheck](README.md#useinitappcheck)
- [useInitAuth](README.md#useinitauth)
- [useInitDatabase](README.md#useinitdatabase)
- [useInitFirestore](README.md#useinitfirestore)
- [useInitFunctions](README.md#useinitfunctions)
- [useInitPerformance](README.md#useinitperformance)
- [useInitRemoteConfig](README.md#useinitremoteconfig)
- [useInitStorage](README.md#useinitstorage)
- [useIsSuspenseEnabled](README.md#useissuspenseenabled)
- [useObservable](README.md#useobservable)
- [usePerformance](README.md#useperformance)
- [useRemoteConfig](README.md#useremoteconfig)
- [useRemoteConfigAll](README.md#useremoteconfigall)
- [useRemoteConfigBoolean](README.md#useremoteconfigboolean)
- [useRemoteConfigNumber](README.md#useremoteconfignumber)
- [useRemoteConfigString](README.md#useremoteconfigstring)
- [useRemoteConfigValue](README.md#useremoteconfigvalue)
- [useSigninCheck](README.md#usesignincheck)
- [useStorage](README.md#usestorage)
- [useStorageDownloadURL](README.md#usestoragedownloadurl)
- [useStorageTask](README.md#usestoragetask)
- [useSuspenseEnabledFromConfigAndContext](README.md#usesuspenseenabledfromconfigandcontext)
- [useUser](README.md#useuser)

## Type Aliases

### ReactFireGlobals

Ƭ **ReactFireGlobals**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_reactFireDatabaseCachedQueries` | `DatabaseQuery`[] |
| `_reactFireFirestoreQueryCache` | `FirestoreQuery`[] |
| `_reactFirePreloadedObservables` | `Map`<`string`, `SuspenseSubject`<`any`\>\> |

#### Defined in

[src/index.ts:6](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L6)

___

### SigninCheckResult

Ƭ **SigninCheckResult**: { `errors`: {} ; `hasRequiredClaims`: ``false`` ; `signedIn`: ``false`` ; `user`: ``null``  } \| { `errors`: [`ClaimCheckErrors`](interfaces/ClaimCheckErrors.md) ; `hasRequiredClaims`: `boolean` ; `signedIn`: ``true`` ; `user`: `User`  }

#### Defined in

[src/auth.tsx:66](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L66)

## Variables

### AnalyticsSdkContext

• `Const` **AnalyticsSdkContext**: `Context`<`undefined` \| `Analytics`\>

#### Defined in

[src/sdk.tsx:20](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L20)

___

### AppCheckSdkContext

• `Const` **AppCheckSdkContext**: `Context`<`undefined` \| `AppCheck`\>

#### Defined in

[src/sdk.tsx:18](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L18)

___

### AuthSdkContext

• `Const` **AuthSdkContext**: `Context`<`undefined` \| `Auth`\>

#### Defined in

[src/sdk.tsx:19](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L19)

___

### DatabaseSdkContext

• `Const` **DatabaseSdkContext**: `Context`<`undefined` \| `Database`\>

#### Defined in

[src/sdk.tsx:21](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L21)

___

### FirestoreSdkContext

• `Const` **FirestoreSdkContext**: `Context`<`undefined` \| `Firestore`\>

#### Defined in

[src/sdk.tsx:22](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L22)

___

### FunctionsSdkContext

• `Const` **FunctionsSdkContext**: `Context`<`undefined` \| `Functions`\>

#### Defined in

[src/sdk.tsx:23](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L23)

___

### PerformanceSdkContext

• `Const` **PerformanceSdkContext**: `Context`<`undefined` \| `FirebasePerformance`\>

#### Defined in

[src/sdk.tsx:25](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L25)

___

### RemoteConfigSdkContext

• `Const` **RemoteConfigSdkContext**: `Context`<`undefined` \| `RemoteConfig`\>

#### Defined in

[src/sdk.tsx:26](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L26)

___

### StorageSdkContext

• `Const` **StorageSdkContext**: `Context`<`undefined` \| `FirebaseStorage`\>

#### Defined in

[src/sdk.tsx:24](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L24)

___

### version

• `Const` **version**: `string`

#### Defined in

[src/firebaseApp.tsx:20](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L20)

## Functions

### AnalyticsProvider

▸ **AnalyticsProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `Analytics`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### AppCheckProvider

▸ **AppCheckProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `AppCheck`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### AuthCheck

▸ **AuthCheck**(`__namedParameters`): `JSX.Element`

**`Deprecated`**

Use `useSigninCheck` instead

Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`AuthCheckProps`](interfaces/AuthCheckProps.md) |

#### Returns

`JSX.Element`

#### Defined in

[src/auth.tsx:247](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L247)

___

### AuthProvider

▸ **AuthProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `Auth`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### ClaimsCheck

▸ **ClaimsCheck**(`__namedParameters`): `Element`

**`Deprecated`**

Use `useSigninCheck` instead

Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ClaimsCheckProps`](interfaces/ClaimsCheckProps.md) |

#### Returns

`Element`

#### Defined in

[src/auth.tsx:210](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L210)

___

### DatabaseProvider

▸ **DatabaseProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `Database`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### FirebaseAppProvider

▸ **FirebaseAppProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<`FirebaseAppProviderProps`\> |

#### Returns

`Element`

#### Defined in

[src/firebaseApp.tsx:24](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L24)

___

### FirestoreProvider

▸ **FirestoreProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `Firestore`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### FunctionsProvider

▸ **FunctionsProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `Functions`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### PerformanceProvider

▸ **PerformanceProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `FirebasePerformance`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### RemoteConfigProvider

▸ **RemoteConfigProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `RemoteConfig`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### StorageImage

▸ **StorageImage**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StorageImageProps` & `ClassAttributes`<`HTMLImageElement`\> & `ImgHTMLAttributes`<`HTMLImageElement`\> |

#### Returns

`Element`

#### Defined in

[src/storage.tsx:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L78)

___

### StorageProvider

▸ **StorageProvider**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `PropsWithChildren`<{ `sdk`: `FirebaseStorage`  }\> |

#### Returns

`Element`

#### Defined in

[src/sdk.tsx:31](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L31)

___

### SuspenseWithPerf

▸ **SuspenseWithPerf**(`__namedParameters`): `JSX.Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SuspensePerfProps`](interfaces/SuspensePerfProps.md) |

#### Returns

`JSX.Element`

#### Defined in

[src/performance.tsx:9](https://github.com/FirebaseExtended/reactfire/blob/main/src/performance.tsx#L9)

___

### checkIdField

▸ **checkIdField**(`options`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`unknown`\> |

#### Returns

`any`

#### Defined in

[src/index.ts:47](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L47)

___

### checkOptions

▸ **checkOptions**(`options`, `field`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`unknown`\> |
| `field` | `string` |

#### Returns

`any`

#### Defined in

[src/index.ts:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L34)

___

### checkinitialData

▸ **checkinitialData**(`options`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`unknown`\> |

#### Returns

`any`

#### Defined in

[src/index.ts:43](https://github.com/FirebaseExtended/reactfire/blob/main/src/index.ts#L43)

___

### preloadFirestoreDoc

▸ **preloadFirestoreDoc**(`refProvider`): `Promise`<`SuspenseSubject`<`DocumentSnapshot`<`DocumentData`\>\>\>

Preload a subscription to a Firestore document reference.

Use this to warm up `useFirestoreDoc` for a specific document

#### Parameters

| Name | Type |
| :------ | :------ |
| `refProvider` | () => `Promise`<`DocumentReference`<`DocumentData`\>\> |

#### Returns

`Promise`<`SuspenseSubject`<`DocumentSnapshot`<`DocumentData`\>\>\>

#### Defined in

[src/firestore.tsx:28](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L28)

___

### preloadObservable

▸ **preloadObservable**<`T`\>(`source`, `id`): `SuspenseSubject`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Observable`<`T`\> |
| `id` | `string` |

#### Returns

`SuspenseSubject`<`T`\>

#### Defined in

[src/useObservable.ts:19](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L19)

___

### preloadUser

▸ **preloadUser**(`authResolver`): `Promise`<`undefined` \| ``null`` \| `User`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `authResolver` | () => `Promise`<`Auth`\> |

#### Returns

`Promise`<`undefined` \| ``null`` \| `User`\>

#### Defined in

[src/auth.tsx:11](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L11)

___

### useAnalytics

▸ **useAnalytics**(): `Analytics`

#### Returns

`Analytics`

#### Defined in

[src/sdk.tsx:84](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L84)

___

### useAppCheck

▸ **useAppCheck**(): `AppCheck`

#### Returns

`AppCheck`

#### Defined in

[src/sdk.tsx:82](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L82)

___

### useAuth

▸ **useAuth**(): `Auth`

#### Returns

`Auth`

#### Defined in

[src/sdk.tsx:83](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L83)

___

### useCallableFunctionResponse

▸ **useCallableFunctionResponse**<`RequestData`, `ResponseData`\>(`functionName`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`ResponseData`\>

Calls a callable function.

#### Type parameters

| Name |
| :------ |
| `RequestData` |
| `ResponseData` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `functionName` | `string` | The name of the function to call |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`ResponseData`\> & { `data?`: `RequestData` ; `httpsCallableOptions?`: `HttpsCallableOptions`  } |  |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`ResponseData`\>

#### Defined in

[src/functions.tsx:13](https://github.com/FirebaseExtended/reactfire/blob/main/src/functions.tsx#L13)

___

### useDatabase

▸ **useDatabase**(): `Database`

#### Returns

`Database`

#### Defined in

[src/sdk.tsx:85](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L85)

___

### useDatabaseList

▸ **useDatabaseList**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`QueryChange`[] \| `T`[]\>

Subscribe to a Realtime Database list

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { `[key: string]`: `unknown`;  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `Query` \| `DatabaseReference` | Reference to the DB List you want to listen to |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`[]\> |  |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`QueryChange`[] \| `T`[]\>

#### Defined in

[src/database.tsx:48](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L48)

___

### useDatabaseListData

▸ **useDatabaseListData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`T`[] \| ``null``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { `[key: string]`: `unknown`;  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `Query` \| `DatabaseReference` |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`T`[] \| ``null``\>

#### Defined in

[src/database.tsx:58](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L58)

___

### useDatabaseObject

▸ **useDatabaseObject**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`QueryChange` \| `T`\>

Subscribe to a Realtime Database object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `DatabaseReference` | Reference to the DB object you want to listen to |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`QueryChange` \| `T`\>

#### Defined in

[src/database.tsx:27](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L27)

___

### useDatabaseObjectData

▸ **useDatabaseObjectData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DatabaseReference` |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

#### Defined in

[src/database.tsx:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/database.tsx#L34)

___

### useFirebaseApp

▸ **useFirebaseApp**(): `FirebaseApp`

#### Returns

`FirebaseApp`

#### Defined in

[src/firebaseApp.tsx:78](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L78)

___

### useFirestore

▸ **useFirestore**(): `Firestore`

#### Returns

`Firestore`

#### Defined in

[src/sdk.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L86)

___

### useFirestoreCollection

▸ **useFirestoreCollection**<`T`\>(`query`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`QuerySnapshot`<`T`\>\>

Subscribe to a Firestore collection

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `Query`<`T`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`QuerySnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:86](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L86)

___

### useFirestoreCollectionData

▸ **useFirestoreCollectionData**<`T`\>(`query`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`T`[]\>

Subscribe to a Firestore collection and unwrap the snapshot into an array.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `Query`<`T`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`[]\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`T`[]\>

#### Defined in

[src/firestore.tsx:96](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L96)

___

### useFirestoreDoc

▸ **useFirestoreDoc**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`DocumentSnapshot`<`T`\>\>

Suscribe to Firestore Document changes

You can preload data for this hook by calling `preloadFirestoreDoc`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`DocumentSnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L42)

___

### useFirestoreDocData

▸ **useFirestoreDocData**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

Suscribe to Firestore Document changes and unwrap the document into a plain object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

#### Defined in

[src/firestore.tsx:62](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L62)

___

### useFirestoreDocDataOnce

▸ **useFirestoreDocDataOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

#### Defined in

[src/firestore.tsx:74](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L74)

___

### useFirestoreDocOnce

▸ **useFirestoreDocOnce**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`DocumentSnapshot`<`T`\>\>

Get a firestore document and don't subscribe to changes

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `DocumentData` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `DocumentReference`<`T`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`DocumentSnapshot`<`T`\>\>

#### Defined in

[src/firestore.tsx:52](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L52)

___

### useFunctions

▸ **useFunctions**(): `Functions`

#### Returns

`Functions`

#### Defined in

[src/sdk.tsx:87](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L87)

___

### useIdTokenResult

▸ **useIdTokenResult**(`user`, `forceRefresh?`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`IdTokenResult`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `user` | `User` | `undefined` |
| `forceRefresh` | `boolean` | `false` |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`IdTokenResult`\> | `undefined` |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`IdTokenResult`\>

#### Defined in

[src/auth.tsx:38](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L38)

___

### useInitAnalytics

▸ **useInitAnalytics**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`Analytics`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Analytics`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`Analytics`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`Analytics`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitAppCheck

▸ **useInitAppCheck**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`AppCheck`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`AppCheck`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`AppCheck`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`AppCheck`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitAuth

▸ **useInitAuth**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`Auth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Auth`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`Auth`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`Auth`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitDatabase

▸ **useInitDatabase**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`Database`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Database`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`Database`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`Database`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitFirestore

▸ **useInitFirestore**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`Firestore`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Firestore`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`Firestore`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`Firestore`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitFunctions

▸ **useInitFunctions**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`Functions`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`Functions`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`Functions`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`Functions`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitPerformance

▸ **useInitPerformance**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`FirebasePerformance`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`FirebasePerformance`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`FirebasePerformance`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`FirebasePerformance`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitRemoteConfig

▸ **useInitRemoteConfig**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`RemoteConfig`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`RemoteConfig`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`RemoteConfig`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`RemoteConfig`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useInitStorage

▸ **useInitStorage**(`initializer`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`FirebaseStorage`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | (`firebaseApp`: `FirebaseApp`) => `Promise`<`FirebaseStorage`\> |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`FirebaseStorage`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`FirebaseStorage`\>

#### Defined in

[src/sdk.tsx:92](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L92)

___

### useIsSuspenseEnabled

▸ **useIsSuspenseEnabled**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/firebaseApp.tsx:60](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L60)

___

### useObservable

▸ **useObservable**<`T`\>(`observableId`, `source`, `config?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `observableId` | `string` |
| `source` | `Observable`<`T`\> |
| `config` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`unknown`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`T`\>

#### Defined in

[src/useObservable.ts:95](https://github.com/FirebaseExtended/reactfire/blob/main/src/useObservable.ts#L95)

___

### usePerformance

▸ **usePerformance**(): `FirebasePerformance`

#### Returns

`FirebasePerformance`

#### Defined in

[src/sdk.tsx:88](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L88)

___

### useRemoteConfig

▸ **useRemoteConfig**(): `RemoteConfig`

#### Returns

`RemoteConfig`

#### Defined in

[src/sdk.tsx:90](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L90)

___

### useRemoteConfigAll

▸ **useRemoteConfigAll**(`key`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`AllParameters`\>

Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`AllParameters`\>

#### Defined in

[src/remote-config.tsx:66](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L66)

___

### useRemoteConfigBoolean

▸ **useRemoteConfigBoolean**(`key`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`boolean`\>

Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`boolean`\>

#### Defined in

[src/remote-config.tsx:58](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L58)

___

### useRemoteConfigNumber

▸ **useRemoteConfigNumber**(`key`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`number`\>

Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`number`\>

#### Defined in

[src/remote-config.tsx:50](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L50)

___

### useRemoteConfigString

▸ **useRemoteConfigString**(`key`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`string`\>

Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`string`\>

#### Defined in

[src/remote-config.tsx:42](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L42)

___

### useRemoteConfigValue

▸ **useRemoteConfigValue**(`key`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`RemoteConfigValue`\>

Accepts a key and optionally a Remote Config instance. Returns a
Remote Config Value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The parameter key in Remote Config |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`RemoteConfigValue`\>

#### Defined in

[src/remote-config.tsx:34](https://github.com/FirebaseExtended/reactfire/blob/main/src/remote-config.tsx#L34)

___

### useSigninCheck

▸ **useSigninCheck**(`options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<[`SigninCheckResult`](README.md#signincheckresult)\>

Subscribe to the signed-in status of a user.

```ts
const { status, data:signInCheckResult } = useSigninCheck();

if (status === 'loading') {
  return <LoadingSpinner />}

if (signInCheckResult.signedIn === true) {
  return <ProfilePage user={signInCheckResult.user}/>
} else {
  return <SignInForm />
}
```

Optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) of a user as well.

```ts
// pass in an object describing the custom claims a user must have
const {status, data: signInCheckResult} = useSigninCheck({requiredClaims: {admin: true}});

// pass in a custom claims validator function
const {status, data: signInCheckResult} = useSigninCheck({validateCustomClaims: (userClaims) => {
  // custom validation logic...
}});

// You can optionally force-refresh the token
const {status, data: signInCheckResult} = useSigninCheck({forceRefresh: true, requiredClaims: {admin: true}});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SignInCheckOptionsBasic`](interfaces/SignInCheckOptionsBasic.md) \| [`SignInCheckOptionsClaimsObject`](interfaces/SignInCheckOptionsClaimsObject.md) \| [`SignInCheckOptionsClaimsValidator`](interfaces/SignInCheckOptionsClaimsValidator.md) |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<[`SigninCheckResult`](README.md#signincheckresult)\>

#### Defined in

[src/auth.tsx:131](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L131)

___

### useStorage

▸ **useStorage**(): `FirebaseStorage`

#### Returns

`FirebaseStorage`

#### Defined in

[src/sdk.tsx:89](https://github.com/FirebaseExtended/reactfire/blob/main/src/sdk.tsx#L89)

___

### useStorageDownloadURL

▸ **useStorageDownloadURL**<`T`\>(`ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`string` \| `T`\>

Subscribe to a storage ref's download URL

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | `StorageReference` | reference to the blob you want to download |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`string` \| `T`\>

#### Defined in

[src/storage.tsx:29](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L29)

___

### useStorageTask

▸ **useStorageTask**<`T`\>(`task`, `ref`, `options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`UploadTaskSnapshot` \| `T`\>

Subscribe to the progress of a storage task

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `task` | `UploadTask` | the task you want to listen to |
| `ref` | `StorageReference` | reference to the blob the task is acting on |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |  |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`UploadTaskSnapshot` \| `T`\>

#### Defined in

[src/storage.tsx:16](https://github.com/FirebaseExtended/reactfire/blob/main/src/storage.tsx#L16)

___

### useSuspenseEnabledFromConfigAndContext

▸ **useSuspenseEnabledFromConfigAndContext**(`suspenseFromConfig?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `suspenseFromConfig?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[src/firebaseApp.tsx:67](https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L67)

___

### useUser

▸ **useUser**<`T`\>(`options?`): [`ObservableStatus`](interfaces/ObservableStatus.md)<`User` \| ``null``\>

Subscribe to Firebase auth state changes, including token refresh

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ReactFireOptions`](interfaces/ReactFireOptions.md)<`T`\> |

#### Returns

[`ObservableStatus`](interfaces/ObservableStatus.md)<`User` \| ``null``\>

#### Defined in

[src/auth.tsx:22](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L22)
