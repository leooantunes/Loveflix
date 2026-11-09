const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, P, mode] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + P + '/promo.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  if (mode === 'preview') {
    const ts = [2.2, 3.4, 4.0, 5.0, 6.4, 8.0, 9.2, 11.0, 12.8, 14.2, 15.3, 17.8, 21.0, 22.5];
    for (const t of ts) { await p.evaluate(t => setT(t), t); await p.screenshot({ path: `${P}/prev/${t.toFixed(1)}.png`, scale: 'css' }); }
  } else {
    fs.mkdirSync(P + '/frames', { recursive: true });
    const fps = 30, n = Math.round(24 * fps);
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => setT(t), i / fps);
      await p.screenshot({ path: `${P}/frames/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    }
  }
  await b.close();
})();
