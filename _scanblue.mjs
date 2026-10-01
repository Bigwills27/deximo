import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:5599/index.html', { waitUntil:'networkidle' });

const scan = () => {
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r,g,bl,a] = m[1].split(',').map(x=>parseFloat(x));
    return {r,g,b:bl,a: a===undefined?1:a};
  };
  const isBlue = (c) => c && c.a>0.05 && c.b > c.r + 25 && c.b > c.g + 15;
  const out = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    const props = ['color','backgroundColor','borderTopColor','borderBottomColor','outlineColor','fill','stroke'];
    props.forEach(pr => {
      const c = parse(cs[pr]);
      if (isBlue(c)) out.push({sel: el.className && typeof el.className==='string'? el.className : el.tagName, tag: el.tagName, pr, val: cs[pr]});
    });
    const bg = cs.backgroundImage;
    if (bg && bg !== 'none') {
      const matches = bg.match(/rgba?\([^)]+\)/g) || [];
      matches.forEach(m => { const c = parse(m); if (isBlue(c)) out.push({sel: el.className&&typeof el.className==='string'?el.className:el.tagName, tag: el.tagName, pr:'bgImage', val:m}); });
    }
  });
  return out;
};

for (const theme of ['dark','light']) {
  await p.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
  await p.waitForTimeout(400);
  const res = await p.evaluate(scan);
  console.log('=== '+theme+' ('+res.length+') ===');
  const seen = new Set();
  res.forEach(r => { const k = r.sel+'|'+r.pr+'|'+r.val; if(!seen.has(k)){seen.add(k); console.log(r.sel, '::', r.pr, '=', r.val);} });
}
await b.close();
