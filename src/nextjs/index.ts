import { NextResponse, NextRequest } from "next/server";
import { LRUCache } from "lru-cache";
import {
  createRemoteJWKSet,
  createLocalJWKSet,
  jwtVerify,
  JWTPayload,
  JWTHeaderParameters,
  decodeJwt,
  decodeProtectedHeader,
  JSONWebKeySet,
} from "jose";
import { getDefaultAppConfig } from "@firebase/util";
import type { FirebaseOptions } from "firebase/app";

// FYI this code is supposed to be part of the Firebase SDKs soon
// https://github.com/FirebaseExtended/reactfire/pull/640

export type FirebaseJWTPayload = JWTPayload & {
  email?: string;
  email_verified?: boolean;
  picture?: string;
  name?: string;
  user_id?: string;
  firebase?: { tenant?: string; [key: string]: unknown };
  [key: string]: unknown;
};

export interface CacheProvider {
  get<T = unknown>(key: string): Promise<T | null | undefined> | T | null | undefined;
  set(
    key: string,
    value: any,
    options?: { ex?: number; ttl?: number; nx?: boolean },
  ): Promise<any> | any;
  setex?(key: string, seconds: number, value: any): Promise<any> | any;
}

export class MemoryCacheProvider implements CacheProvider {
  private cache = new LRUCache<string, any>({ max: 1000 });

  get<T = unknown>(key: string): T | null {
    return (this.cache.get(key) as T) ?? null;
  }

  set(key: string, value: any, options?: { ex?: number; ttl?: number; nx?: boolean }): any {
    if (options?.nx && this.cache.has(key)) return null;
    const ttlSeconds = options?.ex ?? (options?.ttl ? Math.floor(options.ttl / 1000) : undefined);
    const ttlMs = ttlSeconds ? ttlSeconds * 1000 : undefined;
    this.cache.set(key, value, { ttl: ttlMs });
    return "OK";
  }

  setex(key: string, seconds: number, value: any): any {
    return this.set(key, value, { ex: seconds });
  }
}

const defaultMemoryCache = new MemoryCacheProvider();

async function cacheGet<T>(cache: CacheProvider, key: string): Promise<T | null> {
  try {
    const val = await cache.get<T>(key);
    return val ?? null;
  } catch (e) {
    console.error(`Cache get failed for key "${key}":`, e);
    return null;
  }
}

async function cacheSetEx(
  cache: CacheProvider,
  key: string,
  ttlSeconds: number,
  value: any,
): Promise<void> {
  try {
    if (typeof cache.setex === "function") {
      await cache.setex(key, ttlSeconds, value);
    } else {
      await cache.set(key, value, { ex: ttlSeconds });
    }
  } catch (e) {
    console.error(`Cache set failed for key "${key}":`, e);
  }
}

async function cacheSetNx(
  cache: CacheProvider,
  key: string,
  ttlSeconds: number,
  value: any,
): Promise<boolean> {
  try {
    const res = await cache.set(key, value, { nx: true, ex: ttlSeconds });
    return !!res;
  } catch (e) {
    console.error(`Cache setnx failed for key "${key}":`, e);
    return false;
  }
}

const MAX_MAX_AGE = 34560000; // 400 days, https://developer.chrome.com/blog/cookie-max-age-expires

const FIREBASE_AUTH_JWKS_URL =
  "https://www.googleapis.com/robot/v1/metadata/jwk/securetoken@system.gserviceaccount.com";

let _remoteJWKSet: ReturnType<typeof createRemoteJWKSet> | null = null;
function getRemoteJWKSet() {
  if (!_remoteJWKSet) {
    _remoteJWKSet = createRemoteJWKSet(new URL(FIREBASE_AUTH_JWKS_URL), { timeoutDuration: 10000 });
  }
  return _remoteJWKSet;
}

