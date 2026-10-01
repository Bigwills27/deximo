import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:5599/index.html', { waitUntil:'networkidle' });
await p.waitForTimeout(1200);
const res = await p.evaluate(() => {
  const out = {};
  const btn = document.querySelector('.footer-newsletter-btn');
  if (btn) out.subscribe = { bg: getComputedStyle(btn).backgroundImage, bgc: getComputedStyle(btn).backgroundColor };
  const dots = document.querySelectorAll('.carousel-dot.is-active');
  out.activeDots = Array.from(dots).map(d => ({ bg: getComputedStyle(d).backgroundColor, w: getComputedStyle(d).width }));
  out.primary = getComputedStyle(document.documentElement).getPropertyValue('--primary');
  out.theme = document.documentElement.dataset.theme;
  return out;
});
console.log(JSON.stringify(res,null,2));
await b.close();
