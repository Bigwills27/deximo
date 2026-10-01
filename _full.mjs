import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/full.png', fullPage: true });
const colors = await page.evaluate(() => {
  const out = {};
  const grab = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).backgroundColor : null; };
  out['btn-app'] = grab('.btn-app');
  out['nav-cta'] = grab('.nav-cta');
  out['body'] = grab('body');
  out['bg-soft-section'] = grab('.testimonial');
  out['primary'] = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  out['primary-soft'] = getComputedStyle(document.documentElement).getPropertyValue('--primary-soft').trim();
  out['blob'] = getComputedStyle(document.documentElement).getPropertyValue('--blob').trim();
  out['circle'] = getComputedStyle(document.documentElement).getPropertyValue('--circle').trim();
  out['bg-blue'] = getComputedStyle(document.documentElement).getPropertyValue('--bg-blue').trim();
  out['bg-soft'] = getComputedStyle(document.documentElement).getPropertyValue('--bg-soft').trim();
  out['surface-tint'] = getComputedStyle(document.documentElement).getPropertyValue('--surface-tint').trim();
  out['highlight'] = getComputedStyle(document.documentElement).getPropertyValue('--highlight-gradient').trim();
  return out;
});
console.log(JSON.stringify(colors, null, 1));
await browser.close();
