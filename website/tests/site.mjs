import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const out=path.join(root,'test-results');
fs.mkdirSync(out,{recursive:true});
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(dist), pages=files.filter(f=>f.endsWith('.html'));
assert.equal(pages.length,50,'25 dark pages and 25 light counterparts');
for(const file of files)if(/\.(m?js|cjs)$/.test(file))assert.equal(path.dirname(file),path.join(dist,'_astro'),'Only bundled documentation scripts');
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  assert.doesNotMatch(html,/\son\w+\s*=/i,`No inline event handlers: ${file}`);
  const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,html.includes('class="example-source"')?1:0,'Only the approved documentation playground script');
  for(const [,attrs,body] of scripts){assert.ok(attrs.includes('type="module"'));if(!attrs.includes('src=')){assert.ok(body.includes('script-src'));assert.ok(body.includes('Preview updated'));}}
  for(const match of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){
    const link=match[1]; if(!link.startsWith('/'))continue;
    const local=path.join(dist,decodeURIComponent(link));
    assert.ok(fs.existsSync(local),`Broken link ${link} in ${file}`);
    if(fs.statSync(local).isDirectory())assert.ok(fs.existsSync(path.join(local,'index.html')),link);
  }
}
assert.deepEqual(fs.readFileSync(path.join(dist,'downloads/styloft.min.css')),fs.readFileSync(path.join(root,'../dist/styloft.min.css')));
console.log(`PASS ${pages.length} built pages, all local links/assets, real CSS downloads, framework CSS only, approved documentation playground`);
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(dist,'.'+pathname);
  if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.png')?'image/png':file.endsWith('.webp')?'image/webp':file.endsWith('.json')?'application/json':'text/html');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const passed=[];
