import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:5599/index.html', { waitUntil:'networkidle' });
await p.waitForTimeout(1000);
// footer subscribe
const btn = p.locator('.footer-newsletter-btn').first();
await btn.scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
await p.screenshot({ path:'/tmp/sub.png', clip: await btn.boundingBox().then(b=>({x:b.x-40,y:b.y-60,width:b.width+80,height:b.height+90})) });
// gallery dots
const dots = p.locator('[data-gallery-dots]').first();
await dots.scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
const bb = await dots.boundingBox();
await p.screenshot({ path:'/tmp/dots.png', clip:{x:bb.x-200,y:bb.y-60,width:bb.width+400,height:bb.height+90} });
// logo
const logo = p.locator('.logo-v').first();
await p.evaluate(()=>window.scrollTo(0,0));
await p.waitForTimeout(400);
const lb = await logo.boundingBox();
if(lb) await p.screenshot({ path:'/tmp/logo.png', clip:{x:lb.x-40,y:lb.y-30,width:lb.width+120,height:lb.height+60} });
await b.close();
console.log('ok');
