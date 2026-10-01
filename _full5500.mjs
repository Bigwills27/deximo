import { chromium } from 'playwright';
const b = await chromium.launch();
for (const theme of ['dark','light']) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto('http://127.0.0.1:5500/index.html', { waitUntil:'networkidle' });
  await p.evaluate(t => { localStorage.setItem('deximo-theme', t); document.documentElement.dataset.theme = t; }, theme);
  await p.waitForTimeout(800);
  await p.evaluate(async () => {
    await new Promise(res => {
      let y = 0; const step = () => { window.scrollTo(0, y); y += 800;
        if (y < document.body.scrollHeight) setTimeout(step, 60); else { window.scrollTo(0,0); setTimeout(res, 300); } };
      step();
    });
  });
  await p.screenshot({ path:`/tmp/full-${theme}.png`, fullPage:true });
  await p.close();
}
await b.close(); console.log('done');
