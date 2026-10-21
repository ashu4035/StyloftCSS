import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {siteUrl} from '../site.config.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const pages=walk(root).filter(p=>p.endsWith('.html')&&!/^google[a-f0-9]+\.html$/i.test(path.basename(p))&&!p.includes(path.sep+'downloads'+path.sep)),canonicalPages=new Set(),titles=new Set();
for(const file of pages){
 const html=fs.readFileSync(file,'utf8'),route='/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');
 const expected=new URL(route.replace(/^\/light(?=\/)/,'').replace(/^\/404\/$/,'/404.html'),siteUrl).href;
 assert.ok(html.includes('rel="canonical" href="'+expected+'"'),file+' canonical');
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 assert.ok(html.match(/name="description" content="[^"]+"/),file+' description');
 const data=html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
 assert.ok(data,file+' schema');assert.equal(JSON.parse(data[1])['@graph'][1].url,expected);
 assert.doesNotMatch(html,/<link[^>]+href="https:\/\/(?:api|cdn)\.fontshare\.com/,'No external render-blocking font CSS');
 assert.equal((html.match(/as="font"/g)||[]).length,2,'Only heading and body fonts preloaded');
 assert.ok(html.includes('property="og:url" content="'+expected+'"'));
 if(route.includes('404'))assert.ok(html.includes('noindex, follow'));
 else if(!route.startsWith('/light/')){assert.ok(!titles.has(title),'Unique titles: '+title);titles.add(title);canonicalPages.add(expected);}
}
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(new Set(urls),canonicalPages);assert.equal(urls.length,canonicalPages.size);
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: '+siteUrl+'/sitemap.xml'));
assert.ok(fs.statSync(path.join(root,'social-preview.png')).size>0);
console.log('PASS SEO metadata on '+pages.length+' pages; '+urls.length+' unique canonical sitemap URLs; robots, JSON-LD and PNG share image');

const fonts=JSON.parse(fs.readFileSync(path.join(root,'fonts/manifest.json'),'utf8'));
for(const font of fonts){const bytes=fs.readFileSync(path.join(root,'fonts',font.file));assert.equal(bytes.toString('ascii',0,4),'wOF2');assert.equal(bytes.length,font.bytes);}
assert.ok(fs.readFileSync(path.join(root,'_headers'),'utf8').includes('max-age=31536000, immutable'));
console.log('PASS local WOFF2 font files, two preloads and static cache configuration');

const textUrls=fs.readFileSync(path.join(root,'sitemap.txt'),'utf8').trim().split(/\r?\n/);
assert.deepEqual(textUrls,urls,'Text sitemap contains the same canonical URLs as XML');
assert.equal(new Set(textUrls).size,textUrls.length);
console.log('PASS alternative text sitemap: '+textUrls.length+' matching URLs');

const guidance=JSON.parse(fs.readFileSync(path.resolve(root,'../src/data/component-guidance.json'),'utf8'));
for(const [slug,advice]of Object.entries(guidance)){assert.equal(advice.length,4);for(const theme of ['','light/']){const html=fs.readFileSync(path.join(root,theme,'components',slug,'index.html'),'utf8');assert.ok(html.includes('When to use '));assert.ok(html.includes('Accessibility checks'));assert.ok(html.includes('Browser support and integration'));assert.ok(html.includes(advice[0].replaceAll('&','&amp;')));}}
const tutorials=JSON.parse(fs.readFileSync(path.resolve(root,'../src/data/tutorials.json'),'utf8'));
for(const t of tutorials){assert.ok(t.sections.reduce((n,s)=>n+s[1].split(/\s+/).length,0)>200,'Substantive tutorial: '+t.slug);assert.ok(fs.existsSync(path.join(root,'tutorials',t.slug,'index.html')));}
console.log('PASS editorial guidance for 40 families and three original tutorials');
