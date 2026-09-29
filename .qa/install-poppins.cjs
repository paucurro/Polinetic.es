const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const source=fs.readFileSync(path.join(__dirname,'poppins-source.css'),'utf8');
 let declarations='/* Poppins, hosted locally. License: assets/fonts/Poppins-OFL.txt. */\n';
 for(const match of source.matchAll(/\/\* (latin(?:-ext)?) \*\/\s*(@font-face\s*\{[^}]+\})/g)){
  const [,subset,rule]=match;
  const weight=rule.match(/font-weight:\s*(\d+)/)[1];
  const style=rule.match(/font-style:\s*(\w+)/)[1];
  const url=rule.match(/url\(([^)]+)\)/)[1];
  const filename=`Poppins-${weight}-${style}-${subset}.woff2`;
  const response=await fetch(url);if(!response.ok)throw Error(`${filename}: ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());if(bytes.toString('ascii',0,4)!=='wOF2')throw Error('Not WOFF2');
  fs.writeFileSync(path.join(root,'assets/fonts',filename),bytes);
  declarations+=rule.replace(url,`assets/fonts/${filename}`)+'\n';
 }
 const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/OFL.txt');if(!license.ok)throw Error('License download failed');
 fs.writeFileSync(path.join(root,'assets/fonts/Poppins-OFL.txt'),await license.text());
 for(const [name,local] of [['BlinkMacSystemFont','BlinkMacSystemFont'],['Segoe UI','Segoe UI'],['Helvetica Neue','Helvetica Neue'],['Arial','Arial'],['Noto Sans','Noto Sans']]){
  declarations+=`@font-face{font-family:"Poppins Fallback: ${name}";src:local("${local}");font-display:swap}\n`;
 }
 const stack=`'Poppins', "Poppins Fallback: BlinkMacSystemFont", "Poppins Fallback: Segoe UI", "Poppins Fallback: Helvetica Neue", "Poppins Fallback: Arial", "Poppins Fallback: Noto Sans", sans-serif`;
 let css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
 css=css.replace(/^@font-face\{[^\n]+\}\r?\n/,declarations);
 css=css.replace('--font:"Manrope","Segoe UI",Arial,sans-serif',`--font:${stack}`);
 css=css.replace('font-family:Georgia,"Times New Roman",serif','font-family:var(--font)');
 for(const [from,to] of [['550','500'],['650','600'],['680','700'],['750','700']])css=css.replaceAll(`font-weight:${from}`,`font-weight:${to}`);
 fs.writeFileSync(path.join(root,'styles.css'),css);
 const preload='<link rel="preload" href="assets/fonts/Poppins-400-normal-latin.woff2" as="font" type="font/woff2" crossorigin>';
 for(const file of ['index.html','aviso-legal.html','privacidad.html']){
  let html=fs.readFileSync(path.join(root,file),'utf8');
  html=file==='index.html'?html.replace('<link rel="preload" href="assets/fonts/Manrope.ttf" as="font" type="font/ttf" crossorigin>',preload):html.replace('<link rel="stylesheet"',preload+'<link rel="stylesheet"');
  fs.writeFileSync(path.join(root,file),html);
 }
 console.log('Installed Poppins: normal 400/500/600/700, italic 400, Latin and Latin Extended, license and requested fallback aliases.');
})().catch(e=>{console.error(e);process.exitCode=1});
