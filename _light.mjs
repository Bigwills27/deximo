import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:5500/index.html', { waitUntil:'networkidle' });
await p.evaluate(()=>{document.documentElement.dataset.theme='light';});
await p.waitForTimeout(600);
const res = await p.evaluate(()=>{
  const cs=(el)=>el?getComputedStyle(el):null;
  const btn=document.querySelector('.footer-newsletter-btn');
  const dots=document.querySelectorAll('.carousel-dot.is-active');
  return {
    primary: cs(document.documentElement).getPropertyValue('--primary').trim(),
    highlight: cs(document.documentElement).getPropertyValue('--highlight-gradient').trim(),
    subscribeBg: btn?cs(btn).backgroundImage:null,
    activeDotBg: dots.length?cs(dots[0]).backgroundColor:null,
  };
});
console.log(JSON.stringify(res,null,2));
await b.close();
