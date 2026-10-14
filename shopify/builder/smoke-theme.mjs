import { chromium } from '/Users/deenhuang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const assets=path.resolve('../theme/assets');
const names=fs.readdirSync(assets);
const map=Object.fromEntries(names.map(n=>[n,`/assets/${n}`]));
const html=`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/noor-app.css"></head><body><script>window.NOOR_THEME_ASSETS=${JSON.stringify(map)};window.NOOR_INITIAL_LANGUAGE='en';</script><div data-noor-root></div><script type="module" src="/assets/noor-app.js"></script></body></html>`;
const types={'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.pdf':'application/pdf'};
const server=createServer((req,res)=>{
  if(req.url==='/'||req.url==='/index.html'){res.writeHead(200,{'Content-Type':'text/html'});res.end(html);return;}
  const name=path.basename(new URL(req.url,'http://localhost').pathname);
  if(!names.includes(name)){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream'});
  fs.createReadStream(path.join(assets,name)).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
  for(const width of [390,1440]){
    const page=await browser.newPage({viewport:{width,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'networkidle'});
    for(const [lang,price,film] of [['en','199 USD','video2.mp4'],['zh','1,399 CNY','video1.mp4']]){
      await page.locator('.header-actions select').selectOption(lang);
      assert.equal(await page.locator('h1').textContent(),'HAIORD Ring');
      assert.match(await page.locator('.brand-story').textContent(),lang==='zh'?/感知生命，理解世界。/:/Sense Life\. Understand the World\./);
      assert.doesNotMatch(await page.locator('body').innerText(),/\bNOOR\b/);
      assert.match(await page.locator('.pricing-table').textContent(),new RegExp(price));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.locator('.films .film').count(),1);
      assert.match(await page.locator('.films .film-label').textContent(),lang==='zh'?/轻盈设计，近乎无感/:/Designed to feel like less/);
      assert.ok((await page.locator('.films .film img').getAttribute('src')).includes(film.replace('.mp4','-poster.jpg')));
      await page.locator('.video-thumb').click();
      assert.ok((await page.locator('video').getAttribute('src')).includes(film));
      await page.locator('video').evaluate(v=>{v.muted=true;return v.play();});
      await page.waitForTimeout(600);
      assert.ok(await page.locator('video').evaluate(v=>v.videoWidth>0&&v.currentTime>0&&!v.error));
      await page.keyboard.press('Escape');
      await page.locator('.films .film').click();
      assert.ok((await page.locator('video').getAttribute('src')).includes(film));
      await page.keyboard.press('Escape');
    }
    assert.deepEqual(errors,[]);
    console.log(`Theme bundle smoke test ${width}px: PASS`);
    await page.close();
  }
}finally{await browser.close();server.close();}
