import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const res = await page.evaluate(() => {
  const isBlue = (r,g,b) => b > 60 && b > r + 18 && b >= g + 8;
  const out = [];
  const seen = new Set();
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x.trim()));
    return p;
  };
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    ['color','backgroundColor','borderTopColor','borderBottomColor','borderLeftColor','borderRightColor','outlineColor'].forEach((prop) => {
      const v = cs[prop];
      const p = parse(v);
      if (!p) return;
      if (p[3] === 0) return;
      if (!isBlue(p[0],p[1],p[2])) return;
      const key = prop + '|' + v + '|' + el.className;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0,60), prop, val: v, text: (el.textContent||'').trim().slice(0,40) });
    });
    const bi = cs.backgroundImage;
    if (bi && bi.includes('gradient')) {
      const nums = bi.match(/rgba?\([^)]+\)/g) || [];
      if (nums.some(n => { const p = parse(n); return p && isBlue(p[0],p[1],p[2]); })) {
        out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0,60), prop:'backgroundImage', val: bi, text:(el.textContent||'').trim().slice(0,40) });
      }
    }
  });
  return out;
});
console.log(JSON.stringify(res, null, 1));
await browser.close();
