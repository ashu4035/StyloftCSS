import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {siteUrl} from '../site.config.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const pages=walk(root).filter(p=>p.endsWith('.html')),canonicalPages=new Set(),titles=new Set();
for(const file of pages){
 const html=fs.readFileSync(file,'utf8'),route='/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');
 const expected=new URL(route.replace(/^\/light(?=\/)/,'').replace(/^\/404\/$/,'/404.html'),siteUrl).href;
 assert.ok(html.includes('rel="canonical" href="'+expected+'"'),file+' canonical');
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 assert.ok(html.match(/name="description" content="[^"]+"/),file+' description');
 const data=html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
 assert.ok(data,file+' schema');assert.equal(JSON.parse(data[1])['@graph'][1].url,expected);
 assert.ok(html.includes('property="og:url" content="'+expected+'"'));
 if(route.includes('404'))assert.ok(html.includes('noindex, follow'));
 else if(!route.startsWith('/light/')){assert.ok(!titles.has(title),'Unique titles: '+title);titles.add(title);canonicalPages.add(expected);}
}
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(new Set(urls),canonicalPages);assert.equal(urls.length,canonicalPages.size);
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: '+siteUrl+'/sitemap.xml'));
assert.ok(fs.statSync(path.join(root,'social-preview.png')).size>0);
console.log('PASS SEO metadata on '+pages.length+' pages; '+urls.length+' unique canonical sitemap URLs; robots, JSON-LD and PNG share image');
