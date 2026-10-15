/* Auditoria estática: consistência de módulos, HTML, referências e cache offline. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const modules=['rules2014.js','app.js','v5.js','v6.js','compendium-details.js','phb2014-warlock-spells.js','compendium.js'];
let checked=0;
for(const filename of modules){
 const body=read('src/'+filename);
 assert.doesNotThrow(()=>new vm.Script(body,{filename}),'JS parse: '+filename);checked++;
}
const srcHtml=read('src/index.html'),sw=read('sw.js');
for(const filename of modules){
 assert.match(srcHtml,new RegExp('<script src="'+filename.replace('.','\\.')+'"></script>'),'Módulo presente no HTML modular: '+filename);checked++;
}
assert.doesNotThrow(()=>new vm.Script(sw,{filename:'sw.js'}));checked++;
const assetText=/const ASSETS=(\[[\s\S]*?\]);/.exec(sw);
assert.ok(assetText,'Service worker possui lista de arquivos.');
const assets=JSON.parse(assetText[1]);
assert.ok(assets.length>25,'Precache possui todos os módulos principais');
for(const relative of assets){
 assert.ok(fs.existsSync(path.join(root,relative)),'Recurso do service worker existe: '+relative);checked++;
}
const srcPositions=modules.map(n=>srcHtml.indexOf('src="'+n+'"'));
assert.ok(srcPositions.every((n,i)=>n>0&&(i===0||n>srcPositions[i-1])),'Scripts modulares carregam na ordem correta');checked++;
for(const name of ['index.html','site.html']){
 const html=read(name);
 for(const filename of modules){
   assert.ok(html.includes(read('src/'+filename)),'Módulo sincronizado em '+name+': '+filename);checked++;
 }
 const scriptBlocks=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)];
 assert.ok(scriptBlocks.length>=modules.length,'Scripts embutidos disponíveis: '+name);
 for(const [index,block] of scriptBlocks.entries()){
  assert.doesNotThrow(()=>new vm.Script(block[1],{filename:name+':script#'+index}));checked++;
 }
 assert.match(html,/id="restDiceCount"[^>]+min="0"/,'Descanso sem dados disponível em '+name);checked++;
 assert.match(html,/spell\.cantrip&&spell\.name!=='Rajada Mística'/,'Feixes de Rajada Mística corrigidos em '+name);checked++;
}
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.ok(manifest.name||manifest.short_name,'PWA com nome de aplicativo');checked++;
const repoReport=read('AUDITORIA_SITE_2026-10-15.md');
assert.match(repoReport,/Limitações ainda abertas/,'Registro de limitações presente');checked++;
console.log('AUDITORIA ESTÁTICA: '+checked+' verificações aprovadas em módulos, HTML e offline.');
