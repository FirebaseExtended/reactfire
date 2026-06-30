import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyFirebaseIdToken } from "./index";
import * as jose from "jose";

// Mock jose
vi.mock("jose", async (importOriginal) => {
  const actual = await importOriginal<typeof jose>();
  return {
    ...actual,
    createRemoteJWKSet: vi.fn(),
    jwtVerify: vi.fn(),
  };
});

describe("verifyFirebaseIdToken", () => {
  const mockProjectId = "test-project";
  const mockTenantId = "test-tenant";

  // Helper to create a dummy JWT string (header.payload.signature)
  const createToken = (header: any, payload: any) => {
    const h = Buffer.from(JSON.stringify(header)).toString("base64");
    const p = Buffer.from(JSON.stringify(payload)).toString("base64");
    return `${h}.${p}.signature`;
  };

  const validHeader = { alg: "RS256", typ: "JWT" };
  const validPayload = {
    iss: `https://securetoken.google.com/${mockProjectId}`,
    aud: mockProjectId,
    firebase: { tenant: mockTenantId },
    exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    sub: "user123",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Default success for jwtVerify
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: validPayload,
      protectedHeader: validHeader,
    } as any);
  });

  it("should return payload for a valid token", async () => {
    const payload = { ...validPayload, jti: "unique-1" };
    const token = createToken(validHeader, payload);
    const [resultPayload, isEmulated] = await verifyFirebaseIdToken(
      token,
      mockProjectId,
      mockTenantId,
    );

    expect(resultPayload).toBeDefined();
    expect(resultPayload?.sub).toBe("user123");
    expect(isEmulated).toBe(false);
    expect(jose.jwtVerify).toHaveBeenCalled();
  });

  it("should return undefined for expired token (client-side check)", async () => {
    const expiredPayload = {
      ...validPayload,
      exp: Math.floor(Date.now() / 1000) - 3600,
      jti: "unique-2",
    };
    const token = createToken(validHeader, expiredPayload);

    const [payload, isEmulated] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

    expect(payload).toBeUndefined();
    expect(isEmulated).toBe(false);
    expect(jose.jwtVerify).not.toHaveBeenCalled();
  });

  it("should return undefined if verification fails", async () => {
    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error("Invalid signature"));
    const payload = { ...validPayload, jti: "unique-3" };
    const token = createToken(validHeader, payload);

    const [resultPayload, isEmulated] = await verifyFirebaseIdToken(
      token,
      mockProjectId,
      mockTenantId,
    );

    expect(resultPayload).toBeUndefined();
    expect(isEmulated).toBe(false);
  });

  it("should return undefined for invalid claims (wrong aud)", async () => {
    const invalidPayload = { ...validPayload, aud: "wrong-project", jti: "unique-4" };
    const token = createToken(validHeader, invalidPayload);

    const [payload] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

    expect(payload).toBeUndefined();
  });

  it("should return undefined for invalid claims (wrong iss)", async () => {
    const invalidPayload = { ...validPayload, iss: "https://wrong.issuer.com", jti: "unique-5" };
    const token = createToken(validHeader, invalidPayload);

    const [payload] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

    expect(payload).toBeUndefined();
  });

  it("should return undefined for invalid claims (wrong tenant)", async () => {
    const invalidPayload = {
      ...validPayload,
      firebase: { tenant: "wrong-tenant" },
      jti: "unique-6",
    };
    const token = createToken(validHeader, invalidPayload);

    const [payload] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

    expect(payload).toBeUndefined();
  });

  describe("tenant validation", () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("rejects mismatched tenant in dev even if custom claims are present", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const tokenTenantPayload = {
        ...validPayload,
        firebase: { tenant: "origin-tenant" },
        customRole: true,
        jti: "tenant-mismatch-dev",
      };
      const token = createToken(validHeader, tokenTenantPayload);

      const [payload] = await verifyFirebaseIdToken(token, mockProjectId, "different-tenant");
      expect(payload).toBeUndefined();
    });

    it("rejects mismatched tenant in prod even if custom claims are present", async () => {
      vi.stubEnv("NODE_ENV", "production");
      const tokenTenantPayload = {
        ...validPayload,
        firebase: { tenant: "origin-tenant" },
        customRole: true,
        jti: "tenant-mismatch-prod",
      };
      const token = createToken(validHeader, tokenTenantPayload);

      const [payload] = await verifyFirebaseIdToken(token, mockProjectId, "different-tenant");
      expect(payload).toBeUndefined();
    });
  });

  it("should handle emulator tokens (alg: none)", async () => {
    const emulatorHeader = { alg: "none", typ: "JWT" };
    const emulatorPayload = { ...validPayload, jti: "unique-7" }; // Valid claims still required
    const token = createToken(emulatorHeader, emulatorPayload);

    const [payload, isEmulated] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

    expect(payload).toBeDefined();
    expect(payload?.sub).toBe("user123");
    expect(isEmulated).toBe(true);
    expect(jose.jwtVerify).not.toHaveBeenCalled();
  });

  it("should use cache for subsequent valid requests", async () => {
    const payload = { ...validPayload, jti: "unique-cache-test" };
    const token = createToken(validHeader, payload);

    // First call
    await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);
    expect(jose.jwtVerify).toHaveBeenCalledTimes(1);

    // Second call
    const [cachedResult] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);
    expect(cachedResult).toBeDefined();
    // Should NOT call verify again
    expect(jose.jwtVerify).toHaveBeenCalledTimes(1);
  });

  it("should return undefined for malformed token", async () => {
    const token = "not.a.valid.token";
    const [payload] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);
    expect(payload).toBeUndefined();
  });

  describe("custom claim preservation", () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("preserves arbitrary custom claims in development", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const payload = { ...validPayload, customRole: true, jti: "dev-keep" };
      const token = createToken(validHeader, payload);
      vi.mocked(jose.jwtVerify).mockResolvedValue({ payload, protectedHeader: validHeader } as any);

      const [result] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

      expect(result).toBeDefined();
      expect(result?.customRole).toBe(true);
    });

    it("preserves arbitrary custom claims in production", async () => {
      vi.stubEnv("NODE_ENV", "production");
      const payload = { ...validPayload, customRole: true, jti: "prod-keep" };
      const token = createToken(validHeader, payload);
      vi.mocked(jose.jwtVerify).mockResolvedValue({ payload, protectedHeader: validHeader } as any);

      const [result] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);

      expect(result).toBeDefined();
      expect(result?.customRole).toBe(true);
      expect(result?.sub).toBe("user123");
    });

    it("preserves arbitrary custom claims from cached payload in production", async () => {
      vi.stubEnv("NODE_ENV", "production");
      const payload = { ...validPayload, customRole: true, jti: "cache-keep-unique" };
      const token = createToken(validHeader, payload);
      vi.mocked(jose.jwtVerify).mockResolvedValue({ payload, protectedHeader: validHeader } as any);

      // First call populates the LRU cache
      await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);
      const verifyCallsAfterFirst = vi.mocked(jose.jwtVerify).mock.calls.length;

      // Second call: served from cache — claim must still be present
      const [result] = await verifyFirebaseIdToken(token, mockProjectId, mockTenantId);
      expect(vi.mocked(jose.jwtVerify).mock.calls.length).toBe(verifyCallsAfterFirst);
      expect(result?.customRole).toBe(true);
      expect(result?.sub).toBe("user123");
    });
  });
});
