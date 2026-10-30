// Usage: node check.mjs <url>. Exits 0 only if #smoke shows SMOKE_OK with no page errors, console errors or failed requests.
import { chromium } from 'playwright';
const url = process.argv[2];
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('response', (r) => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
let text = '';
try {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('#smoke')?.textContent?.startsWith('SMOKE_OK'), null, { timeout: 15000 });
  text = await page.textContent('#smoke');
} catch (e) {
  text = (await page.textContent('#smoke').catch(() => null)) ?? '(no #smoke element)';
}
await browser.close();
const ok = text.startsWith('SMOKE_OK') && errors.length === 0;
console.log(`${ok ? 'PASS' : 'FAIL'} ${url} -> ${text}`);
for (const e of errors) console.log(`  ${e}`);
process.exit(ok ? 0 : 1);
