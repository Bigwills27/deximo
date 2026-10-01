import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:5500/index.html', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
const res = await p.evaluate(() => {
  const out = { sheets: [], btnCount: 0, dotActive: 0, matching: [] };
  for (const s of document.styleSheets) {
    out.sheets.push({ href: s.href || 'inline', rules: (()=>{try{return s.cssRules.length}catch(e){return 'blocked'}})() });
    let rules; try { rules = s.cssRules; } catch(e){ continue; }
    for (const r of rules) {
      const t = r.cssText || '';
      if (t.includes('footer-newsletter-btn') || t.includes('carousel-dot') || (r.selectorText && (r.selectorText.includes('.footer-newsletter-btn')||r.selectorText.includes('.carousel-dot')))) {
        out.matching.push({ href: s.href || 'inline', sel: r.selectorText || '(nested)', text: t.slice(0,200) });
      }
    }
  }
  out.btnCount = document.querySelectorAll('.footer-newsletter-btn').length;
  out.dotActive = document.querySelectorAll('.carousel-dot.is-active').length;
  return out;
});
console.log(JSON.stringify(res,null,2));
await b.close();
