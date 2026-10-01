import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/hero.png' });
// sample computed colors of heading highlight
const info = await page.evaluate(() => {
  const spans = Array.from(document.querySelectorAll('h1 span, h2 span')).slice(0, 8);
  return spans.map(s => ({ text: s.textContent.trim().slice(0, 30), bg: getComputedStyle(s).backgroundImage, color: getComputedStyle(s).color }));
});
console.log(JSON.stringify(info, null, 1));
const btn = await page.evaluate(() => {
  const b = document.querySelector('.btn-app, .nav-cta, .btn-primary');
  return b ? { cls: b.className, bg: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color } : null;
});
console.log('BTN', JSON.stringify(btn));
await browser.close();
