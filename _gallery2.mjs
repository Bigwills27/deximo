import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
await page.waitForTimeout(500);
await page.evaluate(() => document.querySelector('[data-gallery]').scrollIntoView());
const read = () => page.evaluate(() => {
  const g = document.querySelector('[data-gallery]');
  const dots = Array.from(g.querySelectorAll('[data-gallery-dot]'));
  return { active: dots.findIndex(d=>d.classList.contains('is-active')), dots: dots.length, t: g.querySelector('[data-gallery-track]').style.transform };
});
console.log('t0', JSON.stringify(await read()));
await page.waitForTimeout(8500);
console.log('t8.5', JSON.stringify(await read()));
await page.waitForTimeout(8000);
console.log('t16.5', JSON.stringify(await read()));
// swipe test
const box = await page.locator('[data-gallery-viewport]').boundingBox();
await page.mouse.move(box.x + box.width*0.7, box.y + box.height/2);
await page.mouse.down();
await page.mouse.move(box.x + box.width*0.2, box.y + box.height/2, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(900);
console.log('after swipe', JSON.stringify(await read()));
await browser.close();
