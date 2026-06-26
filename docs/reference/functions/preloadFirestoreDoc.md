[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / preloadFirestoreDoc

# Function: preloadFirestoreDoc()

> **preloadFirestoreDoc**(`refProvider`): `Promise`\<`SuspenseSubject`\<`DocumentSnapshot`\<`DocumentData`\>\>\>

Defined in: [src/firestore.tsx:28](https://github.com/FirebaseExtended/reactfire/blob/main/src/firestore.tsx#L28)

Preload a subscription to a Firestore document reference.

Use this to warm up `useFirestoreDoc` for a specific document

## Parameters

### refProvider

() => `Promise`\<`DocumentReference`\<`DocumentData`\>\>

## Returns

`Promise`\<`SuspenseSubject`\<`DocumentSnapshot`\<`DocumentData`\>\>\>
