/* Development-only JavaScript. Nothing in this file is shipped to the browser site. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const results = [];
async function main() {
  const server = http.createServer((req,res) => {
    const url = new URL(req.url, 'http://localhost');
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err,data) => {
      if (err) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'text/plain');
      res.end(data);
    });
  });
  await new Promise(resolve=>server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({headless:true, ...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:process.platform==='win32'?{channel:'msedge'}:{})});
    const page = await browser.newPage({viewport:{width:1440,height:1050}});
    const errors = [];
    page.on('pageerror', e=>errors.push(e.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    const check = async (name, fn) => { await fn(); results.push(name); console.log('PASS ' + name); };
    await page.goto(base+'/examples/index.html');
    await check('self-contained example loads without scripts or browser errors', async()=>{
      assert.equal(await page.locator('script').count(),0);
      assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily.includes('system-ui')),true);
      assert.deepEqual(errors,[]);
      const sheets=await page.evaluate(()=>[...document.styleSheets].map(s=>s.cssRules.length));
      assert.ok(sheets.every(n=>n>0));
    });
    await check('keyboard skip link and visible focus', async()=>{
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(),'Skip to content');
      assert.equal(await page.locator(':focus').evaluate(el=>getComputedStyle(el).outlineWidth),'3px');
      assert.equal(await page.locator(':focus').evaluate(el=>el.getBoundingClientRect().top>=0),true);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'),'main');
    });
    await check('native disclosure toggles with keyboard', async()=>{
      const summary=page.locator('summary').first();
      await summary.focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('details').first().getAttribute('open'),'');
      await page.keyboard.press('Enter'); assert.equal(await page.locator('details').first().getAttribute('open'),null);
    });
    await check('responsive grid and no document overflow at 320–1440px', async()=>{
      for (const width of [320,375,640,767,768,1024,1440]) {
        await page.setViewportSize({width,height:1050});
        const values=await page.locator('#responsive-grid').evaluate(el=>({cols:getComputedStyle(el).gridTemplateColumns.split(' ').length,overflow:document.documentElement.scrollWidth>innerWidth}));
        assert.equal(values.cols,width>=768?3:1,`${width}px`);
        assert.equal(values.overflow,false,`overflow at ${width}px`);
      }
    });
    await check('explicit light/dark theme scopes override system preference', async()=>{
      for (const colorScheme of ['light','dark']) {
        await page.emulateMedia({colorScheme});
        assert.equal(await page.locator('article[data-theme="light"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
        assert.equal(await page.locator('article[data-theme="dark"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(30, 41, 59)');
        assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(248, 250, 252)');
      }
      await page.locator('html').evaluate(el=>el.removeAttribute('data-theme'));
      assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(15, 23, 42)');
      await page.emulateMedia({colorScheme:'light'});
      assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(248, 250, 252)');
      await page.locator('html').evaluate(el=>el.dataset.theme='light');
    });
    await check('fluid headings scale between viewport limits', async()=>{
      await page.setViewportSize({width:320,height:900});
      const small=await page.locator('h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
      await page.setViewportSize({width:1440,height:1050});
      const large=await page.locator('h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
      assert.ok(large>small && small>=40 && large<=80);
    });
    await check('RTL and doubled root font size do not overflow', async()=>{
      await page.locator('html').evaluate(el=>{el.dir='rtl'; el.style.fontSize='200%';});
      await page.setViewportSize({width:375,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('html').evaluate(el=>{el.dir='ltr'; el.style.fontSize='';});
    });
    await page.setViewportSize({width:1440,height:1050});
    await page.evaluate(()=>{document.activeElement.blur(); window.scrollTo(0,0);});
    await page.screenshot({path:path.join(root,'docs/preview.png'),fullPage:true});
    await page.setViewportSize({width:375,height:900});
    await page.screenshot({path:path.join(root,'docs/preview-mobile.png'),fullPage:true});
    await page.setViewportSize({width:1440,height:1050});
    const core=fs.readFileSync(path.join(root,'dist/styloft.min.css'),'utf8');
    await page.setContent(`<style>${core}</style><main><div id="card" class="sl-card sl-p-0">Card</div><div id="hidden" hidden class="sl-block">Hidden</div><div id="responsive" class="sl-grid sl-cols-1 sl-sm:cols-2 sl-md:cols-3 sl-lg:cols-4"><i>A</i><i>B</i><i>C</i><i>D</i></div><button class="sl-btn" disabled>Disabled</button><div id="motion" style="transition: opacity 2s; animation: example 2s infinite">Motion</div></main>`);
    await check('utilities override components; hidden attribute remains authoritative', async()=>{
      assert.equal(await page.locator('#card').evaluate(el=>getComputedStyle(el).padding),'0px');
      assert.equal(await page.locator('#hidden').evaluate(el=>getComputedStyle(el).display),'none');
      assert.equal(await page.locator('button').isDisabled(),true);
    });
    await check('all breakpoint boundaries apply in cascade order', async()=>{
      for (const [width,cols] of [[639,1],[640,2],[767,2],[768,3],[1023,3],[1024,4]]) {
        await page.setViewportSize({width,height:900});
        assert.equal(await page.locator('#responsive').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),cols);
      }
    });
    await check('nested grids start at one column independently', async()=>{
      await page.locator('#card').evaluate(el=>{el.className='sl-grid sl-cols-3'; el.innerHTML='<div id="nested" class="sl-grid"><b>One</b><b>Two</b></div>';});
      assert.equal(await page.locator('#nested').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
    });
    await check('reduced motion and forced colors retain focus and button boundaries', async()=>{
      await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});
      const motion=await page.locator('#motion').evaluate(el=>({t:getComputedStyle(el).transitionDuration,a:getComputedStyle(el).animationDuration}));
      assert.equal(parseFloat(motion.t),.00001); assert.equal(parseFloat(motion.a),.00001);
      const border=await page.locator('button').evaluate(el=>getComputedStyle(el).borderTopStyle);
      assert.equal(border,'solid');
      await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'none'});
    });
    await check('source and compact builds have equivalent computed layout', async()=>{
      const before=await page.locator('#responsive').evaluate(el=>getComputedStyle(el).gridTemplateColumns);
      await page.locator('style').evaluate((el,text)=>el.textContent=text,fs.readFileSync(path.join(root,'dist/styloft.css'),'utf8'));
      assert.equal(await page.locator('#responsive').evaluate(el=>getComputedStyle(el).gridTemplateColumns),before);
    });
    await page.goto(base+'/examples/starter.html');
    await check('optional prose module and minimal starter render', async()=>{
      assert.equal(await page.locator('.sl-prose').evaluate(el=>getComputedStyle(el).maxInlineSize==='none'),false);
      assert.equal(await page.locator('blockquote').evaluate(el=>getComputedStyle(el).borderInlineStartWidth),'4px');
    });
    const report={browser:browser.version(),engine:'Chromium',checks:results.length,passed:results};
    fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
    fs.writeFileSync(path.join(root,'test-results/browser.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve)); }
}
main().catch(err=>{console.error(err);process.exitCode=1;});
