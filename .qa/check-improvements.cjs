const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const net=require('node:net');
const {spawn}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const source=path.resolve(__dirname,'../Web polinetic');
const runtime=path.join(__dirname,'runtime-'+Date.now());
fs.cpSync(source,runtime,{recursive:true});
const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server.address().port)));
const close=server=>new Promise(resolve=>server.close(resolve));
const messages=[];
let rejectMail=false;
const smtp=net.createServer(socket=>{
 let buffer='',inData=false,body=[],envelope=[];
 socket.setEncoding('utf8');socket.write('220 localhost Polinetic test mail capture\r\n');
 socket.on('data',chunk=>{
  buffer+=chunk;
  while(buffer.includes('\n')){
   const index=buffer.indexOf('\n');const line=buffer.slice(0,index).replace(/\r$/,'');buffer=buffer.slice(index+1);
   if(inData){if(line==='.'){messages.push({body:body.join('\r\n'),envelope});body=[];inData=false;socket.write('250 Captured locally\r\n')}else body.push(line);continue;}
   if(/^QUIT/i.test(line)){socket.end('221 Bye\r\n');}
   else if(/^RCPT TO/i.test(line)&&rejectMail){socket.write('451 Test mail failure\r\n');}
   else if(/^DATA/i.test(line)){inData=true;socket.write('354 End with dot\r\n');}
   else{envelope.push(line);socket.write('250 OK\r\n');}
  }
 });socket.on('error',()=>{});
});
(async()=>{
 const smtpPort=await listen(smtp);const reserve=net.createServer();const port=await listen(reserve);await close(reserve);
 const php=spawn('php',['-n','-d','SMTP=127.0.0.1','-d',`smtp_port=${smtpPort}`,'-d','sendmail_from=servicios@polinetic.es','-S',`127.0.0.1:${port}`,'-t',runtime],{windowsHide:true,stdio:'ignore'});
 const base=`http://127.0.0.1:${port}`;
 let browser;
 try{
  for(let i=0;i<60;i++){try{await fetch(base+'/contact.php');break}catch{await new Promise(r=>setTimeout(r,100))}}
  const input={nombre:'Prueba local',email:'persona@example.com',servicio:'fotovoltaica',mensaje:'Consulta de prueba: instalación en Mallorca.',website:''};
  const post=(body=input,headers={})=>fetch(base+'/contact.php',{method:'POST',headers:{'Content-Type':'application/json','X-Polinetic-Form':'1',Origin:base,...headers},body:JSON.stringify(body)});
  assert.equal((await (await fetch(base+'/contact.php')).json()).enabled,true);
  assert.equal((await fetch(base+'/contact.php',{method:'PUT'})).status,405);
  assert.equal((await post(input,{'X-Polinetic-Form':'0'})).status,403);
  assert.equal((await post(input,{Origin:'https://example.com'})).status,403);
  assert.equal((await post(input,{'Content-Type':'text/plain'})).status,415);
  for(const patch of [{email:'invalid'},{nombre:[]},{nombre:'A\r\nBcc: victim@example.com'},{servicio:'inventado'},{website:'spam'},{mensaje:''},{nombre:'a'.repeat(101)}]) assert.equal((await post({...input,...patch})).status,422);
  assert.equal((await post({...input,mensaje:'x'.repeat(25000)})).status,413);
  assert.equal(messages.length,0);
  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>document.getElementById('submit-label').textContent==='Enviar consulta');
  assert.match(await page.title(),/Mallorca/);assert.equal(await page.locator('h1').count(),1);
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());assert.equal(schema.areaServed.name,'Mallorca');assert.equal(schema.legalName,'Polinetic, S.L.');
  assert.equal(await page.locator('.header-call').getAttribute('href'),'tel:+34655143119');
  for(const id of ['electricidad','fotovoltaica','comunidades','asesoramiento','material']){await page.locator(`[data-service="${id}"]`).click();assert(await page.locator('#service-dialog').evaluate(e=>e.open));await page.keyboard.press('Escape');}
  await page.locator('[data-service="fotovoltaica"]').click();await page.locator('#dialog-contact').click();assert.equal(await page.locator('#service-select').inputValue(),'fotovoltaica');
  await page.locator('[name="nombre"]').fill(input.nombre);await page.locator('[name="email"]').fill(input.email);await page.locator('[name="mensaje"]').fill(input.mensaje);
  rejectMail=true;await page.locator('[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('.form-status.is-error'));
  assert.equal(await page.locator('[name="mensaje"]').inputValue(),input.mensaje);assert.equal(messages.length,0);
  rejectMail=false;await page.locator('[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('.form-status.is-success'));
  assert.equal(messages.length,1);assert.equal(await page.locator('[name="mensaje"]').inputValue(),'');
  assert(messages[0].envelope.some(line=>/RCPT TO:.*servicios@polinetic.es/i.test(line)));
  assert.match(messages[0].body,/Reply-To: persona@example.com/i);
  const emailText=Buffer.from(messages[0].body.split('\r\n\r\n').slice(1).join('\r\n\r\n'),'base64').toString('utf8');assert(emailText.includes(input.mensaje));
  for(let i=0;i<3;i++)assert.equal((await post()).status,200);
  assert.equal((await post()).status,429);assert.equal(messages.length,4);
  for(const width of [320,390,700,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
   const collision=await page.evaluate(()=>{const els=[...document.querySelector('.header-inner').children].filter(e=>getComputedStyle(e).display!=='none'&&e.tagName!=='NAV');return els.some((e,i)=>i&&e.getBoundingClientRect().left<els[i-1].getBoundingClientRect().right)});assert(!collision,`header collision ${width}`);
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('.navigation a[href="#servicios"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===390?844:1000});
   for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(40)}
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(__dirname,`improved-${width}-full.png`),fullPage:true});await page.screenshot({path:path.join(__dirname,`improved-${width}-top.png`)});
   console.log('Layout',width,await page.evaluate(()=>({height:document.body.scrollHeight,contactTop:document.getElementById('contacto').offsetTop})));
  }
  for(const file of ['aviso-legal.html','privacidad.html']){await page.goto(base+'/'+file);assert((await page.locator('main').innerText()).includes('B57287922'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  const offline=await browser.newPage();await offline.goto(pathToFileURL(path.join(source,'index.html')).href);assert.equal(await offline.locator('#submit-label').textContent(),'Preparar email');
  assert.deepEqual(errors,[]);
  const baseline=path.join(__dirname,'proposal-390-full.png');if(fs.existsSync(baseline))console.log('Previous mobile screenshot height',fs.readFileSync(baseline).readUInt32BE(20));
  console.log('PASS: server validation, foreign origin, honeypot, real local SMTP capture, mail failure, rate limit, form recovery, 6 widths, mobile navigation, dialogs, legal pages, local schema and file preview. No external email sent.');
 }finally{if(browser)await browser.close();php.kill();await close(smtp);}
})().catch(e=>{console.error(e);process.exitCode=1});
