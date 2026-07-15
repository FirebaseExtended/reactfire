import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runMiddleware } from "./index";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { createToken } from "./middleware_test_utils";

// Mock jose
vi.mock("jose", async (importOriginal) => {
  const actual = await importOriginal<typeof jose>();
  return {
    ...actual,
    createRemoteJWKSet: vi.fn(),
    jwtVerify: vi.fn(),
  };
});

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("runMiddleware Token Refresh", () => {
  const mockApiKey = "test-api-key";
  const mockProjectId = "test-project";
  const mockTenantId = "test-tenant";
  const mockEmulatorHost = "localhost:9099";

  const options = {
    apiKey: mockApiKey,
    projectId: mockProjectId,
    emulatorHost: undefined as string | undefined,
    tenantId: mockTenantId,
    authDomain: "test.firebaseapp.com",
  };

  const validPayload = {
    iss: `https://securetoken.google.com/${mockProjectId}`,
    aud: mockProjectId,
    firebase: { tenant: mockTenantId },
    exp: Math.floor(Date.now() / 1000) + 3600, // Valid
    sub: "user123",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Default jose success
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: validPayload,
      protectedHeader: { alg: "RS256" },
    } as any);
    // Default fetch success (generic)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it("should pass through if ID token is valid", async () => {
    const idToken = createToken(validPayload);
    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);

    const [response, decorate, payload] = await runMiddleware("app", options, req);

    expect(payload).toBeDefined();
    expect(payload?.sub).toBe("user123");
    expect(response).toBeUndefined(); // Passes through
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should refresh token if ID token is expired and refresh token is valid", async () => {
    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
    const idToken = createToken(expiredPayload);
    const refreshToken = "valid-refresh-token";

    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);
    req.cookies.set("__HOST-FIREBASEID_app", refreshToken);

    // Mock refresh response
    const newIdToken = createToken({ ...validPayload, jti: "new-token" });
    const newRefreshToken = "new-refresh-token";
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id_token: newIdToken,
        refresh_token: newRefreshToken,
        expires_in: "3600",
      }),
    });

    const [response, decorate, payload] = await runMiddleware("app", options, req);

    expect(payload).toBeDefined();
    expect(payload?.jti).toBe("new-token");

    // Verify fetch call
    expect(fetchMock).toHaveBeenCalled();
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.host).toBe("securetoken.googleapis.com");

    // Verify cookies update
    const nextRes = NextResponse.next();
    decorate!(nextRes);

    const idCookie = nextRes.cookies.get("__HOST-FIREBASE_app");
    const refreshCookie = nextRes.cookies.get("__HOST-FIREBASEID_app");

    expect(idCookie?.value).toBe(newIdToken);
    expect(refreshCookie?.value).toBe(newRefreshToken);
  });

  it("preserves platformOperator claim in refreshed payload in production (session-gated, not stripped)", async () => {
    vi.stubEnv("NODE_ENV", "production");

    try {
      const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
      const idToken = createToken(expiredPayload);
      const refreshToken = "valid-refresh-token";

      const req = new NextRequest("https://localhost:3000/dashboard");
      req.cookies.set("__HOST-FIREBASE_app", idToken);
      req.cookies.set("__HOST-FIREBASEID_app", refreshToken);

      const newIdToken = createToken({ ...validPayload, jti: "new-strip", platformOperator: true });
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id_token: newIdToken,
          refresh_token: "new-refresh",
          expires_in: "3600",
        }),
      });

      const [, , payload] = await runMiddleware("app", options, req);

      expect(payload).toBeDefined();
      expect(payload?.jti).toBe("new-strip");
      expect((payload as any)?.platformOperator).toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("preserves platformOperator claim in refreshed payload in development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    try {
      const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
      const idToken = createToken(expiredPayload);
      const refreshToken = "valid-refresh-token";

      const req = new NextRequest("https://localhost:3000/dashboard");
      req.cookies.set("__HOST-FIREBASE_app", idToken);
      req.cookies.set("__HOST-FIREBASEID_app", refreshToken);

      const newIdToken = createToken({ ...validPayload, jti: "dev-preserve", platformOperator: true });
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id_token: newIdToken,
          refresh_token: "new-refresh",
          expires_in: "3600",
        }),
      });

      const [, , payload] = await runMiddleware("app", options, req);

      expect(payload).toBeDefined();
      expect((payload as any)?.platformOperator).toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("should logout if ID token is expired and refresh fails", async () => {
    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
    const idToken = createToken(expiredPayload);
    const refreshToken = "bad-refresh-token";

    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);
    req.cookies.set("__HOST-FIREBASEID_app", refreshToken);

    // Mock refresh failure
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });

    const [response, decorate, payload] = await runMiddleware("app", options, req);

    expect(payload).toBeUndefined();

    const nextRes = NextResponse.next();
    decorate!(nextRes);

    const setCookie = nextRes.headers.get("set-cookie");
    expect(setCookie).toContain("Max-Age=0");
  });

  it("should logout if emulator refresh token used in production", async () => {
    const emulatorRefreshPayload = JSON.stringify({ _AuthEmulatorRefreshToken: true });
    const emulatorRefreshToken = Buffer.from(emulatorRefreshPayload).toString("base64");

    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
    const idToken = createToken(expiredPayload);

    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);
    req.cookies.set("__HOST-FIREBASEID_app", emulatorRefreshToken);

    const prodOptions = { ...options, emulatorHost: undefined };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: "new-token",
        refresh_token: emulatorRefreshToken,
      }),
    });

    const [response, decorate, payload] = await runMiddleware("app", prodOptions, req);

    expect(payload).toBeUndefined();

    const nextRes = NextResponse.next();
    decorate!(nextRes);
    const setCookie = nextRes.headers.get("set-cookie");
    expect(setCookie).toContain("Max-Age=0");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should refresh using emulator host if configured", async () => {
    const emulatorRefreshPayload = JSON.stringify({ _AuthEmulatorRefreshToken: true });
    const emulatorRefreshToken = Buffer.from(emulatorRefreshPayload).toString("base64");

    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
    const idToken = createToken(expiredPayload);

    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);
    req.cookies.set("__HOST-FIREBASEID_app", emulatorRefreshToken);

    const emuOptions = { ...options, emulatorHost: mockEmulatorHost };

    const newIdToken = createToken({ ...validPayload, jti: "emu-token" });
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: newIdToken,
        refresh_token: emulatorRefreshToken,
      }),
    });

    await runMiddleware("app", emuOptions, req);

    expect(fetchMock).toHaveBeenCalled();
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.host).toBe(mockEmulatorHost);
  });

  it("should handle missing ID token but present refresh token", async () => {
    const refreshToken = "valid-refresh-token";
    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASEID_app", refreshToken);

    const newIdToken = createToken({ ...validPayload, jti: "restored-token" });
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: newIdToken,
        refresh_token: refreshToken,
      }),
    });

    const [response, decorate, payload] = await runMiddleware("app", options, req);

    expect(payload).toBeDefined();
    expect(payload?.jti).toBe("restored-token");
    expect(fetchMock).toHaveBeenCalled();
  });

  it("should logout when authIdToken is empty string (logout sentinel)", async () => {
    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", "");

    const [response, decorate, payload] = await runMiddleware("app", options, req);

    expect(payload).toBeUndefined();
    const nextRes = NextResponse.next();
    decorate!(nextRes);
    expect(nextRes.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("should logout when ID token is emulated but options.emulatorHost is undefined", async () => {
    const emuHeader = { alg: "none", typ: "JWT" };
    const emuPayload = { ...validPayload, jti: "emulated-no-host" };
    const token = createToken(emuPayload);
    // Overwrite the token with alg: none header
    const tokenParts = token.split(".");
    const h = Buffer.from(JSON.stringify(emuHeader)).toString("base64");
    const emuToken = `${h}.${tokenParts[1]}.signature`;

    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", emuToken);

    const prodOptions = { ...options, emulatorHost: undefined };
    const [response, decorate, payload] = await runMiddleware("app", prodOptions, req);

    expect(payload).toBeUndefined();
    const nextRes = NextResponse.next();
    decorate!(nextRes);
    expect(nextRes.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("should logout when refresh fetch throws a network exception", async () => {
    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
    const idToken = createToken(expiredPayload);
    const refreshToken = "valid-refresh-token";

    const req = new NextRequest("https://localhost:3000/dashboard");
    req.cookies.set("__HOST-FIREBASE_app", idToken);
    req.cookies.set("__HOST-FIREBASEID_app", refreshToken);

    fetchMock.mockRejectedValue(new Error("Network disconnect"));

    const [response, decorate, payload] = await runMiddleware("app", options, req);

    expect(payload).toBeUndefined();
    const nextRes = NextResponse.next();
    decorate!(nextRes);
    expect(nextRes.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
