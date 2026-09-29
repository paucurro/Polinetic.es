const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  for(const [name,url] of [['live','https://polinetic.es'],['proposal',pathToFileURL(path.resolve(__dirname,'../Web polinetic/index.html')).href]]) {
   const page=await browser.newPage({viewport:{width:1440,height:1000}});
   await page.goto(url,{waitUntil:'networkidle',timeout:45000});
   await page.evaluate(()=>document.fonts.ready);
   fs.writeFileSync(path.join(__dirname,`${name}-content.html`),await page.content());
   console.log(name,await page.locator('body').innerText());
   console.log('METADATA',JSON.stringify(await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.getAttribute('href')})),forms:[...document.forms].map(f=>({action:f.action,method:f.method})),scripts:[...document.scripts].map(s=>s.src)}))));
   for(const width of [1440,390]) {
    await page.setViewportSize({width,height:width===390?844:1000});
    for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(80);}
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(600);
    await page.screenshot({path:path.join(__dirname,`${name}-${width}-full.png`),fullPage:true});
    await page.screenshot({path:path.join(__dirname,`${name}-${width}-top.png`)});
    console.log(name,width,'overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   }
   await page.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
