// Writes a CommonJS declaration file (`.d.cts`) next to every `dist/*.d.ts`, for the `require` export condition.
// A copy of `index.d.ts` is not enough: its relative imports resolve to `.d.ts` files, which TypeScript reads
// as ESM in this `"type": "module"` package, so CommonJS consumers get TS1479 on each import (#850).
// Rewriting `./x.js` to `./x.cjs` points each import at the matching `.d.cts` instead.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist';
// `from` covers `import ... from` and `export ... from`; the bare `import '...'` form covers side-effect imports.
const relativeSpecifier = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]*)\2/g;

for (const file of readdirSync(dir, { recursive: true }).filter((f) => f.endsWith('.d.ts'))) {
  const source = readFileSync(join(dir, file), 'utf8');
  const cjs = source.replace(relativeSpecifier, (_, keyword, quote, specifier) => {
    if (!specifier.endsWith('.js')) {
      throw new Error(`${file}: relative import without a .js extension: ${specifier}`);
    }
    return `${keyword}${quote}${specifier.slice(0, -'.js'.length)}.cjs${quote}`;
  });
  writeFileSync(join(dir, file.replace(/\.d\.ts$/, '.d.cts')), cjs);
}
