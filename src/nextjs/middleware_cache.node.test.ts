import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyFirebaseIdToken, runMiddleware, CacheProvider } from "./index";
import { NextRequest } from "next/server";
import * as jose from "jose";
import { createToken } from "./middleware_test_utils";

vi.mock("jose", async (importOriginal) => {
  const actual = await importOriginal<typeof jose>();
  return {
    ...actual,
    createRemoteJWKSet: vi.fn().mockReturnValue("remote-jwk-set"),
    createLocalJWKSet: vi.fn().mockImplementation((keys) => ({ localKeys: keys })),
    jwtVerify: vi.fn(),
  };
});

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("CacheProvider plugin paths", () => {
  const mockProjectId = "test-project";
  const mockTenantId = "test-tenant";
  const validHeader = { alg: "RS256", typ: "JWT" };
  const validPayload = {
    iss: `https://securetoken.google.com/${mockProjectId}`,
    aud: mockProjectId,
    firebase: { tenant: mockTenantId },
    exp: Math.floor(Date.now() / 1000) + 3600,
    sub: "user123",
  };

  let mockCacheGet: ReturnType<typeof vi.fn>;
  let mockCacheSet: ReturnType<typeof vi.fn>;
  let mockCacheSetex: ReturnType<typeof vi.fn>;
  let mockCache: CacheProvider;

  beforeEach(() => {
    vi.resetAllMocks();
    mockCacheGet = vi.fn();
    mockCacheSet = vi.fn();
    mockCacheSetex = vi.fn();
    mockCache = {
      get: mockCacheGet,
      set: mockCacheSet,
      setex: mockCacheSetex,
    };
  });

  it("should return cached payload from CacheProvider during verifyFirebaseIdToken", async () => {
    mockCacheGet.mockImplementation(async (key: string) => {
      if (key.startsWith("jwt:")) return validPayload;
      return null;
    });

    const token = createToken(validPayload);
    const [payload, isEmulated] = await verifyFirebaseIdToken(
      token,
      mockProjectId,
      mockTenantId,
      mockCache,
    );

    expect(payload).toEqual(validPayload);
    expect(isEmulated).toBe(false);
    expect(jose.jwtVerify).not.toHaveBeenCalled();
  });

  it("should fetch JWKS from CacheProvider if available during verifyFirebaseIdToken", async () => {
    mockCacheGet.mockImplementation(async (key: string) => {
      if (key === "firebase:jwks") return { keys: ["mock-key"] };
      return null;
    });

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: validPayload,
      protectedHeader: validHeader,
    } as any);

    const token = createToken(validPayload);
    await verifyFirebaseIdToken(token, mockProjectId, mockTenantId, mockCache);

    expect(jose.createLocalJWKSet).toHaveBeenCalledWith({ keys: ["mock-key"] });
    expect(mockCacheSetex).toHaveBeenCalledWith(`jwt:${token}`, expect.any(Number), validPayload);
  });

  it("should fetch remote JWKS and store in CacheProvider if cache misses", async () => {
    mockCacheGet.mockResolvedValue(null);

    fetchMock.mockResolvedValue({
      ok: true,
      headers: new Headers({ "cache-control": "max-age=7200" }),
      json: async () => ({ keys: ["fetched-key"] }),
    });

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: validPayload,
      protectedHeader: validHeader,
    } as any);

    const token = createToken(validPayload);
    await verifyFirebaseIdToken(token, mockProjectId, mockTenantId, mockCache);

    expect(mockCacheSetex).toHaveBeenCalledWith("firebase:jwks", 7200, { keys: ["fetched-key"] });
  });

  it("should handle JWKS rotation lock when ERR_JWKS_NO_MATCHING_KEY occurs", async () => {
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue("1"); // Lock acquired

    fetchMock.mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({ keys: ["rotated-key"] }),
    });

    const err = new Error("No matching key");
    (err as any).code = "ERR_JWKS_NO_MATCHING_KEY";

    vi.mocked(jose.jwtVerify)
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce({ payload: validPayload, protectedHeader: validHeader } as any);

    const token = createToken(validPayload);
    const [payload] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId, mockCache);

    expect(mockCacheSet).toHaveBeenCalledWith("firebase:jwks_eviction_lock", "1", {
      nx: true,
      ex: 30,
    });
    expect(payload).toEqual(validPayload);
  });

  it("should store refreshed token payload in CacheProvider during runMiddleware", async () => {
    mockCacheGet.mockResolvedValue(null);

    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
    const idToken = createToken(expiredPayload);
    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);
    req.cookies.set("__HOST-FIREBASEID_app", "valid-refresh");

    const newIdToken = createToken(validPayload);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: newIdToken,
        refresh_token: "new-refresh",
      }),
    });

    const options = {
      apiKey: "test-key",
      projectId: mockProjectId,
      emulatorHost: undefined,
      tenantId: mockTenantId,
      authDomain: "test.firebaseapp.com",
      cache: mockCache,
    };

    const [, , payload] = await runMiddleware("app", options, req);
    expect(payload).toBeDefined();
    expect(mockCacheSetex).toHaveBeenCalledWith(`jwt:${newIdToken}`, expect.any(Number), validPayload);
  });
});
