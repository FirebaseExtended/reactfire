import { describe, it, expect } from "vitest";
import { isEmulatorRefreshToken } from "./index";

describe("isEmulatorRefreshToken", () => {
  it("should return false for random opaque string", () => {
    const refresh_token = "some_random_opaque_string";
    expect(isEmulatorRefreshToken(refresh_token)).toBe(false);
  });

  it("should return false for JSON without the key", () => {
    const payload = JSON.stringify({ foo: "bar" });
    const refresh_token = Buffer.from(payload).toString("base64");
    expect(isEmulatorRefreshToken(refresh_token)).toBe(false);
  });

  it("should return true for JSON with the key", () => {
    const payload = JSON.stringify({ _AuthEmulatorRefreshToken: true });
    const refresh_token = Buffer.from(payload).toString("base64");
    expect(isEmulatorRefreshToken(refresh_token)).toBe(true);
  });

  it("should return false for malformed base64 strings", () => {
    // "{" is not valid base64 usually, or decodes to something invalid
    const refresh_token = "{";
    expect(isEmulatorRefreshToken(refresh_token)).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isEmulatorRefreshToken("")).toBe(false);
  });
});