async function getFirebaseAuthJwks(
  cache: CacheProvider = defaultMemoryCache,
  forceFetch: boolean = false,
) {
  if (cache === defaultMemoryCache && !forceFetch) {
    return getRemoteJWKSet();
  }

  if (!forceFetch) {
    const cachedJwks = await cacheGet<JSONWebKeySet>(cache, "firebase:jwks");
    if (cachedJwks) {
      return createLocalJWKSet(cachedJwks);
    }
  }

  try {
    const response = await fetch(FIREBASE_AUTH_JWKS_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const cacheControl = response.headers.get("cache-control");
    let maxAge = 21600; // default 6 hours
    if (cacheControl) {
      const match = cacheControl.match(/max-age=(\d+)/);
      if (match) maxAge = parseInt(match[1], 10);
    }

    const jwks = (await response.json()) as JSONWebKeySet;
    await cacheSetEx(cache, "firebase:jwks", maxAge, jwks);
    return createLocalJWKSet(jwks);
  } catch (e) {
    console.error("Failed to fetch Firebase JWKS:", e);
    // Fallback to remote JWKS set if fetch or parse fails entirely
    return getRemoteJWKSet();
  }
}

export function isEmulatorRefreshToken(refreshToken: string): boolean {
  try {
    const decoded = decodeURIComponent(refreshToken);
    const base64 = decoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return !!payload["_AuthEmulatorRefreshToken"];
  } catch (e) {
    return false;
  }
}

export async function verifyFirebaseIdToken(
  idToken: string,
  projectId: string,
  tenantId?: string,
  cache: CacheProvider = defaultMemoryCache,
): Promise<[FirebaseJWTPayload | undefined, isEmulatedCredential: boolean, refreshable: boolean]> {
  let isEmulatedCredential = false;
  let jwtPayload;
  let jwtHeader;
  let refreshable = true;
  try {
    jwtHeader = decodeProtectedHeader(idToken) as JWTHeaderParameters;
    jwtPayload = decodeJwt(idToken) as FirebaseJWTPayload;
  } catch (e) {
    console.error("verifyFirebaseIdToken failed to parse token:", e);
    refreshable = false;
  }

  if (
    jwtHeader?.typ !== "JWT" ||
    jwtPayload?.iss !== `https://securetoken.google.com/${projectId}` ||
    jwtPayload.aud !== projectId ||
    jwtPayload?.firebase?.tenant !== tenantId
  ) {
    console.error("JWT Validation Mismatch", { jwtHeader, jwtPayload, projectId, tenantId });
    jwtPayload = undefined;
    refreshable = false;
  }
  if (jwtHeader?.alg === "none") {
    isEmulatedCredential = true;
  } else if (jwtHeader?.alg !== "RS256") {
    jwtPayload = undefined;
    refreshable = false;
  }

  if (jwtPayload) {
    const muchEpochWow = Math.floor(+new Date() / 1000);
    if (jwtPayload.exp && jwtPayload.exp > muchEpochWow) {
      if (isEmulatedCredential) {
        return [jwtPayload, isEmulatedCredential, true];
      } else {
        const cachedPayload = await cacheGet<FirebaseJWTPayload>(cache, `jwt:${idToken}`);
        if (cachedPayload) {
          return [cachedPayload, isEmulatedCredential, true];
        }

        try {
          let jwks = await getFirebaseAuthJwks(cache);
          try {
            await jwtVerify(idToken, jwks);
          } catch (verifyErr: any) {
            // If the signing key wasn't found (rotation), attempt to fetch fresh keys once.
            // Rate-limited via cache SET NX to prevent DOS via crafted JWTs with unknown kid values.
            // Native jose `cooldownDuration` is 30 seconds. This avoids the 5-minute DOS loophole.
            if (verifyErr?.code === "ERR_JWKS_NO_MATCHING_KEY") {
              const acquired = await cacheSetNx(cache, "firebase:jwks_eviction_lock", 30, "1");
              if (acquired) {
                // Fetch fresh keys directly, skipping cache read
                jwks = await getFirebaseAuthJwks(cache, true);
                await jwtVerify(idToken, jwks);
              } else {
                throw verifyErr;
              }
            } else {
              throw verifyErr;
            }
          }
          const ttlMs = jwtPayload.exp * 1000 - Date.now();
          const ttlSeconds = Math.floor(ttlMs / 1000);
          if (ttlSeconds > 0) {
            await cacheSetEx(cache, `jwt:${idToken}`, ttlSeconds, jwtPayload);
          }
          return [jwtPayload, isEmulatedCredential, true];
        } catch (e) {
          console.error("JWT Verification failed:", e);
        }
      }
    }
  }

  return [undefined, isEmulatedCredential, refreshable];
}

interface TokenResponse {
  refresh_token?: string;
  id_token?: string;
  [key: string]: any;
}

interface SignInResponse {
  refreshToken?: string;
  idToken?: string;
  [key: string]: any;
}

type RunMiddlewareOptions = {
  apiKey: string;
  projectId: string;
  emulatorHost: string | undefined;
  tenantId: string | undefined;
  authDomain: string | undefined;
  cache?: CacheProvider;
};
type RunMiddlewareResponse =
  | [NextResponse]
  | [undefined, (response: NextResponse) => NextResponse, FirebaseJWTPayload | undefined];
export async function runMiddleware(
  appName: string,
  options: RunMiddlewareOptions,
  request: NextRequest,
): Promise<RunMiddlewareResponse> {
  const cache = options.cache || defaultMemoryCache;
  // Host auth widgets and Firebase reserved URLs
  if (request.nextUrl.pathname.startsWith("/__/") && options.authDomain) {
    const newURL = new URL(request.nextUrl);
    newURL.host = options.authDomain;
    newURL.port = "";
    return [NextResponse.rewrite(newURL)];
  }

  // Firebase JS SDK treats all http:// requests as dev-mode since cookie persistence requires secure context to function
  const isDevMode = request.nextUrl.protocol === "http:";
  const userAgent = request.headers.get("User-Agent");
  const isSafari = userAgent?.includes("Safari") && !userAgent?.includes("Chrome");

  // Safari does not consider cookies on localhost secure
  const useInsecureCookies = isDevMode && isSafari;

  // Need two different cookie names as Chrome doesn't allow __HOST- on localhost
  const ID_TOKEN_COOKIE_NAME = isDevMode
    ? `__dev_FIREBASE_${appName}`
    : `__HOST-FIREBASE_${appName}`;
  const REFRESH_TOKEN_COOKIE_NAME = isDevMode
    ? `__dev_FIREBASEID_${appName}`
    : `__HOST-FIREBASEID_${appName}`;
  const ID_TOKEN_COOKIE = {
    path: "/",
    secure: !useInsecureCookies,
    httpOnly: false,
    sameSite: "lax",
    partitioned: !useInsecureCookies,
    name: ID_TOKEN_COOKIE_NAME,
    maxAge: MAX_MAX_AGE,
    priority: "high",
  } as const;
  const REFRESH_TOKEN_COOKIE = {
    ...ID_TOKEN_COOKIE,
    httpOnly: true,
    name: REFRESH_TOKEN_COOKIE_NAME,
  } as const;

  if (request.nextUrl.pathname === "/__cookies__") {
    const targetAppName = request.nextUrl.searchParams.get("appName") || "[DEFAULT]";
    if (targetAppName !== appName) {
      return [undefined, (res: NextResponse) => res, undefined];
    }

    const method = request.method;
    if (method === "DELETE") {
      const response = new NextResponse("");
      response.cookies.delete({ ...ID_TOKEN_COOKIE, maxAge: 0 });
      response.cookies.delete({ ...REFRESH_TOKEN_COOKIE, maxAge: 0 });
      return [response];
    }

    const headers = Object.fromEntries(
      [
        "referrer",
        "referrer-policy",
        "content-type",
        "X-Firebase-Client",
        "X-Firebase-gmpid",
        "X-Firebase-AppCheck",
        "X-Firebase-Locale",
        "X-Client-Version",
      ]
        .filter((header) => request.headers.has(header))
        .map((header) => [header, request.headers.get(header)!]),
    );

    const finalTargetParam = request.nextUrl.searchParams.get("finalTarget");
    if (!finalTargetParam) {
      return [new NextResponse("Missing finalTarget parameter", { status: 400 })];
    }
    const url = new URL(finalTargetParam);

    let body: ReadableStream<any> | string | null = request.body;

    if (options.emulatorHost) {
      if (url.host !== options.emulatorHost) {
        throw new Error(`Emulator mismatch: ${url.host} vs ${options.emulatorHost}`);
      }
    } else {
      if (
        url.host !== "securetoken.googleapis.com" &&
        url.host !== "identitytoolkit.googleapis.com"
      ) {
        throw new Error(`Unauthorized proxy target host: ${url.host}`);
      }
    }

    const isTokenRequest = !!url.pathname.match(/^(\/securetoken\.googleapis\.com)?\/v1\/token/);
    const isSignInRequest = !!url.pathname.match(
      /^(\/identitytoolkit\.googleapis\.com)?\/(v1|v2)\/accounts:/,
    );

    if (!isTokenRequest && !isSignInRequest)
      throw new Error("Could not determine the request type to proxy");

    if (isTokenRequest) {
      body = await request.text();
      const bodyParams = new URLSearchParams(body!.trim());
      if (bodyParams.has("refresh_token")) {
        const refreshToken = request.cookies.get({ ...REFRESH_TOKEN_COOKIE, value: "" })?.value;
        if (refreshToken) {
          bodyParams.set("refresh_token", refreshToken);
          body = bodyParams.toString();
        }
      }
    }

    // Duplex half, isn't NextJS fun?
    const response = await fetch(url, { method, body, headers, duplex: "half" } as RequestInit);

    const json = (await response.json()) as TokenResponse | SignInResponse;
    const status = response.status;
    const statusText = response.statusText;
    if (!response.ok) {
      const nextResponse = NextResponse.json(json, { status, statusText });
      return [nextResponse];
    }
    // The Firebase JS SDK freaks out if the idToken disappears on it, e.g, the cookie expired
    // it manually calls logout... which nukes everything before we have a chance to refresh!
    // So set the maxAge to the default (chrome max) of 400 days
    const idToken = json.idToken || json.id_token;
    const refreshToken = json.refreshToken || json.refresh_token;

    if ("refreshToken" in json && json.refreshToken) {
      json.refreshToken = "REDACTED";
    }
    if ("refresh_token" in json && json.refresh_token) {
      json.refresh_token = "REDACTED";
    }

    const currentIdToken = request.cookies.get({ ...ID_TOKEN_COOKIE, value: "" })?.value;
    const nextResponse = NextResponse.json(json, { status, statusText });
    if (idToken && currentIdToken !== idToken)
      nextResponse.cookies.set({ ...ID_TOKEN_COOKIE, value: idToken });
    if (refreshToken) nextResponse.cookies.set({ ...REFRESH_TOKEN_COOKIE, value: refreshToken });
    return [nextResponse];
  }

  const logout = (): RunMiddlewareResponse => {
    const decorateNextResponse = (response: NextResponse) => {
      if (request.cookies.get(ID_TOKEN_COOKIE_NAME))
        response.cookies.delete({ ...ID_TOKEN_COOKIE, maxAge: 0 });
      if (request.cookies.get(REFRESH_TOKEN_COOKIE_NAME))
        response.cookies.delete({ ...REFRESH_TOKEN_COOKIE, maxAge: 0 });
      return response;
    };
    return [undefined, decorateNextResponse, undefined];
  };

  let authIdToken = request.cookies.get({ ...ID_TOKEN_COOKIE, value: "" })?.value;
  const refresh_token = request.cookies.get({ ...REFRESH_TOKEN_COOKIE, value: "" })?.value;

  if (authIdToken === "") {
    console.error("logout sentinel detected");
    return logout();
  }

  let [jwtPayload, isEmulatedCredential, refreshable] = authIdToken
    ? await verifyFirebaseIdToken(authIdToken, options.projectId, options.tenantId, cache)
    : [undefined, false, true];

  if (jwtPayload) {
    if (isEmulatedCredential && !options.emulatorHost) {
      return logout();
    }
    return [undefined, (it) => it, jwtPayload];
  }

  if (!refresh_token || !refreshable) {
    return logout();
  }

  // Check if the refresh token is from the emulator.
  // This relies on an internal property `_AuthEmulatorRefreshToken` which is subject to change,
  // but we handle potential parsing errors gracefully.
  // Fixed: Ensure isEmulatedCredential remains true if already true, or is updated if false.
  isEmulatedCredential = isEmulatedCredential || isEmulatorRefreshToken(refresh_token);

  if (isEmulatedCredential && !options.emulatorHost) {
    return logout();
  }

  const refreshUrl = new URL(
    isEmulatedCredential ? `http://${options.emulatorHost}` : `https://securetoken.googleapis.com`,
  );
  refreshUrl.pathname = [isEmulatedCredential && "securetoken.googleapis.com", "v1/token"]
    .filter(Boolean)
    .join("/");
  refreshUrl.searchParams.set("key", options.apiKey);
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token });
  let refreshResponse;
  try {
    refreshResponse = await fetch(refreshUrl, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (e) {
    console.error("Refresh token request failed.", e);
    return logout();
  }
  if (!refreshResponse.ok) {
    console.error(refreshUrl.toString(), refreshResponse.status, refreshResponse.statusText);
    return logout();
  }
  const json = (await refreshResponse.json()) as TokenResponse;
  const newRefreshToken = json.refresh_token;
  const newIdToken = json.id_token;
  if (!newIdToken) throw new Error("Missing id_token in refresh response");
  // FIXED: Use jose decodeJwt for robust Edge support instead of Buffer/base64
  const decodedPayload = decodeJwt(newIdToken) as FirebaseJWTPayload;
  jwtPayload = decodedPayload;
  const ttlMs = jwtPayload.exp! * 1000 - Date.now();
  const ttlSeconds = Math.floor(ttlMs / 1000);
  if (ttlSeconds > 0) {
    await cacheSetEx(cache, `jwt:${newIdToken}`, ttlSeconds, jwtPayload);
  }
  const decorateNextResponse = (response: NextResponse) => {
    if (newIdToken) response.cookies.set({ ...ID_TOKEN_COOKIE, value: newIdToken });
    if (newRefreshToken) response.cookies.set({ ...REFRESH_TOKEN_COOKIE, value: newRefreshToken });
    return response;
  };
  return [undefined, decorateNextResponse, jwtPayload];
}

export type Config = {
  emulator?: boolean | string;
  tenantId?: string;
  options?: FirebaseOptions;
  appName?: string;
  cache?: CacheProvider;
};

type Resolvable<T> = Promise<T> | T;
// composeMiddleware always sets defaultUser from a verified Firebase JWT, so
// expose the richer type to consumers (firebase.tenant, email_verified, etc.).
type Innie = (
  request: NextRequest,
  defaultUser: FirebaseJWTPayload | undefined,
  allUsers: Record<string, FirebaseJWTPayload>,
) => Resolvable<NextResponse | void>;

export type NormalizedConfig = {
  appName: string;
  firebaseOptions: FirebaseOptions;
  emulatorHost?: string;
  tenantId?: string;
  cache: CacheProvider;
};

export const normalizeConfig = (
  config: Config,
  defaultAppOptions: FirebaseOptions | undefined,
): NormalizedConfig => {
  if (!config.options && !defaultAppOptions) {
    throw new Error("Could not find Firebase configuration");
  }
  const normalizedConfig: NormalizedConfig = {
    appName: config.appName || "[DEFAULT]",
    firebaseOptions: config.options || defaultAppOptions!,
    tenantId: config.tenantId,
    cache: config.cache || defaultMemoryCache,
  };
  // TODO don't override string value
  if (typeof config.emulator === "string") {
    normalizedConfig.emulatorHost = config.emulator;
  } else if (config.emulator !== false) {
    const emulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
    normalizedConfig.emulatorHost = emulatorHost;
  }
  return normalizedConfig;
};

export const composeMiddleware =
  (
    innie: Innie,
    configProvider?:
      | Resolvable<Config | Config[]>
      | ((request: NextRequest) => Resolvable<Config | Config[]>),
  ) =>
  async (request: NextRequest) => {
    const rawConfig = await Promise.resolve(
      typeof configProvider === "function" ? configProvider(request) : configProvider,
    );
    const defaultAppName = (!Array.isArray(rawConfig) && rawConfig?.appName) || "[DEFAULT]";
    const defaultAppOptions = getDefaultAppConfig() as FirebaseOptions | undefined;
    const normalizedConfigurations = await Promise.all(
      (Array.isArray(rawConfig) ? rawConfig : [rawConfig])
        .filter((it) => !!it)
        .map(async (config) => {
          return normalizeConfig(config, defaultAppOptions);
        }),
    );
    if (defaultAppOptions && !normalizedConfigurations.find((it) => it.appName === "[DEFAULT]")) {
      normalizedConfigurations.push({
        appName: "[DEFAULT]",
        firebaseOptions: defaultAppOptions,
        emulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
        cache: defaultMemoryCache,
      });
    }
    if (!normalizedConfigurations.length) throw new Error("");

    let defaultUser: FirebaseJWTPayload | undefined = undefined;
    const allUsers: Record<string, FirebaseJWTPayload> = {};
    const decorators: Array<(response: NextResponse) => NextResponse> = [];
    let finalResponse: NextResponse | undefined | void = undefined;

    const results = await Promise.all(
      normalizedConfigurations.map(async (config) => {
        const { appName, tenantId, emulatorHost, firebaseOptions, cache } = config;
        const { apiKey, projectId, authDomain } = firebaseOptions;
        if (!apiKey) throw new Error("apiKey must be defined.");
        if (!projectId) throw new Error("projectId must be defined");
        const options = { apiKey, projectId, emulatorHost, tenantId, authDomain, cache };
        const result = await runMiddleware(appName, options, request);
        return { appName, result };
      }),
    );

    for (const { appName, result } of results) {
      const [response, decorateResponse, idTokenPayload] = result;
      if (idTokenPayload) allUsers[appName] = idTokenPayload;
      if (idTokenPayload && appName === defaultAppName) defaultUser = idTokenPayload;
      if (response) finalResponse ||= response;
      if (decorateResponse) decorators.push(decorateResponse);
    }
    if (!finalResponse)
      finalResponse = await Promise.resolve(innie(request, defaultUser, allUsers));
    return decorators.reduce(
      (prev, current) => current(prev),
      finalResponse || NextResponse.next(),
    );
  };

export const middleware = composeMiddleware(() => {});
