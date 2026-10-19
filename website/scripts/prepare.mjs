import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const framework = path.resolve(root, '..');
execFileSync(process.execPath, [path.join(framework, 'scripts/build.cjs')], {stdio:'inherit'});
const dest = path.join(root,'public/downloads');
fs.mkdirSync(dest,{recursive:true});
for (const name of ['styloft.css','styloft.min.css','prose.css','prose.min.css','tables.css','tables.min.css','variants.css','variants.min.css','responsive.css','responsive.min.css','motion.css','motion.min.css','button-fx.css','button-fx.min.css','slider.css','slider.min.css','editor.css','editor.min.css','header.css','header.min.css','cursor.css','cursor.min.css','select.css','select.min.css','tabs.css','tabs.min.css','size-report.json']) {
  fs.copyFileSync(path.join(framework,'dist',name),path.join(dest,name));
}
fs.cpSync(path.join(framework,'dist/components'),path.join(dest,'components'),{recursive:true});
for(const file of ['collections.css','collections.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['fields.css','fields.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['colors.css','colors.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['dates.css','dates.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['overlays.css','overlays.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['status.css','status.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['media.css','media.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['navigation.css','navigation.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
for(const file of ['surfaces.css','surfaces.min.css'])fs.copyFileSync(path.join(framework,'dist',file),path.join(dest,file));
// The demo styles stay separate from the measured framework core and site branding.
const siteCSS=fs.readFileSync(path.join(root,'src/styles/site.css'),'utf8');
const start=siteCSS.indexOf('.demo-narrow {');
const end=siteCSS.indexOf('.guide-section {',start);
if(start<0||end<0)throw new Error('Demo CSS extraction boundaries are missing');
const motion=`
.demo-kicker { color: #746582; }
.demo-cell { color: #72518b; }
@media (prefers-reduced-motion: no-preference) {
  .demo-lift { transition: transform .22s, box-shadow .22s, border-color .22s; }
  .demo-lift:hover, .demo-lift:focus-within { transform: translateY(-6px); box-shadow: 0 16px 30px #66457d12; }
  .demo-glow { transition: box-shadow .22s, border-color .22s; }
  .demo-animated-link span { transition: transform .2s; }
  .demo-animated-link:hover span, .demo-animated-link:focus-visible span { transform: translateX(6px); }
}
`;
const motionCSS=fs.readFileSync(path.join(root,'src/styles/motion.css'),'utf8');
fs.writeFileSync(path.join(dest,'demo-extensions.css'),'/*! StyloftCSS website demo extensions | MIT | Requires core CSS */\n'+siteCSS.slice(start,end)+motion+motionCSS);
