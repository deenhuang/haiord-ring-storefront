import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { enhanceGallery, startProductGalleries } from '../shopify/theme/assets/noor-gallery.js';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function fixture(language = 'en', reduced = false) {
  const dom = new JSDOM(`<html lang="${language}"><body><div class="product-gallery"><div class="main-image"><img src="/1.webp" alt="Ring"><button class="gallery-arrow next">Next</button></div><div class="thumbnails">${[1,2,3,4].map((n,i)=>`<button aria-pressed="${!i}"><img src="/${n}.webp"></button>`).join('')}</div></div></body></html>`, { url: 'https://haiord.com', pretendToBeVisual: true });
  const { window } = dom;
  window.matchMedia = () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} });
  window.HTMLImageElement.prototype.decode = async () => {};
  const gallery = window.document.querySelector('.product-gallery');
  const image = gallery.querySelector('.main-image img');
  const thumbnails = [...gallery.querySelectorAll('.thumbnails button')];
  let index = 0;
  const select = n => {
    index = n;
    image.src = `/${n+1}.webp`;
    thumbnails.forEach((button,i) => button.setAttribute('aria-pressed', String(i === n)));
  };
  thumbnails.forEach((button,i) => button.addEventListener('click',()=>select(i)));
  gallery.querySelector('.next').addEventListener('click',()=>select((index+1)%4));
  const controller = enhanceGallery(gallery, { interval: 30 });
  return { dom, window, gallery, image, controller, get index() { return index; } };
}

test('automatically advances and loops through existing gallery controls', async () => {
  const f = fixture();
  try { await wait(40); assert.equal(f.index, 1); await wait(95); assert.equal(f.index, 0); }
  finally { f.controller.destroy(); f.dom.window.close(); }
});

test('hover pauses autoplay and leaving resumes it', async () => {
  const f = fixture();
  try {
    f.gallery.dispatchEvent(new f.window.Event('pointerenter'));
    await wait(50); assert.equal(f.index, 0);
    f.gallery.dispatchEvent(new f.window.Event('pointerleave'));
    await wait(40); assert.equal(f.index, 1);
  } finally { f.controller.destroy(); f.dom.window.close(); }
});

for (const [language, pause, play] of [['en','Pause slideshow','Play slideshow'],['zh-CN','暂停轮播','播放轮播']]) {
  test(`${language} localizes controls and supports manual pause`, async () => {
    const f = fixture(language);
    try {
      const button = f.gallery.querySelector('.noor-gallery-toggle');
      assert.equal(button.getAttribute('aria-label'), pause);
      button.click(); assert.equal(button.getAttribute('aria-label'), play);
      await wait(50); assert.equal(f.index, 0);
      button.click(); await wait(40); assert.equal(f.index, 1);
    } finally { f.controller.destroy(); f.dom.window.close(); }
  });
}

test('keeps the previous image over the new image while it loads', async () => {
  const f = fixture();
  try {
    f.gallery.querySelector('.noor-gallery-toggle').click();
    f.gallery.querySelector('.next').click();
    await wait(5);
    assert.equal(f.gallery.querySelector('.noor-gallery-outgoing').getAttribute('src'), '/1.webp');
    assert.equal(f.image.getAttribute('src'), '/2.webp');
    assert.equal(f.gallery.querySelector('.noor-gallery-outgoing').getAttribute('aria-hidden'), 'true');
  } finally { f.controller.destroy(); f.dom.window.close(); }
});

test('modal blocks automatic advancement until closed', async () => {
  const f = fixture();
  try {
    const modal = f.window.document.createElement('div');
    modal.className = 'modal-backdrop'; f.window.document.body.append(modal);
    f.controller.refresh(); await wait(50); assert.equal(f.index, 0);
    modal.remove(); f.controller.refresh(); await wait(40); assert.equal(f.index, 1);
  } finally { f.controller.destroy(); f.dom.window.close(); }
});

test('reduced motion starts paused', async () => {
  const f = fixture('en', true);
  try { await wait(50); assert.equal(f.index, 0); assert.equal(f.gallery.querySelector('.noor-gallery-toggle').title, 'Play slideshow'); }
  finally { f.controller.destroy(); f.dom.window.close(); }
});

test('keyboard focus pauses and leaving the gallery resumes', async () => {
  const f = fixture();
  try {
    f.gallery.querySelector('.next').focus(); await wait(50); assert.equal(f.index, 0);
    f.gallery.querySelector('.next').blur(); await wait(40); assert.equal(f.index, 1);
  } finally { f.controller.destroy(); f.dom.window.close(); }
});

test('hidden tabs pause and become eligible again when visible', async () => {
  const f = fixture();
  try {
    Object.defineProperty(f.window.document, 'hidden', { value: true, configurable: true });
    f.window.document.dispatchEvent(new f.window.Event('visibilitychange'));
    await wait(50); assert.equal(f.index, 0);
    Object.defineProperty(f.window.document, 'hidden', { value: false, configurable: true });
    f.window.document.dispatchEvent(new f.window.Event('visibilitychange'));
    await wait(40); assert.equal(f.index, 1);
  } finally { f.controller.destroy(); f.dom.window.close(); }
});

test('destroy removes the timer and controls', async () => {
  const f = fixture();
  f.controller.destroy();
  await wait(50); assert.equal(f.index, 0); assert.equal(f.gallery.querySelector('.noor-gallery-toggle'), null);
  f.dom.window.close();
});

test('language switching updates the control without duplicate initialization', async () => {
  const f = fixture();
  f.controller.destroy();
  const stop = startProductGalleries(f.window.document);
  try {
    f.window.document.documentElement.lang = 'zh-CN'; await wait(5);
    assert.equal(f.gallery.querySelectorAll('.noor-gallery-toggle').length, 1);
    assert.equal(f.gallery.querySelector('.noor-gallery-toggle').title, '暂停轮播');
  } finally { stop(); f.dom.window.close(); }
});
