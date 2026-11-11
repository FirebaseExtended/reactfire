// Type-checks a CommonJS consumer (`module: node16`, `skipLibCheck: false`) against a packed reactfire tarball.
// attw passes even when this fails (#850). Only errors in reactfire's files or the fixture count: with
// `skipLibCheck: false` the check also reports errors inside firebase's and @types' own declarations.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const tarball = resolve(process.argv[2] ?? 'reactfire.tgz');
const fixture = join(dirname(fileURLToPath(import.meta.url)), 'cjs-fixture');
const installed = join(fixture, 'node_modules', 'reactfire');

// Unpack rather than `npm install`, so reactfire's dependencies and peers resolve from the repo's node_modules.
rmSync(join(fixture, 'node_modules'), { recursive: true, force: true });
mkdirSync(installed, { recursive: true });
execFileSync('tar', ['-xzf', tarball, '-C', installed, '--strip-components=1']);

const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
let output = '';
try {
  execFileSync(process.execPath, [tsc, '-p', '.'], { cwd: fixture, encoding: 'utf8' });
} catch (error) {
  output = error.stdout ?? '';
  // tsc exits non-zero on dependency errors too; anything without a diagnostic is a failure to run.
  if (!output.includes('error TS')) throw error;
}
const ours = output.split('\n').filter((line) => /^(node_modules\/reactfire\/|index\.ts)/.test(line));
if (ours.length > 0) {
  console.error(ours.join('\n'));
  process.exit(1);
}
console.log('CommonJS type check passed');
