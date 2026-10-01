import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const res = await page.evaluate(() => {
  const isBlue = (r,g,b) => b > 60 && b > r + 18 && b >= g + 8;
  const map = new Map();
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if(!m) return null; return m[1].split(',').map(x=>parseFloat(x.trim())); };
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    ['color','backgroundColor','borderTopColor','outlineColor'].forEach((prop) => {
      const v = cs[prop]; const p = parse(v); if(!p||p[3]===0) return; if(!isBlue(p[0],p[1],p[2])) return;
      const key = v;
      if(!map.has(key)) map.set(key, {count:0, samples:new Set()});
      const e = map.get(key); e.count++; if(e.samples.size<4) e.samples.add((el.className&&String(el.className).slice(0,40))||el.tagName.toLowerCase());
    });
    const bi = cs.backgroundImage;
    if (bi && bi.includes('gradient')) {
      const nums = bi.match(/rgba?\([^)]+\)/g)||[];
      if (nums.some(n=>{const p=parse(n);return p&&isBlue(p[0],p[1],p[2]);})) {
        if(!map.has(bi)) map.set(bi,{count:0,samples:new Set()});
        const e=map.get(bi); e.count++; if(e.samples.size<4) e.samples.add((el.className&&String(el.className).slice(0,40))||el.tagName.toLowerCase());
      }
    }
  });
  return [...map.entries()].map(([k,v])=>({color:k,count:v.count,samples:[...v.samples]})).sort((a,b)=>b.count-a.count);
});
for (const r of res) console.log(r.count, r.color, '<=', r.samples.join(', '));
await browser.close();
