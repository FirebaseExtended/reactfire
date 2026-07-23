[**ReactFire reference docs**](../README.md)

***

[ReactFire reference docs](../README.md) / useSigninCheck

# Function: useSigninCheck()

> **useSigninCheck**(`options?`): [`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`SigninCheckResult`](../type-aliases/SigninCheckResult.md)\>

Defined in: [src/auth.tsx:136](https://github.com/FirebaseExtended/reactfire/blob/main/src/auth.tsx#L136)

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

## Parameters

### options?

[`SignInCheckOptionsBasic`](../interfaces/SignInCheckOptionsBasic.md) \| [`SignInCheckOptionsClaimsObject`](../interfaces/SignInCheckOptionsClaimsObject.md) \| [`SignInCheckOptionsClaimsValidator`](../interfaces/SignInCheckOptionsClaimsValidator.md)

## Returns

[`ObservableStatus`](../interfaces/ObservableStatus.md)\<[`SigninCheckResult`](../type-aliases/SigninCheckResult.md)\>
