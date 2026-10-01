import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:5500/index.html', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
const res = await p.evaluate(() => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const btn = document.querySelector('.footer-newsletter-btn');
  const dots = document.querySelectorAll('.carousel-dot.is-active');
  return {
    theme: document.documentElement.dataset.theme,
    subscribeBg: btn ? cs(btn).backgroundImage : null,
    activeDotBg: dots.length ? cs(dots[0]).backgroundColor : null,
    activeDotCount: dots.length,
    primary: cs(document.documentElement).getPropertyValue('--primary').trim(),
    headingWeight: cs(document.querySelector('.hero-title, h1'))?.fontWeight,
    logoV: cs(document.querySelector('.logo-v'))?.backgroundImage,
  };
});
console.log(JSON.stringify(res,null,2));
await b.close();
