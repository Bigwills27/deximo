import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem('dixemo-theme','light'));
await page.goto('http://127.0.0.1:5599/index.html', { waitUntil: 'load' });
await page.waitForTimeout(1000);
const res = await page.evaluate(() => {
  const hue = (r,g,b) => { r/=255;g/=255;b/=255; const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
    if(d===0) return 0; let h; if(mx===r) h=((g-b)/d)%6; else if(mx===g) h=(b-r)/d+2; else h=(r-g)/d+4; h*=60; if(h<0)h+=360; return h; };
  const map = new Map();
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if(!m) return null; return m[1].split(',').map(x=>parseFloat(x.trim())); };
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    ['color','backgroundColor','borderTopColor','outlineColor'].forEach((prop) => {
      const v = cs[prop]; const p = parse(v); if(!p||p[3]===0) return;
      const [r,g,b] = p; const mx=Math.max(r,g,b); if (mx < 40) return;
      const h = hue(r,g,b);
      if (h < 190 || h > 258) return;
      if(!map.has(v)) map.set(v,{count:0,h:Math.round(h),samples:new Set()});
      const e=map.get(v); e.count++; if(e.samples.size<4) e.samples.add((el.className&&String(el.className).slice(0,40))||el.tagName.toLowerCase());
    });
  });
  return [...map.entries()].map(([k,v])=>({color:k,hue:v.h,count:v.count,samples:[...v.samples]})).sort((a,b)=>b.count-a.count);
});
console.log('--- LIGHT THEME residual BLUE-family (hue 190-258) ---');
for (const r of res) console.log(r.count, r.color, 'hue='+r.hue, '<=', r.samples.join(', '));
if(!res.length) console.log('NONE');
await browser.close();
