import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const theme = path.resolve('../theme');
const files = fs.readdirSync(theme, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
assert.deepEqual(files.sort(), ['assets','config','layout','locales','sections','templates']);
const layout = fs.readFileSync(path.join(theme,'layout/theme.liquid'),'utf8');
for (const token of ['{{ content_for_header }}','{{ content_for_layout }}']) assert.ok(layout.includes(token));
const home = fs.readFileSync(path.join(theme,'sections/noor-home.liquid'),'utf8');
assert.ok(home.includes('data-noor-root'));
assert.ok(home.includes('asset_url'));
for (const name of ['noor-app.js','noor-app.css','video1.mp4','video2.mp4']) {
  assert.ok(fs.existsSync(path.join(theme,'assets',name)),`Missing ${name}`);
}
for (const name of ['index','product','cart','collection','page','404']) {
  const json = JSON.parse(fs.readFileSync(path.join(theme,`templates/${name}.json`),'utf8'));
  assert.ok(json.sections.main?.type);
  assert.ok(fs.existsSync(path.join(theme,`sections/${json.sections.main.type}.liquid`)));
}
const en = JSON.parse(fs.readFileSync(path.join(theme,'locales/en.default.json'),'utf8'));
const zh = JSON.parse(fs.readFileSync(path.join(theme,'locales/zh-CN.json'),'utf8'));
assert.deepEqual(Object.keys(en.noor).sort(),Object.keys(zh.noor).sort());
JSON.parse(fs.readFileSync(path.join(theme,'config/settings_schema.json'),'utf8'));
JSON.parse(fs.readFileSync(path.join(theme,'config/settings_data.json'),'utf8'));
const schema = home.match(/{% schema %}([\s\S]*?){% endschema %}/);
assert.ok(schema);
JSON.parse(schema[1]);
for (const file of fs.readdirSync(path.join(theme,'assets'))) {
  const bytes=fs.statSync(path.join(theme,'assets',file)).size;
  assert.ok(bytes<=20*1024*1024,`${file} exceeds Shopify's 20 MB asset limit`);
}
console.log('Theme structure, templates, schema, locales, and asset limits: PASS');
