[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / preloadFirestoreDoc

# ~~Function: preloadFirestoreDoc()~~

> **preloadFirestoreDoc**(`refProvider`): `Promise`\<`DocumentSnapshot`\<`any`, `DocumentData`\>\>

Defined in: [src/firestore.tsx:95](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L95)

Preload a subscription to a Firestore document reference.

Use this to warm up `useFirestoreDoc` for a specific document

## Parameters

### refProvider

() => `Promise`\<`DocumentReference`\<`DocumentData`, `DocumentData`\>\>

## Returns

`Promise`\<`DocumentSnapshot`\<`any`, `DocumentData`\>\>

## Deprecated

Unwrap `useFirestoreDoc(ref).experimental_usable` with `React.use()` instead. Will be removed in v5.0.0.
