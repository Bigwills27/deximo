import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440,700]) {
  const p = await b.newPage({ viewport:{width:w,height:1000} });
  await p.goto('http://127.0.0.1:5500/index.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(900);
  const y = await p.evaluate(() => document.querySelector('.gallery-section').getBoundingClientRect().top + window.scrollY);
  await p.evaluate(y => window.scrollTo(0, y - 20), y);
  await p.waitForTimeout(500);
  await p.screenshot({ path:`/tmp/gal-${w}.png` });
  await p.close();
}
await b.close(); console.log('ok');
