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
  const hue = (c) => {
    const r=c.r/255,g=c.g/255,bl=c.b/255;
    const mx=Math.max(r,g,bl),mn=Math.min(r,g,bl),d=mx-mn;
    if(d===0) return {h:0,s:0};
    let h; if(mx===r)h=((g-bl)/d)%6; else if(mx===g)h=(bl-r)/d+2; else h=(r-g)/d+4;
    h*=60; if(h<0)h+=360;
    const l=(mx+mn)/2; const s=d/(1-Math.abs(2*l-1));
    return {h,s,l};
  };
  const out=[];
  document.querySelectorAll('*').forEach(el=>{
    const cs=getComputedStyle(el);
    ['color','backgroundColor','borderTopColor','outlineColor','fill','stroke'].forEach(pr=>{
      const c=parse(cs[pr]); if(!c||c.a<0.15) return;
      const {h,s,l}=hue(c);
      if(h>=190 && h<=260 && s>0.25 && l>0.12 && l<0.9){
        out.push({sel:(typeof el.className==='string'&&el.className)||el.tagName, pr, val:cs[pr], h:Math.round(h), s:+s.toFixed(2)});
      }
    });
    const bg=cs.backgroundImage;
    if(bg&&bg!=='none'){
      (bg.match(/rgba?\([^)]+\)/g)||[]).forEach(m=>{const c=parse(m); if(!c||c.a<0.15)return; const {h,s,l}=hue(c);
        if(h>=190&&h<=260&&s>0.25&&l>0.12&&l<0.9) out.push({sel:(typeof el.className==='string'&&el.className)||el.tagName, pr:'bgImage', val:m, h:Math.round(h), s:+s.toFixed(2)});
      });
    }
  });
  return out;
};

for (const theme of ['dark','light']) {
  await p.evaluate(t=>{document.documentElement.dataset.theme=t;}, theme);
  await p.waitForTimeout(400);
  const res = await p.evaluate(scan);
  const seen=new Set(); const uniq=[];
  res.forEach(r=>{const k=r.sel+'|'+r.pr+'|'+r.val; if(!seen.has(k)){seen.add(k); uniq.push(r);}});
  console.log('=== '+theme+' ('+uniq.length+' unique) ===');
  uniq.forEach(r=>console.log(`h${r.h} s${r.s} | ${r.sel} :: ${r.pr} = ${r.val}`));
}
await b.close();
