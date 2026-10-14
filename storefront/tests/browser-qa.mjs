import { chromium } from '/Users/deenhuang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('qa', { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
try {
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844],['small-mobile',320,760],['tablet',768,1024]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:5180', { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
      await document.fonts.ready;
    });
    const media = await page.evaluate(() => [...document.images].map(i => ({ src:i.src, width:i.naturalWidth })));
    assert.equal(media.filter(i => !i.width).length, 0, 'all product imagery must load');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no horizontal overflow');
    await page.screenshot({ path:`qa/${name}.png`,fullPage:true });
    await page.screenshot({ path:`qa/${name}-first-screen.png` });
    if (name === 'desktop') {
      await page.getByRole('button',{name:'Silver',exact:true}).click();
      await page.getByAltText('NOOR Ring in Silver').waitFor();
      await page.getByRole('button',{name:'Gunmetal',exact:true}).click();
      await page.getByAltText('NOOR Ring in Gunmetal').waitFor();
      await page.getByRole('button',{name:'Rose Gold',exact:true}).click();
      await page.getByAltText('NOOR Ring in Rose Gold').waitFor();
      await page.getByRole('button',{name:'Champagne Gold',exact:true}).click();
      await page.getByRole('button',{name:'Next product image'}).click();
      await page.getByAltText('NOOR Ring collection in four finishes').waitFor();
      await page.getByRole('button',{name:'Previous product image'}).click();
      await page.getByRole('combobox',{name:'Currency',exact:true}).selectOption('CNY');
      assert.match(await page.locator('.offer strong').textContent(), /199 CNY/);
      await page.getByRole('combobox',{name:'Ring size',exact:true}).selectOption('9');
      await page.getByRole('button',{name:'Increase quantity'}).click();
      await page.getByRole('button',{name:'Reserve your NOOR',exact:true}).click();
      assert.match(await page.locator('.reservation-summary').textContent(), /398 CNY/);
      await page.getByRole('button',{name:'Preview my reservation'}).click();
      assert.match(await page.getByRole('alert').textContent(), /valid email/);
      await page.getByRole('textbox',{name:'Email address'}).fill('preview@example.com');
      await page.getByRole('combobox',{name:'Country / region'}).selectOption('China');
      await page.getByRole('checkbox').check();
      await page.screenshot({path:'qa/reservation.png'});
      await page.getByRole('button',{name:'Preview my reservation'}).click();
      await page.getByRole('heading',{name:'Your NOOR starts here.'}).waitFor();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.querySelector('[role=dialog]').contains(document.activeElement)), true, 'focus stays inside success dialog');
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(),0);
      await page.getByRole('button',{name:'Size guide'}).click();
      await page.getByRole('button',{name:'Select a sizing kit'}).click();
      assert.equal(await page.locator('#size').inputValue(),'kit');
      await page.getByRole('combobox',{name:'Currency',exact:true}).selectOption('SAR');
      assert.match(await page.locator('.offer strong').textContent(),/SAR 100/);
      await page.locator('summary').filter({hasText:'Is a subscription required?'}).click();
      assert.match(await page.locator('details[open]').textContent(),/without a mandatory subscription/);
      for (const label of ['Inside the ring','Designed to feel like less']) {
        await page.getByRole('button',{name:label}).click();
        await page.locator('video').evaluate(v => {v.muted = true;v.play();});
        await page.waitForTimeout(1600);
        const playback = await page.locator('video').evaluate(v => ({time:v.currentTime,width:v.videoWidth,error:v.error?.message}));
        assert.ok(playback.time>0 && playback.width>0 && !playback.error, 'video must play');
        await page.keyboard.press('Escape');
      }
    }
    if (name === 'mobile') {
      await page.getByRole('button',{name:'Toggle navigation'}).click();
      await page.getByRole('navigation').getByRole('link',{name:'FAQ',exact:true}).click();
      assert.equal(await page.locator('nav.open').count(),0);
      await page.locator('.mobile-reserve').getByRole('button').click();
      await page.screenshot({path:'qa/mobile-reservation.png'});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.keyboard.press('Escape');
    }
    assert.deepEqual(errors, [], 'no JavaScript errors');
    results.push({viewport:name,width,height,loadedImages:media.length,consoleErrors:errors,horizontalOverflow:false});
    await page.close();
  }
  await writeFile('qa/results.json', JSON.stringify({passed:true, results},null,2));
  console.log(JSON.stringify({passed:true,results},null,2));
} finally { await browser.close(); }
