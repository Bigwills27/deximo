import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', m => console.log('CONSOLE:', m.type(), m.text()));
page.on('pageerror', e => console.log('PAGEERROR:', e.message));

await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });

const gal = page.locator('.gallery-section');
await gal.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const readT = async () => page.evaluate(() => {
  const g = document.querySelector('.gallery-section');
  return {
    gal: g.querySelector('[data-carousel-track]').style.transform || 'none',
    testi: document.querySelector('.testimonial-track').style.transform || 'none',
    active: g.querySelectorAll('.carousel-dot.is-active').length,
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
});
console.log('after-scroll:', await readT());
await page.waitForTimeout(9000);
console.log('after-9s:', await readT());

// real drag
const box = await page.locator('.gallery-window').boundingBox();
console.log('box:', box);
await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(900);
console.log('after-drag:', await readT());

await browser.close();
