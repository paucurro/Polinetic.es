const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const http=require('node:http');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 const ids=['electricidad','fotovoltaica','comunidades','asesoramiento','material'];
 for(const id of ids){await page.locator(`[data-service="${id}"]`).click();assert(await page.locator('#service-dialog').evaluate(e=>e.open));assert.equal(await page.locator('#dialog-list li').count(),4);await page.keyboard.press('Escape');assert(!(await page.locator('#service-dialog').evaluate(e=>e.open)));}
 await page.locator('[data-service="fotovoltaica"]').click();await page.locator('#dialog-contact').click();assert.equal(await page.locator('#service-select').inputValue(),'fotovoltaica');
 await page.locator('[name="nombre"]').fill('Prueba Polinetic');await page.locator('[name="email"]').fill('prueba@example.com');await page.locator('[name="mensaje"]').fill('Quiero estudiar una instalación solar en mi vivienda.');
 const downloaded=page.waitForEvent('download');await page.locator('[type="submit"]').click();const download=await downloaded;assert.equal(download.suggestedFilename(),'consulta-polinetic.txt');const downloadPath=await download.path();assert(fs.readFileSync(downloadPath,'utf8').includes('Instalaciones fotovoltaicas'));assert((await page.locator('#form-status').innerText()).includes('No se ha enviado'));
 await page.locator('summary').first().click();assert(await page.locator('details').first().evaluate(e=>e.open));await page.locator('summary').first().click();
 await page.locator('#credits-open').click();assert(await page.locator('#credits-dialog').evaluate(e=>e.open));await page.locator('#credits-dialog .dialog-close').click();
 const missing=await page.evaluate(()=>Array.from(document.querySelectorAll('a[href^="#"]')).map(a=>a.hash).filter(hash=>!document.getElementById(hash.slice(1))));assert.deepEqual(missing,[]);
 for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(200);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Horizontal overflow at ${width}`);
   if(width===390){await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('.navigation a[href="#servicios"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
 }
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(100);}
 await page.waitForTimeout(700);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(150);
 const unloaded=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));assert.deepEqual(unloaded,[]);
 await page.screenshot({path:path.join(__dirname,'desktop.png'),fullPage:true});await page.screenshot({path:path.join(__dirname,'desktop-top.png')});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'mobile.png'),fullPage:true});await page.screenshot({path:path.join(__dirname,'mobile-top.png')});
 const configured=await browser.newPage();await configured.route('**/config.js',route=>route.fulfill({contentType:'text/javascript',body:'window.POLINETIC_CONFIG={email:"test@example.com",phone:"+34 600 000 000",serviceArea:"Zona de prueba"};'}));await configured.goto(url);assert.equal(await configured.locator('#contact-details a').count(),2);assert.equal(await configured.locator('#submit-label').innerText(),'Preparar email');assert((await configured.locator('#form-help').innerText()).includes('aplicación de correo'));
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(url);assert.equal(await reduced.locator('.sun-badge svg').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await reduced.locator('.reveal').first().evaluate(e=>getComputedStyle(e).opacity),'1');
 const offline=await browser.newPage();await offline.goto(pathToFileURL(path.join(root,'index.html')).href);await offline.locator('[data-service="material"]').click();assert(await offline.locator('#service-dialog').evaluate(e=>e.open));
 assert.deepEqual(errors,[]);console.log('PASS: 5 service dialogs, keyboard close, contact selection, real download, FAQ, credits, anchors, 5 responsive widths, mobile menu, all images, contact configuration, reduced motion, direct file opening. No JavaScript errors.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
