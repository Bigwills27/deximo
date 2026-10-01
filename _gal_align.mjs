import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 1024, 700, 460]) {
  const p = await b.newPage({ viewport:{width:w,height:900} });
  await p.goto('http://127.0.0.1:5500/index.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const heading = document.querySelector('.gallery-heading');
    const win = document.querySelector('.gallery-window');
    const track = document.querySelector('.gallery-track');
    const card = document.querySelector('.gallery-card');
    const hb = heading.getBoundingClientRect();
    const wb = win.getBoundingClientRect();
    const tb = track.getBoundingClientRect();
    const cb = card.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const dots = document.querySelectorAll('[data-gallery-dots] .carousel-dot').length;
    return {
      headingLeft: Math.round(hb.left), windowLeft: Math.round(wb.left),
      trackLeft: Math.round(tb.left), cardLeft: Math.round(cb.left),
      cardW: Math.round(cb.width), gap, dots,
      perView: Math.round((tb.width + gap) / (cb.width + gap)),
    };
  });
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close();
