import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { composeMiddleware, Config } from "./index";
import { FirebaseOptions } from "firebase/app";

// Mock @firebase/util for composeMiddleware tests
const mockGetDefaultAppConfig = vi.fn().mockReturnValue(undefined);
vi.mock("@firebase/util", () => ({
  getDefaultAppConfig: (...args: any[]) => mockGetDefaultAppConfig(...args),
}));

const mockFirebaseOptions: FirebaseOptions = {
  apiKey: "test-api-key",
  authDomain: "test-auth-domain",
  projectId: "test-project-id",
  appId: "test-app-id",
};

describe("composeMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a middleware from config with options", async () => {
    const config = {
      options: mockFirebaseOptions,
      emulator: false,
    };
    const middleware = composeMiddleware(() => {}, config);
    expect(typeof middleware).toBe("function");
  });

  it("executes composed middleware and calls innie", async () => {
    const innie = vi.fn().mockReturnValue(NextResponse.next());
    const config: Config = {
      options: mockFirebaseOptions,
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(innie).toHaveBeenCalled();
  });

  it("handles array of configs", async () => {
    const innie = vi.fn().mockReturnValue(NextResponse.next());
    const configs: Config[] = [{ options: mockFirebaseOptions, emulator: false, appName: "app1" }];
    const middleware = composeMiddleware(innie, configs);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("handles config as a function", async () => {
    const innie = vi.fn().mockReturnValue(NextResponse.next());
    const configFn = () => ({
      options: mockFirebaseOptions,
      emulator: false,
    });
    const middleware = composeMiddleware(innie, configFn);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("throws when no configurations found", async () => {
    const innie = vi.fn();
    // Empty array and no default app config
    const middleware = composeMiddleware(innie, []);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    await expect(middleware(request)).rejects.toThrow();
  });

  it("throws when apiKey is missing", async () => {
    const innie = vi.fn();
    const config: Config = {
      options: { projectId: "test", apiKey: "" },
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    await expect(middleware(request)).rejects.toThrow("apiKey must be defined");
  });

  it("throws when projectId is missing", async () => {
    const innie = vi.fn();
    const config: Config = {
      options: { apiKey: "test", projectId: "" },
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    await expect(middleware(request)).rejects.toThrow("projectId must be defined");
  });

  it("applies decorators to innie response", async () => {
    const innie = vi.fn().mockReturnValue(NextResponse.next());
    const config: Config = {
      options: mockFirebaseOptions,
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(innie).toHaveBeenCalledWith(
      request,
      undefined, // defaultUser
      expect.any(Object), // allUsers
    );
  });

  it("uses NextResponse.next() when innie returns void", async () => {
    const innie = vi.fn(); // Returns undefined
    const config: Config = {
      options: mockFirebaseOptions,
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("handles async config provider function", async () => {
    const innie = vi.fn().mockReturnValue(NextResponse.next());
    const configFn = async () => ({
      options: mockFirebaseOptions,
      emulator: false,
    });
    const middleware = composeMiddleware(innie, configFn);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("adds default app config when provided and no [DEFAULT] in configs", async () => {
    // Override mock to return a config
    mockGetDefaultAppConfig.mockReturnValueOnce(mockFirebaseOptions);

    const innie = vi.fn().mockReturnValue(NextResponse.next());
    // Use a non-default appName so the default push logic fires
    const config: Config = {
      options: mockFirebaseOptions,
      appName: "secondary",
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    const request = new NextRequest("http://localhost/page", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("handles runMiddleware returning a direct response (e.g. /__/ rewrite)", async () => {
    const innie = vi.fn();
    const config: Config = {
      options: mockFirebaseOptions,
      emulator: false,
    };
    const middleware = composeMiddleware(innie, config);
    // Request to /__/auth should get a rewrite response
    const request = new NextRequest("http://localhost/__/auth/handler", { method: "GET" });
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    // innie should NOT have been called because runMiddleware returned directly
    expect(innie).not.toHaveBeenCalled();
  });
});
