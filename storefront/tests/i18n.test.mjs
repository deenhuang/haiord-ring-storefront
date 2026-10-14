import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../src/i18n.mjs';
test('Chinese and English have the same complete content structure', () => {
  const compare = (a,b) => {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort());
    for (const k of Object.keys(a)) {
      if (typeof a[k] === 'object') compare(a[k],b[k]);
      else { assert.equal(typeof b[k],'string'); assert.ok(b[k].trim()); }
    }
  };
  compare(content.en,content.zh);
});
test('the English product film points to the user-specified video', () => {
  assert.equal(content.en.productVideo,'video2');
});
test('the Chinese product film uses the Chinese video without changing English', () => {
  assert.equal(content.zh.productVideo,'video1');
  assert.notEqual(content.zh.productVideo,content.en.productVideo);
});
