import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { normalizeConfig, Config } from "./index";
import { FirebaseOptions } from "firebase/app";

const mockFirebaseOptions: FirebaseOptions = {
  apiKey: "test-api-key",
  authDomain: "test-auth-domain",
  projectId: "test-project-id",
  appId: "test-app-id",
};

describe("normalizeConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should use process.env.FIREBASE_AUTH_EMULATOR_HOST when emulator is true", () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    const config: Config = {
      emulator: true,
      options: mockFirebaseOptions,
    };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.emulatorHost).toBe("localhost:9099");
  });

  it("should use string value when emulator is a string", () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "env-host:9099";
    const config: Config = {
      emulator: "custom-host:8080",
      options: mockFirebaseOptions,
    };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.emulatorHost).toBe("custom-host:8080");
  });

  it("should not set emulatorHost when emulator is false", () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    const config: Config = {
      emulator: false,
      options: mockFirebaseOptions,
    };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.emulatorHost).toBeUndefined();
  });

  it("should throw error if no options provided", () => {
    const config: Config = {};
    expect(() => normalizeConfig(config, undefined)).toThrow(
      "Could not find Firebase configuration",
    );
  });

  it("should use default app name when none provided", () => {
    const config: Config = { options: mockFirebaseOptions };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.appName).toBe("[DEFAULT]");
  });

  it("should use provided app name", () => {
    const config: Config = { options: mockFirebaseOptions, appName: "myApp" };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.appName).toBe("myApp");
  });

  it("should use defaultAppOptions when config.options not provided", () => {
    const config: Config = {};
    const normalized = normalizeConfig(config, mockFirebaseOptions);
    expect(normalized.firebaseOptions).toBe(mockFirebaseOptions);
  });

  it("should prefer config.options over defaultAppOptions", () => {
    const otherOptions: FirebaseOptions = { apiKey: "other-key", projectId: "other" };
    const config: Config = { options: otherOptions };
    const normalized = normalizeConfig(config, mockFirebaseOptions);
    expect(normalized.firebaseOptions.apiKey).toBe("other-key");
  });

  it("should pass through tenantId", () => {
    const config: Config = { options: mockFirebaseOptions, tenantId: "acme" };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.tenantId).toBe("acme");
  });

  it("should NOT read emulator from env when emulator is undefined (explicit opt-in required)", () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    const config: Config = { options: mockFirebaseOptions };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.emulatorHost).toBeUndefined();
  });

  it("should read emulator from env when emulator is explicitly true", () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    const config: Config = { options: mockFirebaseOptions, emulator: true };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.emulatorHost).toBe("localhost:9099");
  });

  it("should have undefined emulatorHost when env is not set and emulator not specified", () => {
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    const config: Config = { options: mockFirebaseOptions };
    const normalized = normalizeConfig(config, undefined);
    expect(normalized.emulatorHost).toBeUndefined();
  });
});
