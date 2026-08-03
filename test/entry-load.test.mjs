import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { EXPECTED_EXPORTS, collectFailures, describeResult, loadWithReact, parseProbeOutput, probeSource } from '../scripts/entry-load.mjs';

/**
 * These tests pin the failure detection, not the fixture's shape. `publint` and
 * `attw` can tell you the package is structurally valid; only loading it tells
 * you it runs. Verified against the published tarballs: 4.2.4 and 4.2.5 throw on
 * the ESM entry while their CJS entry loads, and 4.2.6 loads on both.
 *
 * Kept deliberately small. Each test here fails when the detection breaks, which
 * is the only property worth the lines: a check that quietly degrades into
 * always passing is worse than no check.
 */

describe('parseProbeOutput', () => {
  it('treats unparseable output as a failure rather than throwing', () => {
    const result = parseProbeOutput('Segmentation fault');
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('unparseable-output');
  });
});

describe('collectFailures', () => {
  it('is empty when every entry loaded', () => {
    expect(collectFailures([{ react: '18', esm: { ok: true }, cjs: { ok: true } }])).toEqual([]);
  });

  // The 4.2.5 shape: the ESM entry throws while the CJS entry is fine. A check
  // that only looked at one of them would have missed the shipped regression.
  it('reports an esm-only failure', () => {
    const failures = collectFailures([{ react: '18', esm: { ok: false, reason: 'threw', message: 'require' }, cjs: { ok: true } }]);
    expect(failures).toHaveLength(1);
    expect(failures[0].entry).toBe('esm');
  });

  // The mirror of the case above. Without this, dropping the CJS branch
  // entirely left every test green: the check would silently have become
  // ESM-only, and a UMD-side break would ship.
  it('reports a cjs-only failure', () => {
    const failures = collectFailures([{ react: '18', esm: { ok: true }, cjs: { ok: false, reason: 'threw', message: 'bad' } }]);
    expect(failures).toHaveLength(1);
    expect(failures[0].entry).toBe('cjs');
  });
});

describe('loadWithReact', () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'entry-load-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  /** Stand in for npm and node without installing or running anything. */
  const runner = ({ esm = '{"ok":true,"exports":74}', cjs = '{"ok":true,"exports":74}', onNode } = {}) => {
    const calls = [];
    const run = (cmd, args) => {
      calls.push({ cmd, args });
      if (cmd === 'npm') return '';
      if (onNode) return onNode(args);
      return String(args[0]).endsWith('.mjs') ? esm : cjs;
    };
    return { run, calls };
  };

  // Installing the tarball first would resolve its peers against an empty tree.
  it('installs the peers before the package under test', () => {
    const { run, calls } = runner();
    loadWithReact('/tmp/reactfire.tgz', '18', { run, root: dir });
    const installs = calls.filter((c) => c.cmd === 'npm');
    expect(installs).toHaveLength(2);
    expect(installs[0].args.some((a) => a.endsWith('.tgz'))).toBe(false);
    expect(installs[1].args.some((a) => a.endsWith('.tgz'))).toBe(true);
  });

  it('surfaces a throwing ESM entry, the 4.2.5 shape', () => {
    const { run } = runner({ esm: '{"ok":false,"reason":"threw","message":"Calling `require` for \\"react\\""}' });
    const result = loadWithReact('/tmp/reactfire.tgz', '18', { run, root: dir });
    expect(result.esm.ok).toBe(false);
    expect(result.cjs.ok).toBe(true);
    expect(describeResult(result.esm)).toContain('require');
  });

  // The mirror of the case above, and the one test that keeps the CJS probe
  // wired up. Without it, replacing `cjs: probe('probe.cjs')` with a hardcoded
  // pass leaves the whole suite green: the check silently becomes ESM-only and
  // a UMD-side break ships. Verified by mutation.
  it('surfaces a throwing CJS entry', () => {
    const { run } = runner({ cjs: '{"ok":false,"reason":"threw","message":"boom"}' });
    const result = loadWithReact('/tmp/reactfire.tgz', '18', { run, root: dir });
    expect(result.cjs.ok).toBe(false);
    expect(result.esm.ok).toBe(true);
    expect(collectFailures([{ react: '18', ...result }])[0].entry).toBe('cjs');
  });

  // A probe that dies without printing must not read as a pass.
  it('treats a probe that exits without output as a failure', () => {
    const onNode = () => {
      const error = new Error('killed');
      error.status = 139;
      error.stderr = 'Segmentation fault';
      throw error;
    };
    const { run } = runner({ onNode });
    const result = loadWithReact('/tmp/reactfire.tgz', '18', { run, root: dir });
    expect(result.esm.ok).toBe(false);
    expect(result.esm.reason).toBe('crashed');
    expect(result.esm.code).toBe(139);
  });

  it('fails a package that loads but is missing exports', () => {
    const { run } = runner({ esm: '{"ok":false,"reason":"missing-exports","missing":["useUser"]}' });
    const result = loadWithReact('/tmp/reactfire.tgz', '18', { run, root: dir });
    expect(collectFailures([{ react: '18', ...result }])).toHaveLength(1);
  });
});

/**
 * The tests above drive the runner with canned output, so none of them execute
 * the missing-export filter the probe actually ships. A green CI run does not
 * either: the filter only reports, so breaking it makes every load pass. These
 * run the generated source against a stand-in module instead of a mock.
 */
describe('probeSource', () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reactfire-probe-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  // The probe resolves its target by specifier, so a relative path stands in
  // for the installed package without needing a fixture install.
  function runProbe(exports) {
    fs.writeFileSync(path.join(dir, 'stand-in.mjs'), `export const ${exports.join(' = 1;\nexport const ')} = 1;\n`);
    fs.writeFileSync(path.join(dir, 'probe.mjs'), probeSource('esm', { name: './stand-in.mjs' }));
    return parseProbeOutput(execFileSync(process.execPath, [path.join(dir, 'probe.mjs')], { encoding: 'utf8' }));
  }

  it('passes when every canary is exported', () => {
    const result = runProbe(EXPECTED_EXPORTS);
    expect(result.ok).toBe(true);
  });

  // One dropped submodule is the case the widened canary list exists for, and
  // the case a broken filter would wave through.
  it('names the missing canary when one submodule is dropped', () => {
    const result = runProbe(EXPECTED_EXPORTS.filter((name) => name !== 'useStorageDownloadURL'));
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing-exports');
    expect(result.missing).toEqual(['useStorageDownloadURL']);
  });
});