try{
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:process.platform==='win32'?{channel:'msedge'}:{})});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  let page=await context.newPage();
  const base=`http://127.0.0.1:${server.address().port}`;
  const errors=[]; page.on('pageerror',err=>errors.push(err.message));
  const fresh=async()=>{await page.close();page=await context.newPage();page.on('pageerror',err=>errors.push(err.message));};
  const check=async(name,fn)=>{if(process.env.SITE_CHECK&&!name.includes(process.env.SITE_CHECK))return;await fn();passed.push(name);console.log('PASS '+name);};
  const darkRoutes=['/','/getting-started/','/components/','/layouts/','/themes/','/components/buttons/','/components/cards/','/components/headers/','/components/heroes/','/components/footers/','/components/forms/','/components/accordions/','/components/tables/','/components/grid/','/components/flex/','/components/animations/','/components/feedback/','/components/typography/'];
  darkRoutes.push('/components/editor/','/components/cursors/','/components/tabs/');
  const routes=[...darkRoutes,...darkRoutes.map(route=>'/light'+route)];
  routes.push('/components/links/','/light/components/links/');
  routes.push('/components/sliders/','/light/components/sliders/','/components/testimonials/','/light/components/testimonials/');
  await check('every public page renders with one h1, unique IDs and no browser errors',async()=>{
    for(const route of routes){
      await fresh();
      const response=await page.goto(base+route);assert.equal(response.status(),200,route);
      assert.equal(await page.locator('h1').count(),1,route);
      const ids=await page.locator('[id]').evaluateAll(els=>els.map(el=>el.id));assert.equal(new Set(ids).size,ids.length,'duplicate IDs '+route);
      assert.equal(await page.locator('script').count(),(await page.locator('.example-source').count())>0?1:0);
      const missing=await page.locator('a[href^="#"]').evaluateAll(els=>els.filter(el=>el.hash&&!document.getElementById(el.hash.slice(1))).map(el=>el.hash));assert.deepEqual(missing,[],route);
    }
    assert.deepEqual(errors,[]);
  });
  await check('all routes reflow without horizontal overflow at 320, 375, 768 and 1440px',async()=>{
    for(const route of routes){
      await fresh();
      await page.goto(base+route);
      for(const width of [320,375,768,1440]){
        await page.setViewportSize({width,height:900});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} at ${width}`);
      }
    }
  });
  await check('mobile navigation opens by keyboard and its destinations work',async()=>{
    await page.setViewportSize({width:375,height:900});await page.goto(base+'/');
    await page.locator('.mobile-nav summary').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('.mobile-nav').getAttribute('open'),'');
    await page.locator('.mobile-nav a[href="/components/"]').click();assert.equal(new URL(page.url()).pathname,'/components/');
  });
  await check('native accordions and exact source-code disclosures work',async()=>{
    await page.goto(base+'/components/accordions/');
    const disclosure=page.locator('.example-canvas details').nth(1);
    await disclosure.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await disclosure.getAttribute('open'),'');
    const source=page.locator('.example-source').first();await source.locator('summary').focus();await page.keyboard.press('Enter');
    assert.equal(await source.getAttribute('open'),'');
    assert.ok((await source.locator('code').textContent()).includes('<details class="sl-details" open>'));
    assert.equal(await page.locator('summary:focus').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
  });
  await check('theme previews are real independent color scopes',async()=>{
    await page.goto(base+'/themes/');
    assert.equal(await page.locator('.theme-gallery [data-theme="light"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
    assert.equal(await page.locator('.theme-gallery [data-theme="dark"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(30, 41, 59)');
  });
  await check('dark default, same-page theme switch, and light navigation without scripts',async()=>{
    await fresh();await page.setViewportSize({width:1440,height:1000});
    await page.goto(base+'/components/cards/');
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(6, 11, 22)');
    await page.locator('[data-theme-switch]').click();
    assert.equal(new URL(page.url()).pathname,'/light/components/cards/');
    assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    assert.equal(await page.locator('[data-theme-switch]').getAttribute('aria-label'),'Switch to dark mode');
    assert.equal(await page.locator('.docs-sidebar a[href="/light/components/buttons/"]').count(),1);
    await page.locator('.docs-sidebar a[href="/light/components/buttons/"]').click();
    await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await page.locator('[data-theme-switch]').click();assert.equal(new URL(page.url()).pathname,'/components/buttons/');
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    for(const route of ['/','/light/']){
      await page.goto(base+route);
      assert.equal(await page.locator('.site-header .brand-image').evaluate(el=>el.complete&&el.naturalWidth>0),true);
      assert.ok((await page.locator('link[rel="icon"]').getAttribute('href')).endsWith('.png'));
    }
  });
  await check('hover lift works and reduced motion removes the movement',async()=>{
    await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/components/animations/');
    const card=page.locator('.demo-lift');
    await page.emulateMedia({reducedMotion:'no-preference'});await card.hover();
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.demo-lift')).transform.includes('-6'));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.demo-lift')).transform==='none');
    assert.equal(await card.evaluate(el=>getComputedStyle(el).transform),'none');
    assert.ok(parseFloat(await card.evaluate(el=>getComputedStyle(el).transitionDuration))<=.00001);
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('responsive demo uses actual StyloftCSS columns',async()=>{
    for(const [width,cols] of [[375,1],[768,2],[1440,3]]){
      await page.setViewportSize({width,height:900});await page.goto(base+'/components/grid/');
      assert.equal(await page.locator('.example-canvas .sl-grid').first().evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),cols);
    }
  });
  await check('mobile tables stack every field with accessible labels and no clipped content',async()=>{
    for(const route of ['/components/tables/','/light/components/tables/']){
      await fresh();await page.goto(base+route);
      for(const width of [320,375,507,639]){
        await page.setViewportSize({width,height:900});
        const tables=page.locator('.sl-table--responsive');assert.equal(await tables.count(),2);
        for(const table of await tables.all()){
          assert.equal(await table.locator('tbody tr').first().evaluate(el=>getComputedStyle(el).display),'grid');
          const wrap=table.locator('..');assert.equal(await wrap.evaluate(el=>el.scrollWidth>el.clientWidth),false,`${route} ${width}px wrapper`);
          assert.equal(await table.locator('td').evaluateAll(els=>els.some(el=>el.scrollWidth>el.clientWidth)),false,'cell content fits');
        }
        assert.equal(await page.getByRole('cell',{name:'Portfolio',exact:true}).count(),1);
        assert.equal(await page.getByRole('cell',{name:'Jordan',exact:true}).count(),1);
        assert.equal(await page.locator('.sl-table-label').first().evaluate(el=>getComputedStyle(el).display),'block');
      }
      await page.setViewportSize({width:1440,height:1000});
      assert.equal(await page.locator('.sl-table--responsive tbody tr').first().evaluate(el=>getComputedStyle(el).display),'table-row');
      assert.equal(await page.locator('.sl-table-label').first().evaluate(el=>getComputedStyle(el).display),'none');
    }
  });
  await check('scroll reveals follow viewport entry; hover transitions animate in and out',async()=>{
    await fresh();await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(base+'/components/animations/');
    assert.equal(await page.evaluate(()=>CSS.supports('animation-timeline','view()')),true);
    const reveal=page.locator('.demo-scroll-reveal').first();
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.demo-scroll-reveal')).opacity)<.99);
    const before=await reveal.evaluate(el=>Number(getComputedStyle(el).opacity));
    const position=await reveal.evaluate(el=>el.getBoundingClientRect().top+scrollY);
    await page.evaluate(y=>scrollTo(0,y-180),position);
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.demo-scroll-reveal')).opacity)>.99);
    assert.ok(before<1,'reveal begins before full opacity');
    assert.equal(await reveal.evaluate(el=>getComputedStyle(el).animationTimeline),'view()');
    const card=page.locator('.demo-lift');await card.scrollIntoViewIfNeeded();
    assert.ok((await card.evaluate(el=>getComputedStyle(el).transitionProperty)).includes('transform'));
    assert.ok(parseFloat(await card.evaluate(el=>getComputedStyle(el).transitionDuration))>=.2);
    await card.hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.demo-lift')).transform.includes('-6'));
    await page.mouse.move(2,2);await page.waitForFunction(()=>getComputedStyle(document.querySelector('.demo-lift')).transform==='none');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.demo-scroll-reveal')).animationName==='none');
    assert.equal(await reveal.evaluate(el=>getComputedStyle(el).opacity),'1');
    assert.equal(await reveal.evaluate(el=>getComputedStyle(el).translate),'none');
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('skip link and root font-size reflow',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/');
    assert.ok(await page.locator('.sl-skip').evaluate(el=>el.getBoundingClientRect().bottom<=0),'unfocused skip link stays hidden with reduced motion');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(base+'/');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');
    for(const route of ['/','/components/','/components/tables/','/light/','/light/components/','/light/components/tables/']){
      await page.goto(base+route);await page.setViewportSize({width:375,height:900});await page.locator('html').evaluate(el=>el.style.fontSize='200%');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' enlarged text');
    }
  });
  await check('exclusive, independent and multiple-open accordion behaviors',async()=>{
    await fresh();await page.goto(base+'/components/accordions/');
    const exclusive=page.locator('#exclusive-accordion details');
    assert.equal(await page.locator('#exclusive-accordion details[open]').count(),1);
    await exclusive.nth(1).locator('summary').click();assert.equal(await exclusive.nth(0).getAttribute('open'),null);
    assert.equal(await page.locator('#exclusive-accordion details[open]').count(),1);
    await exclusive.nth(1).locator('summary').click();assert.equal(await page.locator('#exclusive-accordion details[open]').count(),0);
    await exclusive.nth(2).locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await exclusive.nth(2).getAttribute('open'),'');
    const multiple=page.locator('#multiple-accordion details');assert.equal(await page.locator('#multiple-accordion details[open]').count(),2);
    await multiple.nth(2).locator('summary').click();assert.equal(await page.locator('#multiple-accordion details[open]').count(),3);
    await page.locator('details[name="design-demo"]').nth(1).locator('summary').click();
    assert.equal(await page.locator('details[name="delivery-demo"][open]').count(),1);
  });
  await check('button sizes, ghost/fill/icon variants, and reusable hover transitions',async()=>{
    await fresh();await page.goto(base+'/components/buttons/');
    const heights=[];for(const size of ['sm','md','lg'])heights.push(await page.locator(`.sl-btn--${size}`).first().evaluate(el=>el.getBoundingClientRect().height));
    assert.ok(heights[0]<heights[1]&&heights[1]<heights[2]);
    assert.equal(await page.locator('.sl-btn--ghost').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
    assert.equal(await page.getByRole('button',{name:'Save this example',exact:true}).count(),1);
    const tilt=page.locator('button.sl-hover-tilt');await tilt.scrollIntoViewIfNeeded();
    assert.ok(parseFloat(await tilt.evaluate(el=>getComputedStyle(el).transitionDuration))>=.2);
    await tilt.hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('button.sl-hover-tilt')).transform!=='none');
    await page.mouse.move(1,1);await page.waitForFunction(()=>getComputedStyle(document.querySelector('button.sl-hover-tilt')).transform==='none');
    const fill=page.locator('button.sl-hover-fill').first();await fill.hover();
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('button.sl-hover-fill')).backgroundSize==='100% 100%');
    assert.ok((await fill.evaluate(el=>getComputedStyle(el).backgroundImage)).includes('linear-gradient'));
  });
  await check('page CSS selection reduces transfer without runtime code',async()=>{
    const report=JSON.parse(fs.readFileSync(path.join(dist,'css-size-report.json'),'utf8'));
    assert.ok(report.maxPageGzipBytes<report.previousSingleBundle.gzipBytes);
    assert.ok(report.maxPageGzipBytes<11000);
    assert.equal(report.pages.length,50);
    await page.goto(base+'/components/animations/');
    assert.ok((await page.locator('link[rel="stylesheet"][href^="/_astro/"]').first().getAttribute('href')).includes('/route-'));
    assert.ok((await page.locator('.sl-split').first().getAttribute('aria-label')).length>0);
    assert.equal(await page.locator('.sl-char').first().evaluate(el=>el.closest('[aria-hidden="true"]')!==null),true);
    assert.equal(await page.locator('.sl-scene').count(),1);
  });
  await check('standalone optional modules and all requested pixel boundaries',async()=>{
    const css=['styloft','variants','responsive','motion','button-fx','slider'].map(name=>fs.readFileSync(path.join(root,'../dist',name+'.min.css'),'utf8')).join('\n');
    const modulePage=await context.newPage();
    try{
      await modulePage.setContent(`<style>${css}</style><div id="pixels" class="sl-grid sl-cols-4 sl-down-1200:cols-3 sl-down-1023:cols-2 sl-down-991:cols-1 sl-down-767:cols-2"><b>A</b><b>B</b><b>C</b><b>D</b></div><button class="sl-btn sl-btn--sm sl-hover-lift">Small</button><button class="sl-btn sl-btn--lg">Large</button><h2 class="sl-reveal-text">Always readable</h2><div class="sl-slider"><div id="standalone-track" class="sl-slider__track"><article class="sl-slide">One</article><article class="sl-slide">Two</article></div></div><button id="standalone-fx" class="sl-btn sl-fx-doors">Doors</button>`);
      assert.equal(await modulePage.locator('#standalone-track').evaluate(el=>getComputedStyle(el).display),'flex');
      assert.ok(await modulePage.locator('#standalone-track').evaluate(el=>el.scrollWidth>el.clientWidth));
      assert.equal(await modulePage.locator('#standalone-fx').evaluate(el=>getComputedStyle(el,'::before').content),'""');
      for(const [width,cols] of [[1201,4],[1200,3],[1024,3],[1023,2],[992,2],[991,1],[768,1],[767,2]]){
        await modulePage.setViewportSize({width,height:900});assert.equal(await modulePage.locator('#pixels').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),cols,`${width}px`);
      }
      assert.ok(await modulePage.locator('.sl-btn--lg').evaluate(el=>el.getBoundingClientRect().height)>await modulePage.locator('.sl-btn--sm').evaluate(el=>el.getBoundingClientRect().height));
      await modulePage.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await modulePage.locator('.sl-reveal-text').evaluate(el=>getComputedStyle(el).animationName),'none');
      assert.equal(await modulePage.locator('.sl-reveal-text').evaluate(el=>getComputedStyle(el).clipPath),'none');
    }finally{await modulePage.close();}
  });
  await check('slider navigation, keyboard scrolling and native range controls',async()=>{
    for(const route of ['/components/sliders/','/light/components/sliders/']){
      await fresh();await page.setViewportSize({width:375,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+route);
      assert.equal(await page.locator('.sl-slider').count(),5);
      await page.locator('.sl-slider__nav a[href="#featured-2"]').click();
      await page.waitForFunction(()=>document.querySelector('#featured-track').scrollLeft>document.querySelector('#featured-track').clientWidth*.8);
      assert.equal(await page.locator(':focus').getAttribute('id'),'featured-2');
      await page.locator('#featured-2 a[href="#featured-1"]').click();
      await page.waitForFunction(()=>document.querySelector('#featured-track').scrollLeft<2);
      await page.locator('#featured-track').focus();await page.keyboard.press('ArrowRight');
      await page.waitForFunction(()=>document.querySelector('#featured-track').scrollLeft>10);
      await page.locator('#vertical-track').focus();await page.keyboard.press('ArrowDown');
      await page.waitForFunction(()=>document.querySelector('#vertical-track').scrollTop>10);
      const range=page.getByRole('slider',{name:'Intensity',exact:true});await range.focus();const value=Number(await range.inputValue());await page.keyboard.press('ArrowRight');assert.equal(Number(await range.inputValue()),value+5);
      assert.equal(await page.getByRole('slider',{name:'Disabled example',exact:true}).isDisabled(),true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('signature button effects animate distinctive states and respect reduced motion',async()=>{
    await fresh();await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'/components/buttons/#signature-buttons');
    const doors=page.locator('#signature-buttons .sl-fx-doors');await doors.hover();
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('#signature-buttons .sl-fx-doors'),'::before').translate.includes('-100%'));
    const orbit=page.locator('#signature-buttons .sl-fx-orbit');await orbit.hover();
    await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('#signature-buttons .sl-fx-orbit')).getPropertyValue('--sl-orbit'))>5);
    assert.ok((await orbit.evaluate(el=>getComputedStyle(el).backgroundImage)).includes('conic-gradient'));
    const swap=page.getByRole('button',{name:'Explore the library',exact:true});await swap.hover();
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.sl-fx-label > span:last-child')).translate.split(' ').every(v=>parseFloat(v)===0));
    const spotlight=page.locator('.sl-fx-spotlight');await spotlight.hover();
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.sl-fx-spotlight'),'::before').scale==='12');
    await page.keyboard.press('Tab');await doors.focus();assert.equal(await doors.evaluate(el=>el.matches(':focus-visible')),true);
    assert.equal(await doors.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
    await page.emulateMedia({reducedMotion:'reduce'});
    await orbit.hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('#signature-buttons .sl-fx-orbit')).animationName==='none');
    assert.equal(await doors.evaluate(el=>getComputedStyle(el,'::before').translate),'none');
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('accordion height transitions open, close, reverse and keep right chevrons',async()=>{
    for(const route of ['/components/accordions/','/light/components/accordions/']){
      await fresh();await page.setViewportSize({width:375,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+route);
      const disclosure=page.locator('#multiple-accordion .sl-details').first();await disclosure.scrollIntoViewIfNeeded();await disclosure.locator('summary').focus();
      const sample=async(open)=>disclosure.evaluate(async(el,open)=>{
        const start=el.getBoundingClientRect().height;el.open=open;const heights=[start];
        const t=performance.now();while(performance.now()-t<450){await new Promise(requestAnimationFrame);heights.push(el.getBoundingClientRect().height);}
        return heights;
      },open);
      const closing=await sample(false);const opening=await sample(true);
      for(const heights of [closing,opening]){
        const lo=Math.min(...heights),hi=Math.max(...heights);assert.ok(hi-lo>20);
        assert.ok(heights.filter(h=>h>lo+1&&h<hi-1).length>=4,'must render intermediate heights');
        assert.ok(Math.max(...heights.slice(1).map((h,i)=>Math.abs(h-heights[i])))<(hi-lo)*.6,'no single-frame height snap');
      }
      const style=await disclosure.locator('summary').evaluate(el=>({display:getComputedStyle(el).display,margin:getComputedStyle(el,'::after').marginInlineStart,rotate:getComputedStyle(el,'::after').rotate}));
      assert.equal(style.display,'flex');assert.ok(parseFloat(style.margin)>0);assert.equal(style.rotate,'225deg');
      await disclosure.evaluate(async el=>{el.open=false;await new Promise(r=>setTimeout(r,100));el.open=true;});await page.waitForTimeout(450);
      assert.equal(await disclosure.evaluate(el=>getComputedStyle(el,'::details-content').contentVisibility),'visible');
      await page.emulateMedia({reducedMotion:'reduce'});await disclosure.evaluate(el=>el.open=false);
      assert.equal(await disclosure.evaluate(el=>getComputedStyle(el,'::details-content').transitionDuration),'0s');
    }
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('testimonial grids reflow and sliders navigate in both themes',async()=>{
    for(const route of ['/components/testimonials/','/light/components/testimonials/']){
      await fresh();await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+route);
      assert.equal(await page.locator('#example-2 figure').count(),3);
      for(const [width,columns] of [[375,1],[900,2],[1440,3]]){
        await page.setViewportSize({width,height:1000});
        const actual=await page.locator('#example-2 .sl-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
        assert.equal(actual,columns,'testimonial grid at '+width);
      }
      await page.setViewportSize({width:375,height:1000});
      const track=page.locator('#example-3 .sl-slider__track');
      await page.locator('#example-3 a[href="#testimonial-3"]').click();
      assert.ok(await track.evaluate(el=>el.scrollLeft>el.clientWidth),'third testimonial scrolled into view');
      await page.locator('#example-3 a[href="#testimonial-1"]').click();
      await track.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(500);
      assert.ok(await track.evaluate(el=>el.scrollLeft>0),'keyboard scroll');
      assert.equal(await page.locator('#example-3 figcaption').count(),3);
      assert.equal(await page.locator('script').count(),1);
    }
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('editor native typing, disabled demo controls, errors and read-only preview',async()=>{
    for(const route of ['/components/editor/','/light/components/editor/']){
      await fresh();await page.setViewportSize({width:375,height:1000});await page.goto(base+route);
      const editor=page.getByRole('textbox',{name:'Draft content',exact:true}).first();
      await editor.focus();await page.keyboard.press('Control+End');await page.keyboard.type(' Native editing works.');
      assert.ok((await editor.textContent()).includes('Native editing works.'));
      assert.equal(await editor.getAttribute('aria-multiline'),'true');
      assert.equal(await editor.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
      for(const button of await page.locator('.sl-editor__tool').all())assert.equal(await button.isDisabled(),true);
      const invalid=page.getByRole('textbox',{name:'Project summary',exact:true});assert.equal(await invalid.getAttribute('aria-invalid'),'true');
      assert.ok((await invalid.getAttribute('aria-describedby')).includes('editor-invalid-error'));
      assert.equal(await page.locator('.sl-editor--readonly [contenteditable]').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
  });
  await check('header logo/menu alignment, centered brand, CTA and top information bar',async()=>{
    for(const route of ['/components/headers/','/light/components/headers/']){
      await fresh();await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1920,height:1000});await page.goto(base+route);
      const box=selector=>page.locator(selector).boundingBox();
      const left=await box('#example-1 .sl-header__brand'),right=await box('#example-1 .sl-header__menu');assert.ok(left.x+left.width<right.x);
      const reversedLogo=await box('#example-2 .sl-header__brand'),reversedMenu=await box('#example-2 .sl-header__menu');assert.ok(reversedMenu.x+reversedMenu.width<reversedLogo.x);
      const row=await box('#example-3 .sl-header__row'),center=await box('#example-3 .sl-header__brand');assert.ok(Math.abs(center.x+center.width/2-row.x-row.width/2)<2);
      assert.equal(await page.locator('#example-4 .sl-header__menu .sl-btn').count(),1);assert.equal(await page.locator('#example-5 .sl-header__top nav a').count(),2);
      for(const width of [320,375,767,991,1023,1200]){
        await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        for(const el of await page.locator('.sl-header').all())assert.equal(await el.evaluate(el=>el.scrollWidth>el.clientWidth),false);
      }
      await page.setViewportSize({width:1920,height:1000});await page.locator('#example-4 .sl-header__menu .sl-btn').focus();assert.equal(await page.locator('#example-4 .sl-header__menu .sl-btn').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
    }
  });
  await check('site-wide cursor, section overrides, reduced motion and touch fallback',async()=>{
    for(const route of ['/components/cursors/','/light/components/cursors/']){
      await fresh();await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+route);
      assert.ok((await page.locator('body').evaluate(el=>getComputedStyle(el).cursor)).includes('data:image/svg+xml'));
      assert.equal(await page.locator('.sl-cursor-precision').evaluate(el=>getComputedStyle(el).cursor),'crosshair');
      assert.equal(await page.locator('.sl-cursor-text').evaluate(el=>getComputedStyle(el).cursor),'text');
      assert.equal(await page.locator('#example-4 input').evaluate(el=>getComputedStyle(el).cursor),'text');
      assert.equal(await page.locator('#example-4 button').evaluate(el=>getComputedStyle(el).cursor),'not-allowed');
      const panel=page.locator('#example-2 .sl-cursor-zone');assert.equal(await panel.evaluate(el=>getComputedStyle(el).animationName),'sl-cursor-breathe');
      await panel.hover();await page.waitForTimeout(350);assert.notEqual(await panel.evaluate(el=>getComputedStyle(el).boxShadow),'none');
      await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await panel.evaluate(el=>getComputedStyle(el).animationName),'none');
    }
    const touch=await browser.newContext({viewport:{width:375,height:900},isMobile:true,hasTouch:true});
    try{const p=await touch.newPage();await p.goto(base+'/components/cursors/');assert.equal(await p.locator('body').evaluate(el=>getComputedStyle(el).cursor),'auto');}finally{await touch.close();}
    await page.emulateMedia({forcedColors:'active'});assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).cursor),'auto');await page.emulateMedia({forcedColors:'none'});
  });
  await check('HTML-only playground, class-based preview, formatting, run, reset, copy and sandbox',async()=>{
    for(const route of ['/components/flex/','/light/components/flex/']){
      await fresh();await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1000});await page.goto(base+route);
      const source=page.locator('.example-source').first();await source.locator('summary').click();
      const html=source.locator('[data-html]');
      assert.equal(await source.locator('[data-css],[data-copy-css]').count(),0,'no CSS editor or controls');await html.waitFor();
      const original=await html.inputValue();const result=source.frameLocator('iframe');
      assert.ok(original.split('\n').length>5,'initial code is formatted');
      await result.locator('.sl-badge').first().waitFor();
      await page.waitForTimeout(300);
      assert.equal(await result.locator('.sl-badge').first().evaluate(el=>getComputedStyle(el).borderTopStyle),'solid','framework CSS loads inside sandbox');
      await html.fill('<section><h2>Formatted</h2><p>Readable code</p></section>');
      await source.locator('[data-format]').click();await page.waitForFunction(()=>document.querySelector('.code-editor[data-ready] [data-status]').textContent.includes('Code formatted'));
      assert.ok((await html.inputValue()).includes('  <h2>Formatted</h2>'));
      await html.fill('<div><span>Unclosed nested markup</div>');const invalid=await html.inputValue();await source.locator('[data-format]').click();
      await page.waitForFunction(()=>document.querySelector('.code-editor[data-ready] [data-status]').textContent.includes('Could not format'));
      assert.equal(await html.inputValue(),invalid,'failed formatting preserves HTML');

      await html.fill('<h2 id="edited" class="sl-text-center">Hello playground</h2>');
      await result.locator('#edited').waitFor();await page.waitForTimeout(600);
      assert.equal(await result.locator('#edited').evaluate(el=>getComputedStyle(el).textAlign),'center','editing classes updates framework styling');
      await source.locator('[data-auto]').uncheck();await html.fill('<p id="manual">Manual update</p>');await page.waitForTimeout(500);assert.equal(await result.locator('#edited').count(),1);
      await html.press('Control+Enter');await result.locator('#manual').waitFor();
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedText=text;}}}));
      await source.locator('[data-copy-html]').click();assert.equal(await page.evaluate(()=>window.__copiedText),await html.inputValue());
      await html.fill('<p id="safe">Sandbox check</p><script>document.body.dataset.executed="yes";<'+ '/script><img src="https://example.invalid/image.png" onerror="document.body.dataset.executed=1">');
      await source.locator('[data-run]').click();await result.locator('#safe').waitFor();
      assert.equal(await source.locator('iframe').getAttribute('sandbox'),'');
      assert.equal(await result.locator('body').getAttribute('data-executed'),null);
      await source.locator('[data-reset]').click();assert.equal(await html.inputValue(),original);
      for(const width of [320,375,768,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'opened playground at '+width);}
      await source.locator('[data-width]').selectOption('375');assert.ok((await source.locator('[data-result]').boundingBox()).width<=375);
      assert.equal(await page.locator('.code-editor[data-ready]').count(),1,'only opened example initializes');
    }
    const noJS=await browser.newContext({javaScriptEnabled:false});try{const p=await noJS.newPage();await p.goto(base+'/components/flex/');await p.locator('.example-source').first().locator('summary').click();assert.equal(await p.locator('.example-source').first().locator('pre code').isVisible(),true);assert.equal(await p.locator('iframe').count(),0);}finally{await noJS.close();}
  });
  await check('subtle field focus, styled selects and reduced-motion transitions',async()=>{
    for(const route of ['/components/forms/','/light/components/forms/']){
      await fresh();await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:375,height:1000});await page.goto(base+route);
      const input=page.locator('#project-name');await input.focus();
      assert.equal(await input.evaluate(el=>getComputedStyle(el).outlineWidth),'1px');assert.equal(await input.evaluate(el=>getComputedStyle(el).outlineOffset),'1px');
      assert.ok((await input.evaluate(el=>getComputedStyle(el).transitionDuration)).includes('0.18s'));
      const select=page.locator('#select-library');await select.selectOption('motion');assert.equal(await select.inputValue(),'motion');
      assert.equal(await page.locator('#select-unavailable').isDisabled(),true);
      await page.locator('#select-modules').selectOption(['motion','tables']);assert.equal(await page.locator('#select-modules option:checked').count(),2);
      await select.click();assert.equal(await select.evaluate(el=>el.matches(':open')),true);await page.keyboard.press('Escape');
      await page.emulateMedia({reducedMotion:'reduce'});assert.ok((await select.evaluate(el=>getComputedStyle(el).transitionDuration)).split(',').every(value=>parseFloat(value)<.001));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await check('responsive header disclosures and standalone component packs without core',async()=>{
    for(const route of ['/components/headers/','/light/components/headers/']){
      await fresh();await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:375,height:1000});await page.goto(base+route);
      for(let i=1;i<=5;i++){
        const block=page.locator('#example-'+i),menu=block.locator('.sl-header__mobile');assert.equal(await menu.isVisible(),true);
        assert.equal(await block.locator('.sl-header__row > .sl-header__menu').first().isVisible(),false);
        await menu.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await menu.evaluate(el=>el.open),true);
        assert.ok(await menu.locator('nav a').first().isVisible());
        assert.equal(await menu.locator('nav a').first().evaluate(el=>getComputedStyle(el).display),'block');
        assert.equal(await block.locator('.sl-header').evaluate(el=>el.scrollWidth>el.clientWidth),false);
        await page.keyboard.press('Enter');assert.equal(await menu.evaluate(el=>el.open),false);
      }
    }
    const standalone=await context.newPage();try{
      await standalone.goto(base+'/components/buttons/');
      await standalone.setContent('<link rel="stylesheet" href="'+base+'/downloads/components/buttons.min.css"><button class="sl-btn sl-btn--outline sl-fx-doors">Standalone</button>');
      await standalone.waitForFunction(()=>getComputedStyle(document.querySelector('.sl-btn')).display==='inline-flex');
      assert.equal(await standalone.locator('.sl-btn').evaluate(el=>getComputedStyle(el).borderTopStyle),'solid');
      assert.equal(await standalone.locator('link').count(),1);
      const manifest=await (await standalone.request.get(base+'/downloads/components/manifest.json')).json();assert.equal(manifest.buttons.requiresCore,false);
      await standalone.setViewportSize({width:375,height:900});
      await standalone.setContent('<link rel="stylesheet" href="'+base+'/downloads/components/headers.min.css"><header class="sl-header"><div class="sl-header__row"><a class="sl-header__brand" href="#">Example logo</a><nav class="sl-header__menu"><a href="#">Desktop</a></nav><details class="sl-header__mobile"><summary>Menu</summary><nav class="sl-header__mobile-nav"><a href="#">Mobile destination</a></nav></details></div></header>');
      await standalone.waitForFunction(()=>getComputedStyle(document.querySelector('.sl-header__mobile')).display==='block');
      await standalone.locator('summary').focus();await standalone.keyboard.press('Enter');assert.equal(await standalone.locator('details').evaluate(el=>el.open),true);
      assert.equal(await standalone.locator('link').count(),1);assert.equal(await standalone.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }finally{await standalone.close();}
  });
  await check('CSS-only tabs become smooth mobile accordions and preserve state without JavaScript',async()=>{
    const native=await browser.newContext({javaScriptEnabled:false,viewport:{width:1920,height:1000},reducedMotion:'no-preference'});
    try{const p=await native.newPage();for(const route of ['/components/tabs/','/light/components/tabs/']){
      await p.setViewportSize({width:1920,height:1000});await p.goto(base+route);
      const group=p.locator('#example-2 .sl-tabs'),items=group.locator('details');
      const labels=group.locator('summary');const first=await labels.nth(0).boundingBox(),second=await labels.nth(1).boundingBox();assert.ok(Math.abs(first.y-second.y)<2,'desktop headings share tab row');
      await labels.nth(1).focus();await p.keyboard.press('Enter');assert.equal(await items.nth(1).evaluate(el=>el.open),true);assert.equal(await items.nth(0).evaluate(el=>el.open),false);
      await p.setViewportSize({width:375,height:1000});assert.equal(await items.nth(1).evaluate(el=>el.open),true,'open state survives resize');
      const mobileFirst=await labels.nth(0).boundingBox(),mobileSecond=await labels.nth(1).boundingBox();assert.ok(mobileSecond.y>mobileFirst.y+20,'mobile headings stack');
      await labels.nth(1).focus();await p.waitForTimeout(450);const heights=[];heights.push((await items.nth(1).boundingBox()).height);await items.nth(1).evaluate(el=>el.open=false);for(let frame=0;frame<20;frame++){await p.waitForTimeout(25);heights.push((await items.nth(1).boundingBox()).height);}
      const lo=Math.min(...heights),hi=Math.max(...heights);assert.ok(hi-lo>20);assert.ok(heights.filter(h=>h>lo+1&&h<hi-1).length>3,'smooth intermediate closing heights: '+JSON.stringify(heights));
      await labels.nth(2).focus();await p.keyboard.press('Space');assert.equal(await items.nth(2).evaluate(el=>el.open),true);
      await p.setViewportSize({width:1920,height:1000});assert.equal(await items.nth(2).evaluate(el=>el.open),true);
      assert.equal(await p.locator('[role="tablist"]').count(),0,'native disclosure semantics');
      for(const width of [320,375,767,991,1023,1200,1920]){await p.setViewportSize({width,height:1000});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
      await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await items.nth(2).evaluate(el=>getComputedStyle(el,'::details-content').transitionDuration),'0s');await p.emulateMedia({reducedMotion:'no-preference'});
      await p.locator('#example-3 details[name="product-tabs"]').nth(1).evaluate(el=>el.open=true);assert.equal(await p.locator('#example-3 details[name="docs-tabs"]').first().evaluate(el=>el.open),true);
      assert.equal(await p.locator('body').evaluate(el=>getComputedStyle(el).fontFamily.includes('Switzer')),true);
      assert.equal(await p.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily.includes('Clash Display')),true);
    }}finally{await native.close();}
  });
  await page.emulateMedia({reducedMotion:'reduce'}); // Static QA screenshots show all revealed content.
  for(const [name,route,width] of [['home-desktop','/',1440],['home-mobile','/',375],['home-light','/light/',1440],['home-light-mobile','/light/',375],['component-cards','/components/cards/',1440],['component-accordion-mobile','/components/accordions/',375],['table-mobile-dark','/components/tables/',375],['table-mobile-light','/light/components/tables/',375]]){
    await page.setViewportSize({width,height:1000});await page.goto(base+route);await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
  }
  const report={date:'2026-10-16',browser:browser.version(),builtPages:pages.length,checks:passed.length,passed};
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
