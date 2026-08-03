#!/usr/bin/env node
/**
 * Entry-point load test (#765, item 3).
 *
 * Installs the packed tarball into a throwaway project alongside real `react`
 * and `firebase`, then actually loads both entry points:
 *
 *   import('reactfire')   the ESM entry
 *   require('reactfire')  the CJS entry
 *
 * Usage:
 *   node scripts/entry-load.mjs <tarball> [--react 18,19] [--keep]
 *
 * Why this earns its place alongside `publint` and `attw`: those analyse the
 * package's structure, and #759 was a `require` inlined into the body of a
 * structurally valid ESM file. Their output is byte-identical across 4.2.3,
 * 4.2.4, 4.2.5 and 4.2.6. Actually loading the package is the only thing that
 * catches it, because it observes the failure rather than pattern-matching for
 * it. Verified against the published tarballs: 4.2.5 throws "Calling `require`
 * for \"react\" in an environment that doesn't expose the `require` function"
 * on the ESM entry while its CJS entry loads fine, and 4.2.6 loads on both.
 *
 * It runs as its own script and its own CI job because it has to install a real
 * dependency tree, which the other package checks do not.
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Mirrors the versions CI already type-checks against, so a break that is
// specific to one React major is visible here too.
export const DEFAULT_REACT_VERSIONS = ['18', '19'];

// Held to the major the repo develops against rather than "latest", so the
// fixture is deterministic and stays inside the declared peer range
// (^9 || ^10 || ^11 || ^12).
export const FIREBASE_RANGE = '^11.10.0';

// A load that resolves but exports nothing is still a broken package, and an
// empty or partial build would otherwise pass. One canary per submodule that
// index.ts re-exports, so a drop confined to any single one shows up here.
export const EXPECTED_EXPORTS = [
  'useUser', // ./auth
  'useDatabaseObject', // ./database
  'FirebaseAppProvider', // ./firebaseApp
  'useFirestoreDocData', // ./firestore
  'useCallableFunctionResponse', // ./functions
  'SuspenseWithPerf', // ./performance
  'useRemoteConfigValue', // ./remote-config
  'useStorageDownloadURL', // ./storage
  'useObservable', // ./useObservable
  'AuthSdkContext', // ./sdk
];

export const PACKAGE_NAME = 'reactfire';

/** package.json for the throwaway consumer project. */
export function fixtureManifest({ react, firebase = FIREBASE_RANGE } = {}) {
  return {
    name: 'reactfire-entry-load-fixture',
    version: '1.0.0',
    private: true,
    // No "type" field: the fixture must be able to hold both an .mjs and a .cjs
    // probe, and each probe carries its own extension instead.
    dependencies: {
      react: `^${react}`,
      'react-dom': `^${react}`,
      firebase,
    },
  };
}

/**
 * Probe sources. Each prints a single JSON line so the parent does not have to
 * scrape human-readable output, and each reports a missing export as a failure
 * rather than only reporting a thrown error.
 */
export function probeSource(kind, { name = PACKAGE_NAME, expected = EXPECTED_EXPORTS } = {}) {
  const check = `
  const missing = ${JSON.stringify(expected)}.filter((k) => typeof mod[k] === 'undefined');
  if (missing.length > 0) {
    console.log(JSON.stringify({ ok: false, reason: 'missing-exports', missing }));
  } else {
    console.log(JSON.stringify({ ok: true, exports: Object.keys(mod).length }));
  }`;

  if (kind === 'esm') {
    return `
import(${JSON.stringify(name)})
  .then((mod) => {${check}
  })
  .catch((error) => {
    console.log(JSON.stringify({ ok: false, reason: 'threw', message: String(error && error.message || error) }));
  });
`;
  }
  return `
try {
  const mod = require(${JSON.stringify(name)});${check}
} catch (error) {
  console.log(JSON.stringify({ ok: false, reason: 'threw', message: String(error && error.message || error) }));
}
`;
}

