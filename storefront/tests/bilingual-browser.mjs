import { chromium } from '/Users/deenhuang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('qa',{recursive:true});
try {
 for(const width of [1440,768,390,320]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:5180',{waitUntil:'networkidle'});
  for(const lang of ['en','zh']) {
   await page.locator('.header-actions select').selectOption(lang);
   assert.equal(await page.locator('h1').textContent(),'HAIORD Ring');
   assert.match(await page.locator('.brand-story').textContent(),lang==='zh'?/感知生命，理解世界。/:/Sense Life\. Understand the World\./);
   assert.equal(await page.locator('#brand-story-title').textContent(),lang==='zh'?'你好，一个更懂你的世界。':'Hello, a World That Knows You.');
   assert.doesNotMatch(await page.locator('body').innerText(),/\bNOOR\b/);
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready;});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width} ${lang}: overflow`);
   assert.equal(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).length),0);
   assert.equal(await page.locator('.pricing-table>div').count(),3);
   assert.match(await page.locator('.pricing-table').textContent(),lang==='zh'?/1,399 CNY/:/199 USD/);
   assert.match(await page.locator('.pricing-table').textContent(),lang==='zh'?/2,399 CNY/:/349 USD/);
   assert.match(await page.locator('.offer strong').textContent(),lang==='zh'?/199 CNY/:/30 USD/);
   assert.equal(await page.locator('.films .film').count(),1,`${width} ${lang}: exactly one film card`);
   assert.match(await page.locator('.films .film-label').textContent(),lang==='zh'?/轻盈设计，近乎无感/:/Designed to feel like less/);
   assert.match(await page.locator('.films .film img').getAttribute('src'),lang==='zh'?/video1-poster\.jpg$/:/video2-poster\.jpg$/);
   await page.screenshot({path:`qa/${width}-${lang}.png`,fullPage:true});
   await page.screenshot({path:`qa/${width}-${lang}-first.png`});
   if(width===1440){
    await page.locator('.video-thumb').click();
    assert.match(await page.locator('video').getAttribute('src'),lang==='zh'?/video1\.mp4$/:/video2\.mp4$/);
    await page.locator('video').evaluate(v=>{v.muted=true;return v.play();});
    await page.waitForTimeout(1000);
    assert.ok(await page.locator('video').evaluate(v=>v.videoWidth>0&&v.currentTime>0&&!v.error));
    await page.keyboard.press('Escape');
    await page.locator('.films .film').click();
    assert.match(await page.locator('video').getAttribute('src'),lang==='zh'?/video1\.mp4$/:/video2\.mp4$/);
    await page.locator('video').evaluate(v=>{v.muted=true;return v.play();});
    await page.waitForTimeout(1000);
    assert.ok(await page.locator('video').evaluate(v=>v.videoWidth>0&&v.currentTime>0&&!v.error));
    await page.keyboard.press('Escape');
    await page.locator('.reserve-row>.button').click();
    assert.match(await page.locator('.reservation-summary').textContent(),lang==='zh'?/199 CNY/:/30 USD/);
    await page.locator('input[type=email]').fill('');
    await page.locator('form button').click();
    assert.match(await page.getByRole('alert').textContent(),lang==='en'?/email/:/邮箱/);
    await page.locator('input[type=email]').fill('preview@example.com');
    await page.locator('form select').selectOption('China');
    await page.locator('input[type=checkbox]').check();
    await page.locator('form button').click();
    await page.locator('.success').waitFor();
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(()=>document.querySelector('[role=dialog]').contains(document.activeElement)));
    await page.keyboard.press('Escape');
   }
  }
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('.header-actions select').inputValue(),'zh');
  assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${width}px EN/ZH, images, prices, no overflow, persistence`);
  await page.close();
 }
} finally {await browser.close();}
