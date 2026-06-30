import { describe, it, expect, vi, beforeEach } from "vitest";
import { runMiddleware } from "./index";
import { NextRequest } from "next/server";

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("runMiddleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should handle sign-in request (camelCase) correctly", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        idToken: "mock-id-token",
        refreshToken: "mock-refresh-token",
        expiresIn: "3600",
        localId: "user123",
      }),
    };
    fetchMock.mockResolvedValue(mockResponse);

    const request = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword",
      {
        method: "POST",
        body: JSON.stringify({ returnSecureToken: true }),
      },
    );

    const options = {
      apiKey: "key",
      projectId: "proj",
      emulatorHost: undefined,
      tenantId: undefined,
      authDomain: "auth.domain",
    };

    const [response] = await runMiddleware("app", options, request);

    expect(response).toBeDefined();
    const json = await response!.json();

    // Check redaction
    expect(json.refreshToken).toBe("REDACTED");
    expect(json.idToken).toBe("mock-id-token");

    // Check cookies were set
    const cookies = response!.cookies.getAll();
    const idTokenCookie = cookies.find((c) => c.name.includes("FIREBASE_app"));
    const refreshTokenCookie = cookies.find((c) => c.name.includes("FIREBASEID_app"));

    expect(idTokenCookie?.value).toBe("mock-id-token");
    expect(refreshTokenCookie?.value).toBe("mock-refresh-token");
  });

  it("should handle token request (snake_case) correctly", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        id_token: "mock-id-token-2",
        refresh_token: "mock-refresh-token-2",
        expires_in: "3600",
      }),
    };
    fetchMock.mockResolvedValue(mockResponse);

    const request = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=https://securetoken.googleapis.com/v1/token",
      {
        method: "POST",
        body: "grant_type=refresh_token",
      },
    );

    const options = {
      apiKey: "key",
      projectId: "proj",
      emulatorHost: undefined,
      tenantId: undefined,
      authDomain: "auth.domain",
    };

    const [response] = await runMiddleware("app", options, request);

    expect(response).toBeDefined();
    const json = await response!.json();

    // Check redaction
    expect(json.refresh_token).toBe("REDACTED");
    expect(json.id_token).toBe("mock-id-token-2");

    // Check cookies were set
    const cookies = response!.cookies.getAll();
    const idTokenCookie = cookies.find((c) => c.name.includes("FIREBASE_app"));
    const refreshTokenCookie = cookies.find((c) => c.name.includes("FIREBASEID_app"));

    expect(idTokenCookie?.value).toBe("mock-id-token-2");
    expect(refreshTokenCookie?.value).toBe("mock-refresh-token-2");
  });

  it("injects refresh_token from cookie when proxying v1/token request with refresh_token param", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ id_token: "new-id", refresh_token: "new-refresh" }),
    });

    const request = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=https://securetoken.googleapis.com/v1/token",
      {
        method: "POST",
        body: "grant_type=refresh_token&refresh_token=REDACTED",
      },
    );
    request.cookies.set("__dev_FIREBASEID_app", "secret-http-only-refresh-token");

    const options = {
      apiKey: "key",
      projectId: "proj",
      emulatorHost: undefined,
      tenantId: undefined,
      authDomain: "auth.domain",
    };

    await runMiddleware("app", options, request);

    expect(fetchMock).toHaveBeenCalled();
    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toContain("refresh_token=secret-http-only-refresh-token");
  });

  it("throws an error when request type to proxy cannot be determined", async () => {
    const request = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=https://example.com/unknown",
      { method: "POST" },
    );
    const options = {
      apiKey: "key",
      projectId: "proj",
      emulatorHost: undefined,
      tenantId: undefined,
      authDomain: "auth.domain",
    };

    await expect(runMiddleware("app", options, request)).rejects.toThrow(
      "Could not determine the request type to proxy",
    );
  });

  it("returns proxy response directly without setting cookies if fetch response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: { message: "INVALID_GRANT" } }),
    });

    const request = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=https://securetoken.googleapis.com/v1/token",
      { method: "POST", body: "grant_type=refresh_token" },
    );
    const options = {
      apiKey: "key",
      projectId: "proj",
      emulatorHost: undefined,
      tenantId: undefined,
      authDomain: "auth.domain",
    };

    const [response] = await runMiddleware("app", options, request);
    expect(response?.status).toBe(401);
  });
});
