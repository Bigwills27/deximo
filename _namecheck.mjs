import { chromium } from 'playwright';
const b = await chromium.launch();
for (const f of ['index.html','about.html','signin.html','signup.html']) {
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`file://${process.cwd()}/${f}`, { waitUntil: 'load' });
  const t = await p.title();
  const txt = await p.evaluate(() => document.body.innerText);
  console.log(f, '| title:', t, '| has Dixemo:', /Dixemo|DIXEMO|dixemo/.test(txt), '| stray Deximo:', /deximo/i.test(txt), '| errors:', errs.length ? errs : 'none');
  await p.close();
}
await b.close();
