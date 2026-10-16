/* MIT. Dependency-free build; no JavaScript ships to consumers. */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const order = '@layer sl.tokens, sl.reset, sl.base, sl.layout, sl.components, sl.utilities;\n';
const banner = '/*! StyloftCSS v0.1.0 | MIT License */\n';
const files = ['tokens', 'reset', 'base', 'layout', 'components'];
const spaces = [0, 1, 2, 3, 4, 6, 8, 12, 16];
function utilities() {
  const rules = [];
  const add = (name, value) => rules.push(`.sl-${name} { ${value} }`);
  for (const n of spaces) {
    for (const [prefix, property] of Object.entries({p:'padding', px:'padding-inline', py:'padding-block', m:'margin', mx:'margin-inline', my:'margin-block'})) {
      add(`${prefix}-${n}`, `${property}: var(--sl-space-${n});`);
    }
    add(`gap-${n}`, `--sl-gap: var(--sl-space-${n}); gap: var(--sl-space-${n});`);
  }
  const helpers = {
    block:'display: block;', hidden:'display: none;', flex:'display: flex;', grid:'display: grid;',
    row:'flex-direction: row;', column:'flex-direction: column;', wrap:'flex-wrap: wrap;',
    'items-center':'align-items: center;', 'items-start':'align-items: flex-start;',
    'justify-between':'justify-content: space-between;', 'justify-center':'justify-content: center;',
    'grow':'flex-grow: 1;', 'w-full':'inline-size: 100%;', 'mx-auto':'margin-inline: auto;',
    'text-center':'text-align: center;', 'text-start':'text-align: start;',
    'text-sm':'font-size: var(--sl-text-sm);', 'text-lg':'font-size: var(--sl-text-lg);',
    'text-xl':'font-size: var(--sl-text-xl);', 'text-muted':'color: var(--sl-muted);',
    'text-danger':'color: var(--sl-danger);', 'text-success':'color: var(--sl-success);',
    bold:'font-weight: 700;', surface:'background: var(--sl-surface);',
    rounded:'border-radius: var(--sl-radius);', shadow:'box-shadow: var(--sl-shadow);',
    measure:'max-inline-size: var(--sl-measure);',
    'sr-only':'position: absolute; inline-size: 1px; block-size: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;'
  };
  for (const [name, value] of Object.entries(helpers)) add(name, value);
  for (let n = 1; n <= 12; n++) add(`cols-${n}`, `--sl-cols: ${n};`);
  // Deliberately bounded variants: layouts and display only, to control core size.
  for (const [bp, width] of [['sm',40], ['md',48], ['lg',64]]) {
    const responsive = [];
    for (let n = 1; n <= 12; n++) responsive.push(`.sl-${bp}\\:cols-${n} { --sl-cols: ${n}; }`);
    for (const name of ['block','hidden','flex','grid','row','column']) responsive.push(`.sl-${bp}\\:${name} { ${helpers[name]} }`);
    rules.push(`@media (min-width: ${width}rem) {\n${responsive.join('\n')}\n}`);
  }
  return `@layer sl.utilities {\n${rules.join('\n')}\n}\n`;
}
// Conservative whitespace compression preserves calc(), strings and declaration order.
function compact(css) {
  const strings=[];
  const masked=css.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,value=>`__STRING_${strings.push(value)-1}__`);
  return masked.replace(/\/\*(?!\!)[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,])\s*/g, '$1').replace(/:\s+/g,':').replace(/;}/g, '}').trim().replace(/__STRING_(\d+)__/g,(_,i)=>strings[Number(i)]) + '\n';
}
const outputs = {};
const core = banner + order + files.map(name => fs.readFileSync(path.join(root, 'src', name + '.css'), 'utf8')).join('\n') + '\n' + utilities();
outputs['styloft.css'] = core;
outputs['styloft.min.css'] = compact(core);
for (const name of ['prose','tables','variants','responsive','motion','button-fx','slider','editor','header','cursor','select']) {
  const css = banner + order + fs.readFileSync(path.join(root, 'src/modules', name + '.css'), 'utf8');
  outputs[name + '.css'] = css;
  outputs[name + '.min.css'] = compact(css);
}
const standalone = require('./standalone.cjs')(root,banner,order,utilities());
for(const [name,css] of Object.entries(standalone.outputs)){outputs[name]=css;outputs[name.replace('.css','.min.css')]=compact(css);}
outputs['components/manifest.json']=JSON.stringify(standalone.manifest,null,2)+'\n';
const metrics = Object.fromEntries(Object.entries(outputs).filter(([name])=>name.endsWith('.css')).map(([name, css]) => [name, {bytes: Buffer.byteLength(css), gzipBytes: zlib.gzipSync(css, {level: 9, mtime: 0}).length}]));
if (metrics['styloft.min.css'].gzipBytes >= 10000) throw new Error('Core must be below 10,000 gzip bytes');
outputs['size-report.json'] = JSON.stringify({budgetBytes:10000, compression:'gzip level 9, deterministic header; decimal KB', files:metrics}, null, 2) + '\n';
fs.mkdirSync(path.join(root, 'dist'), {recursive:true});
for (const [name, value] of Object.entries(outputs)) {
  const target = path.join(root, 'dist', name);
  if(!process.argv.includes('--check'))fs.mkdirSync(path.dirname(target),{recursive:true});
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) throw new Error(`Stale build: ${name}. Run npm run build.`);
  } else fs.writeFileSync(target, value);
}
console.log(JSON.stringify(metrics, null, 2));
