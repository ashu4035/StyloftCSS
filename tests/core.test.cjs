const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'dist/styloft.css'), 'utf8');
test('core budget and measured report match the actual bytes', () => {
  const data = fs.readFileSync(path.join(root, 'dist/styloft.min.css'));
  const size = zlib.gzipSync(data, {level:9, mtime:0}).length;
  assert.ok(size < 10000, `gzip ${size}`);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'dist/size-report.json'))).files['styloft.min.css'].gzipBytes, size);
});
test('core is self-contained and ships no scripts, network dependencies or fonts', () => {
  assert.doesNotMatch(css, /@import|url\s*\(|expression\s*\(/i);
  for (const name of fs.readdirSync(path.join(root,'dist'))) assert.match(name, /\.(css|json)$/);
  for (const name of fs.readdirSync(path.join(root,'examples'))) assert.doesNotMatch(fs.readFileSync(path.join(root,'examples',name),'utf8'), /<script\b|\son\w+=/i);
});
test('ordered layers, opt-in modules, and bounded responsive variants', () => {
  assert.match(css, /@layer sl.tokens, sl.reset, sl.base, sl.layout, sl.components, sl.utilities;/);
  assert.doesNotMatch(css, /\.sl-prose|\.sl-table\s/);
  for (const bp of ['sm','md','lg']) for (let n=1; n<=12; n++) assert.ok(css.includes(`.sl-${bp}\\:cols-${n}`));
});
test('token references are defined, with only documented layout hooks defaulted inline', () => {
  const declarations = new Set([...css.matchAll(/(--sl-[\w-]+)\s*:/g)].map(m=>m[1]));
  for (const match of css.matchAll(/var\((--sl-[\w-]+)([^)]*)\)/g)) assert.ok(declarations.has(match[1]) || match[2].startsWith(','), match[1]);
});
test('light and dark semantic color pairs pass WCAG AA contrast thresholds', () => {
  const themes = [ {text:'#172033',muted:'#475569',bg:'#f8fafc',surface:'#ffffff',accent:'#3730a3',on:'#ffffff',danger:'#b91c1c',success:'#166534',border:'#64748b'}, {text:'#f1f5f9',muted:'#cbd5e1',bg:'#0f172a',surface:'#1e293b',accent:'#c7d2fe',on:'#1e1b4b',danger:'#fca5a5',success:'#86efac',border:'#94a3b8'} ];
  const lum = h => h.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  for (const t of themes) {
    for (const key of ['text','muted','accent','danger','success']) for (const bg of ['bg','surface']) assert.ok(ratio(t[key],t[bg])>=4.5, `${key}/${bg}`);
    assert.ok(ratio(t.accent,t.on)>=4.5);
    for (const bg of ['bg','surface']) assert.ok(ratio(t.border,t[bg])>=3);
    for (const color of Object.values(t)) assert.ok(css.includes(color), color);
  }
});