/** Read the single JSON line a probe prints; anything else is itself a failure. */
export function parseProbeOutput(stdout) {
  const line = String(stdout ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .at(-1);
  if (!line) return { ok: false, reason: 'no-output' };
  try {
    return JSON.parse(line);
  } catch {
    return { ok: false, reason: 'unparseable-output', message: line.slice(0, 200) };
  }
}

/** One-line summary of a probe result, for the CI log. */
export function describeResult(result) {
  if (result.ok) return `loaded, ${result.exports} export(s)`;
  if (result.reason === 'missing-exports') return `loaded but missing export(s): ${result.missing.join(', ')}`;
  if (result.reason === 'threw') return `threw: ${result.message}`;
  if (result.reason === 'no-output') return 'probe produced no output';
  if (result.reason === 'crashed') return `probe exited ${result.code}: ${result.message}`;
  return `${result.reason}: ${result.message ?? ''}`;
}

/**
 * Build the fixture and load both entry points for one React major.
 *
 * `run` is injectable so the orchestration is testable without installing
 * anything; the real work is two npm installs and two node processes.
 */
export function loadWithReact(tarball, react, { run = execFileSync, root, expected = EXPECTED_EXPORTS, name = PACKAGE_NAME } = {}) {
  const dir = root ?? fs.mkdtempSync(path.join(os.tmpdir(), `reactfire-load-${react}-`));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), `${JSON.stringify(fixtureManifest({ react }), null, 2)}\n`);
  fs.writeFileSync(path.join(dir, 'probe.mjs'), probeSource('esm', { name, expected }));
  fs.writeFileSync(path.join(dir, 'probe.cjs'), probeSource('cjs', { name, expected }));

  const npm = (args) => run('npm', args, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  // Peers and the package under test go in together: installing the tarball
  // first would resolve its peers against an empty tree.
  npm(['install', '--no-audit', '--no-fund', '--loglevel', 'error']);
  npm(['install', '--no-audit', '--no-fund', '--loglevel', 'error', path.resolve(tarball)]);

  const probe = (file) => {
    try {
      return parseProbeOutput(run(process.execPath, [path.join(dir, file)], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }));
    } catch (error) {
      // A probe that dies without printing (segfault, OOM, an error thrown at
      // top level in a way that escapes the handler) is still a failed load.
      return { ok: false, reason: 'crashed', code: error.status ?? null, message: String(error.stderr ?? error.message ?? '').slice(0, 300) };
    }
  };

  return { dir, esm: probe('probe.mjs'), cjs: probe('probe.cjs') };
}

/** Collapse per-React results into the list of failures. */
export function collectFailures(results) {
  const failures = [];
  for (const { react, esm, cjs } of results) {
    if (!esm.ok) failures.push({ react, entry: 'esm', detail: describeResult(esm) });
    if (!cjs.ok) failures.push({ react, entry: 'cjs', detail: describeResult(cjs) });
  }
  return failures;
}

// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const keep = args.includes('--keep');
  const reactArg = args.includes('--react') ? args[args.indexOf('--react') + 1] : null;
  const tarball = args.find((a) => !a.startsWith('--') && a !== reactArg);

  if (!tarball) {
    console.error('usage: node scripts/entry-load.mjs <tarball> [--react 18,19] [--keep]');
    return 2;
  }
  if (!fs.existsSync(tarball)) {
    console.error(`tarball not found: ${tarball}`);
    return 2;
  }

  const versions = reactArg ? reactArg.split(',').filter(Boolean) : DEFAULT_REACT_VERSIONS;
  console.log(`entry load test: ${path.basename(tarball)}\nreact: ${versions.join(', ')}  firebase: ${FIREBASE_RANGE}\n`);

  const results = [];
  const dirs = [];
  try {
    for (const react of versions) {
      const { dir, esm, cjs } = loadWithReact(tarball, react);
      dirs.push(dir);
      results.push({ react, esm, cjs });
      console.log(`  react ${react}  import('${PACKAGE_NAME}')  ${describeResult(esm)}`);
      console.log(`  react ${react}  require('${PACKAGE_NAME}') ${describeResult(cjs)}`);
    }

    const failures = collectFailures(results);
    if (failures.length === 0) {
      console.log('\nboth entry points load on every React version tested');
      return 0;
    }

    console.error(`\n${failures.length} entry-point load failure(s):\n`);
    for (const { react, entry, detail } of failures) {
      console.error(`  [${entry}] react ${react}: ${detail}`);
    }
    console.error('\n  The packed package does not load. This is the #759 class:');
    console.error('  the files are all present, they just do not run. Check dist/index.js');
    console.error('  for an inlined CJS module, and check that the externals in');
    console.error('  vite.config.ts still cover use-sync-external-store/shim.');
    return 1;
  } finally {
    if (!keep) for (const dir of dirs) fs.rmSync(dir, { recursive: true, force: true });
    else console.log(`\nfixtures kept: ${dirs.join(', ')}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
