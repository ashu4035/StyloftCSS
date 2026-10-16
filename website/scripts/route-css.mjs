// Conservative build-time CSS selection for this static site (including template-declared playground classes).
// Keep a complete rule whenever ANY class in it appears on the page. This retains
// hover/focus/open state selectors and grouped rules without rewriting specificity.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import postcss from 'postcss';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const pages=walk(dist).filter(f=>f.endsWith('.html'));
const sources=new Map(),outputs=new Set(),metrics=[];
const bytes=css=>({bytes:Buffer.byteLength(css),gzipBytes:zlib.gzipSync(css,{level:9}).length});
for(const file of pages){
  let html=fs.readFileSync(file,'utf8');
  const classes=new Set([...html.matchAll(/\bclass="([^"]*)"/g)].flatMap(m=>m[1].split(/\s+/)));
  const links=[...html.matchAll(/href="(\/_astro\/[^"?]+\.css)"/g)].map(m=>m[1]);
  let before=0,after=0,raw=0;
  for(const link of new Set(links)){
    if(!sources.has(link))sources.set(link,fs.readFileSync(path.join(dist,link),'utf8'));
    const original=sources.get(link),ast=postcss.parse(original);
    ast.walkComments(c=>{if(!c.text.startsWith('!'))c.remove();});
    ast.walkRules(rule=>{
      if(rule.parent?.type==='atrule'&&/keyframes$/i.test(rule.parent.name))return;
      const referenced=[...rule.selector.matchAll(/\.((?:\\.|[\w-])+)/g)].map(m=>m[1].replace(/\\(.)/g,'$1'));
      if(referenced.length&&!referenced.some(name=>classes.has(name)))rule.remove();
    });
    const values=[];ast.walkDecls(d=>{if(d.prop.startsWith('animation'))values.push(d.value);});
    ast.walkAtRules(at=>{if(/keyframes$/i.test(at.name)&&!values.some(v=>v.split(/[\s,]+/).includes(at.params)))at.remove();});
    let removed=true;while(removed){removed=false;ast.walkAtRules(at=>{if(at.nodes?.length===0){at.remove();removed=true;}});}
    const css=ast.toString();
    const name='route-'+crypto.createHash('sha256').update(css).digest('hex').slice(0,16)+'.css';
    const target='/_astro/'+name;fs.writeFileSync(path.join(dist,target),css);outputs.add(target);
    html=html.split(link).join(target);
    before+=bytes(original).gzipBytes;after+=bytes(css).gzipBytes;raw+=bytes(css).bytes;
  }
  fs.writeFileSync(file,html);
  metrics.push({page:path.relative(dist,file).replaceAll('\\','/'),rawCssBytes:raw,gzipCssBytes:after,unselectedGzipCssBytes:before});
}
// Remove only known generated inputs when no generated HTML references them.
const finalHTML=pages.map(file=>fs.readFileSync(file,'utf8')).join('\n');
for(const link of sources.keys())if(!outputs.has(link)&&!finalHTML.includes(link))fs.unlinkSync(path.join(dist,link));
const report={compression:'gzip level 9; decimal KB; sum of CSS resources per page',previousSingleBundle:{bytes:55835,gzipBytes:12604},maxPageGzipBytes:Math.max(...metrics.map(m=>m.gzipCssBytes)),uniqueStylesheets:outputs.size,pages:metrics};
fs.writeFileSync(path.join(dist,'css-size-report.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(root,'public/css-size-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`CSS selection: ${pages.length} pages, ${outputs.size} unique stylesheets, largest page ${report.maxPageGzipBytes} gzip bytes (previous baseline 12604).`);
