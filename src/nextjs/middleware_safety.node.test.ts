import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { composeMiddleware } from "./index";

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("middleware", () => {
  const mockApiKey = "mock-api-key";
  const mockProjectId = "mock-project-id";
  const mockAuthDomain = "mock-auth-domain";

  const mockConfig = {
    options: {
      apiKey: mockApiKey,
      projectId: mockProjectId,
      authDomain: mockAuthDomain,
    },
    emulator: true,
  };

  const innie = vi.fn((_req) => NextResponse.next());

  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw error when emulated but target is not emulator", async () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

    const middleware = composeMiddleware(innie, () => mockConfig);

    const req = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=" +
        encodeURIComponent("https://securetoken.googleapis.com/v1/token"),
    );

    // Mock fetch response for success path (so it WOULD succeed if we didn't block it)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id_token: "abc", refresh_token: "def" }),
      headers: new Headers(),
      status: 200,
      statusText: "OK",
    });

    const response = await middleware(req);
    expect(response.status).toBe(400);
  });

  it("should pass when emulated and target is emulator", async () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

    const middleware = composeMiddleware(innie, () => mockConfig);

    const req = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=" +
        encodeURIComponent("http://localhost:9099/securetoken.googleapis.com/v1/token"),
    );

    // Mock fetch response for success path
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id_token: "abc", refresh_token: "def" }),
      headers: new Headers(),
      status: 200,
      statusText: "OK",
    });

    await middleware(req);

    expect(fetchMock).toHaveBeenCalled();
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.host).toBe("localhost:9099");
  });

  it("should pass when NOT emulated and target is production", async () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "";

    const middleware = composeMiddleware(innie, () => ({ ...mockConfig, emulator: false }));

    const req = new NextRequest(
      "http://localhost:3000/__cookies__?finalTarget=" +
        encodeURIComponent("https://securetoken.googleapis.com/v1/token"),
    );

    // Mock fetch response for success path
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id_token: "abc", refresh_token: "def" }),
      headers: new Headers(),
      status: 200,
      statusText: "OK",
    });

    await middleware(req);
    expect(fetchMock).toHaveBeenCalled();
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.host).toBe("securetoken.googleapis.com");
  });
});
