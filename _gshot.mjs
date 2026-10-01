import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const w of [1440, 700]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
  await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const el = await page.locator('.gallery-section');
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await el.screenshot({ path: `/tmp/gallery-${w}.png` });
  await page.close();
}
await browser.close();
console.log('done');
