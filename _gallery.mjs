import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const w of [1440, 1024, 700, 460]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const g = document.querySelector('[data-gallery]');
    const track = g.querySelector('[data-gallery-track]');
    const cards = Array.from(track.children);
    const dots = Array.from(g.querySelectorAll('[data-gallery-dot]'));
    const cardW = cards[0].getBoundingClientRect().width;
    const vw = g.querySelector('[data-gallery-viewport]').clientWidth;
    const perView = Math.round(vw / cardW);
    const step = track.style.transform;
    return { total: cards.length, cardW: Math.round(cardW), viewport: vw, perViewApprox: perView, dots: dots.length, active: dots.findIndex(d=>d.classList.contains('is-active')), transform: step };
  });
  console.log('width', w, JSON.stringify(r));
  await page.close();
}
await browser.close();
