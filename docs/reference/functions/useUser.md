[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useUser

# Function: useUser()

## Call Signature

> **useUser**\<`T`\>(`options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`User` \| `null`\>

Defined in: [src/auth.tsx:108](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L108)

Subscribe to Firebase auth state changes, including token refresh

### Type Parameters

#### T

`T` = `unknown`

### Parameters

#### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

### Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`User` \| `null`\>

## Call Signature

> **useUser**\<`T`\>(`auth`, `options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<`User` \| `null`\>

Defined in: [src/auth.tsx:109](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L109)

Subscribe to Firebase auth state changes, including token refresh

### Type Parameters

#### T

`T` = `unknown`

### Parameters

#### auth

`Auth`

#### options?

[`ReactFireOptions`](../interfaces/ReactFireOptions.md)\<`T`\>

### Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<`User` \| `null`\>
