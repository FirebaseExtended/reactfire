import * as React from 'react';
import * as firebaseAppModule from 'firebase/app';
import { registerVersion } from 'firebase/app';

declare const process: { env: Record<string, string | undefined> };

// Vite injects REACTFIRE_VERSION from package.json at build time.
export const version = process.env.REACTFIRE_VERSION as string;

let hasRegisteredFallback = false;

/**
 * Registers the active React and ReactFire versions with `@firebase/app` for platform logging.
 *
 * Checks `_components` before calling `registerVersion` so repeated renders do not emit
 * duplicate-registration debug logs under `setLogLevel('debug')`.
 *
 * Never throws: telemetry is best effort, so a partially mocked or mis-bundled `firebase/app`
 * cannot break importing or rendering ReactFire.
 */
export function registerReactFireVersion(): void {
  try {
    const components = (firebaseAppModule as unknown as { _components?: unknown })._components;
    const reactVersion = React.version || 'unknown';

    if (components instanceof Map) {
      if (!components.has('react-version')) {
        registerVersion('react', reactVersion);
      }
      if (!components.has('reactfire-version')) {
        registerVersion('reactfire', version);
      }
      return;
    }

    if (!hasRegisteredFallback) {
      hasRegisteredFallback = true;
      registerVersion('react', reactVersion);
      registerVersion('reactfire', version);
    }
  } catch {
    // Best effort: drop the error rather than fail the import or render.
  }
}

// Register at module load so apps that initialize Firebase SDKs at module scope
// record React and ReactFire in the first daily heartbeat before React renders.
registerReactFireVersion();
