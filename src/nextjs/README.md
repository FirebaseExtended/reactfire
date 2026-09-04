# Firebase Cookie Middleware for Next.js

Production-ready, Edge-compatible Next.js middleware companion for the official Firebase Auth JS SDK's [`browserCookiePersistence`](https://firebase.google.com/docs/reference/js/auth#browsercookiepersistence). 

Enables **hybrid & Server-Side Rendered (SSR)** authentication in Next.js applications by transparently synchronizing Firebase Auth sessions between browser client SDKs and Next.js server environments using secure HTTP cookies.

---

## Why this exists

Standard Single Page Applications (SPAs) store Firebase ID and refresh tokens inside browser `indexedDB` or `localStorage`. Because these storage mechanisms are inaccessible during HTTP requests, Next.js Server Components, API routes, Server Actions, and Middleware cannot read the user's authentication state on the first request, causing layout shifts, client-side redirect flashes, or insecure server routes.

`firebase-cookie-middleware` acts as the server-side companion to [`browserCookiePersistence`](https://firebase.google.com/docs/reference/js/auth#browsercookiepersistence). It proxies Firebase Auth token requests through `/_\_cookies_\_` on your app's domain, intercepts authentication exchanges, securely stores ID tokens and `httpOnly` refresh tokens in standard HTTP cookies, and strips sensitive refresh credentials from browser-facing payloads.

---

## Features

- **⚡ Next.js 14, 15, and 16 Compatible**: Built on `jose` and Web APIs (`atob`, `fetch`). Runs in the Edge Runtime via `middleware.ts` (Next.js 14/15, and Next.js 16 users keeping the deprecated Edge path) and the Node.js runtime via `proxy.ts` (Next.js 16 recommended).
- **🛡️ Seamless Route Protection & Role Checking**: Intercept and verify Firebase ID tokens at the Edge before rendering pages or API routes. Access standard claims (`email`, `sub`) and arbitrary custom claims directly in your middleware.
- **🚀 Distributed Caching (Memorystore / Redis)**: Optional distributed caching for Google's public JWKS signing keys and verified token payloads (`jwt:<idToken>`). Prevents unnecessary CPU verification and network requests on every navigation.
- **🔒 Anti-DDoS Rotation Protection**: Distributed Redis locking (`firebase:jwks_eviction_lock`) ensures that during signing key rotations, only one Edge worker re-fetches Google's JWKS endpoints, preventing rate-limiting cascades.
- **🏢 Multi-App & Multi-Tenant Ready**: Seamlessly compose middleware across multiple Firebase app instances (`[DEFAULT]`, secondary apps) and Google Cloud Identity Platform tenants (`tenantId`).
- **💻 Local Development & Safari Safe**: Automatically handles local `http://` development cookies (`__dev_` prefix) and Safari localhost security restrictions (`SameSite=lax`). Fully supports the Firebase Auth Emulator (`FIREBASE_AUTH_EMULATOR_HOST`).

---

## Installation

```bash
npm install firebase-cookie-middleware jose lru-cache
```

---

## Next.js 16 Migration

Next.js 16 deprecates `middleware.ts` in favor of `proxy.ts`. The named export also changes from `middleware` to `proxy`.

**Next.js 15 and earlier** (`src/middleware.ts`, Edge Runtime):
```typescript
export { middleware } from "firebase-cookie-middleware";
```

**Next.js 16+** (`src/proxy.ts`, Node.js runtime):
```typescript
export { proxy } from "firebase-cookie-middleware";
```

`proxy.ts` runs on the Node.js runtime only; the `runtime` config option is not available and will throw if set. If you need the Edge Runtime in Next.js 16, you can keep using `middleware.ts` with the `middleware` export (deprecated by Next.js but still functional). All middleware logic is identical between the two exports; only the file name and export name change.

---

## Quickstart

### 1. Create your Middleware (`src/middleware.ts` for Next.js 15, `src/proxy.ts` for Next.js 16)

Create or update the file in the root of your Next.js application:

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { composeMiddleware } from "firebase-cookie-middleware";
import { firebaseConfig } from "./lib/firebase";

export const middleware = composeMiddleware(
  async (request: NextRequest, defaultUser, allUsers) => {
    const { pathname } = request.nextUrl;

    // 1. Protect private dashboard routes
    if (pathname.startsWith("/dashboard") && !defaultUser) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Role-Based Access Control (Custom Claims)
    if (pathname.startsWith("/admin") && !defaultUser?.admin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 3. Attach current user ID to request headers for Server Components
    const response = NextResponse.next();
    if (defaultUser) {
      response.headers.set("x-user-id", defaultUser.sub!);
    }
    return response;
  },
  {
    options: firebaseConfig,
    // Optional: Specify a specific tenant ID for multi-tenant applications
    // tenantId: "my-tenant-id",
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and Next.js internals.
     * IMPORTANT: You MUST ensure /__cookies__ and /__/ are matched so auth proxying works.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 2. Configure Client SDK Persistence (`src/lib/firebase.ts`)

In your browser-side Firebase initialization code, instruct the Auth SDK to use [`browserCookiePersistence`](https://firebase.google.com/docs/reference/js/auth#browsercookiepersistence):

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, browserCookiePersistence } from "firebase/auth";

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with cookie persistence
export const auth = initializeAuth(app, {
  persistence: browserCookiePersistence,
});
```

---

## API Reference

### `composeMiddleware(innie, configProvider)`

Creates a composable Next.js middleware handler that verifies cookies and manages token lifecycle.

#### Parameters

- **`innie`**: `(request: NextRequest, defaultUser?: FirebaseJWTPayload, allUsers?: Record<string, FirebaseJWTPayload>) => Promise<NextResponse | void> | NextResponse | void`
  - Your application callback. Recieves the verified Firebase JWT payload (`defaultUser`) for the default Firebase app, and a map of payloads for all configured apps (`allUsers`).
- **`configProvider`**: `Config | Config[] | ((req: NextRequest) => Config | Config[] | Promise<Config | Config[]>)`
  - Configuration object or provider function specifying your Firebase project details.

#### `Config` Object Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| **`options`** | `FirebaseOptions` | Standard Firebase configuration object (`apiKey`, `projectId`, `authDomain`). |
| **`appName`** | `string` | Name of the Firebase app instance. Defaults to `"[DEFAULT]"`. |
| **`tenantId`** | `string` | Google Cloud Identity Platform tenant ID. |
| **`emulator`** | `boolean \| string` | Whether to use the Firebase Auth Emulator. If `true`, reads host from `FIREBASE_AUTH_EMULATOR_HOST`. |
| **`cache`** | `CacheProvider` | Optional custom caching store (e.g. Memorystore, Redis, Vercel KV, Cloudflare KV) for token validation and JWKS caching. Defaults to an in-memory `LRUCache`. |

---

### `verifyFirebaseIdToken(idToken, projectId, tenantId?, cache?)`

Manually verify a raw Firebase ID token string against Google's JWKS endpoints or a caching provider.

```typescript
import { verifyFirebaseIdToken } from "firebase-cookie-middleware";

const [payload, isEmulated, refreshable] = await verifyFirebaseIdToken(
  idTokenCookieValue,
  "my-firebase-project-id",
  "optional-tenant-id",
  myCustomCache // optional CacheProvider
);

if (payload) {
  console.log("Verified User:", payload.sub, payload.email);
}
```

---

## Pluggable Distributed Caching (Optional)

In high-traffic serverless or multi-region environments, repeatedly validating RS256 signatures or fetching JWKS certificates can add latency across cold starts. You can pass any standard key-value store client (such as Memorystore, Redis, Vercel KV, Cloudflare KV, or `ioredis`) directly via the `cache` option:

```typescript
import { composeMiddleware, type CacheProvider } from "firebase-cookie-middleware";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export const middleware = composeMiddleware(callback, {
  options: firebaseConfig,
  cache: redis, // Compatible with standard .get(), .set(), and .setex() interfaces
});
```

Any object implementing the `CacheProvider` interface works out of the box:

```typescript
export interface CacheProvider {
  get<T = unknown>(key: string): Promise<T | null | undefined> | T | null | undefined;
  set(
    key: string,
    value: any,
    options?: { ex?: number; ttl?: number; nx?: boolean },
  ): Promise<any> | any;
  setex?(key: string, seconds: number, value: any): Promise<any> | any;
}
```

When a custom cache provider is supplied, the middleware automatically:
1. Caches Google's public JWKS certificates under `firebase:jwks` matching the upstream HTTP `Cache-Control: max-age`.
2. Caches verified ID token payloads under `jwt:<idToken>` with a TTL matching the exact JWT `exp` timestamp.
3. Coordinates JWKS eviction locks across Edge workers using `firebase:jwks_eviction_lock`.

If the `cache` option is omitted, the middleware gracefully defaults to a high-performance in-memory LRU cache (`max: 1000`).

---

## Cookie Architecture & Security

The middleware maintains two distinct cookies per app configuration (`appName`):

1. **ID Token Cookie (`__HOST-FIREBASE_<appName>`)**:
   - Contains the active, short-lived JWT ID token.
   - Configured with `SameSite=None`, `Secure` (in production), and `Partitioned`. `SameSite=Lax` is used only as a Safari-localhost fallback during local development, since `Partitioned` cookies require `SameSite=None`.
   - Readable by both client scripts and server requests.
   - Because `SameSite=None` sends this cookie on cross-site requests, CSRF protection for the `/__cookies__` endpoint comes from the `Origin` check on state-changing requests, not from `SameSite`.
2. **Refresh Token Cookie (`__HOST-FIREBASEID_<appName>`)**:
   - Contains the long-lived refresh credential.
   - Marked **`HttpOnly`** and `Secure`.
   - Never exposed to browser JavaScript; automatically injected by the middleware proxy during `/_\_cookies_\_` token refresh requests.

---

## Local Development & Emulators

When testing locally on `http://localhost`, Chrome and Safari reject secure host-prefixed cookies (`__HOST-`). The middleware automatically detects insecure local protocols and falls back to prefixed development cookies (`__dev_FIREBASE_[DEFAULT]`) with appropriate security flags.

To connect with the Firebase Auth Emulator, set `emulator: true` in your config and export the emulator host:

```bash
export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
```

```typescript
export const middleware = composeMiddleware(callback, {
  options: firebaseConfig,
  emulator: true, // reads FIREBASE_AUTH_EMULATOR_HOST; required to accept unsigned tokens
});
```

You can also pass the host directly as a string instead of relying on the env var:

```typescript
emulator: "localhost:9099"
```

Emulator mode accepts unsigned tokens (`alg: "none"`) and proxies token refresh requests to your local emulator. The explicit opt-in is required: the env var alone does not activate emulator mode, preventing accidental acceptance of unsigned tokens if the variable leaks into a production environment.
