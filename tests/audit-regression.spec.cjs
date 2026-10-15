const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let checks=0;
 const ok=(condition,label)=>{assert.ok(condition,label);checks++;console.log('PASS '+label);};
 for(const viewport of [{width:1365,height:850},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errs=[];
  page.on('pageerror',e=>errs.push(e.message));
  await page.goto('http://127.0.0.1:8091/index.html',{waitUntil:'load'});
  await page.waitForTimeout(250);
  ok(await page.locator('[data-tab="compendium"]').count()===1,'Compêndio carregou '+viewport.width);
  await page.locator('[data-field="className"]').selectOption('Bruxo');
  await page.locator('[data-field="level"]').fill('5');
  await page.locator('[data-ability="con"]').fill('14');
  const slots=await page.evaluate(()=>window.DNDDebug.getSlots());
  ok(slots.mode==='pact'&&slots.totals[2]===2,'Bruxo nível 5 tem 2 espaços de pacto de 3º círculo');
  const f=await page.evaluate(()=>{
    const api=window.DNDDebug;
    const s=api.getMutableState();
    s.fields.hitDiceSpent=5;
    s.slotsUsed[2]=2;
    if(s.v5)s.v5.pactUsed=2;
    const before=s.fields.hpCurrent;
    document.getElementById('restDiceCount').value='0';
    document.getElementById('shortRest').click();
    return {slots:s.slotsUsed[2],hd:s.fields.hitDiceSpent,pact:s.v5?.pactUsed||0,before,after:s.fields.hpCurrent,notice:document.getElementById('restResult').textContent};
  });
  ok(f.slots===0&&f.hd===5&&f.pact===0,'Descanso sem Dados de Vida restaura espaços e mantém os dados gastos');
  ok(f.notice.includes('nenhum Dado de Vida gasto'),'Mensagem confirma descanso sem gastar dados');
  const cast=await page.evaluate(()=>{
    const s=window.DNDDebug.getMutableState(),mod=window.DNDV6;
    const eb=mod.SPELLS.find(x=>x.name==='Rajada Mística'),results=[];
    const ordinary=mod.SPELLS.find(x=>x.name==='Raio de Gelo');
    for(const level of [1,5,11,17]){
      s.fields.level=String(level);
      const trials=Array.from({length:8},()=>mod.spellRoll(eb,0,{ac:-50}));
      const each=trials.flatMap(x=>x.details);
      results.push({
        level,
        beams:trials.every(x=>x.details.length===(level>=17?4:level>=11?3:level>=5?2:1)),
        // Cada ataque acertado por Rajada Mística deve rolar só 1d10.
        singleDie:each.filter(x=>x.includes('✓')).every(x=>/✓ \d+=\d+$/.test(x))
      });
    }
    s.fields.level='11';
    const ray=mod.spellRoll(ordinary,0,{ac:-50});
    return {results,rayDetails:ray.details};
  });
  ok(cast.results.every(x=>x.beams&&x.singleDie),'Rajada Mística 1/2/3/4 feixes com um d10 por feixe');
  ok(cast.rayDetails.length===1,'Raio de Gelo permanece um único ataque');
  const mitigation=await page.evaluate(()=>({
    invalid:window.DNDV6.applyDamage(Infinity,'fogo',[]),
    negative:window.DNDV6.applyDamage(-5,'fogo',[]),
    immune:window.DNDV6.applyDamage(100,'fogo',[{type:'fogo',effect:'immune'}]),
    resist:window.DNDV6.applyDamage(9,'fogo',[{type:'fogo',effect:'resist'}])
  }));
  ok(mitigation.invalid===0&&mitigation.negative===0&&mitigation.immune===0&&mitigation.resist===4,'Resistência, imunidade e valores inválidos de dano');
  await page.locator('[data-field="name"]').fill('Personagem Auditoria');
  await page.waitForTimeout(550);
  await page.reload({waitUntil:'load'});
  ok(await page.locator('[data-field="name"]').inputValue()==='Personagem Auditoria','Ficha permanece salva após recarregar');
  const navs=await page.locator('.topnav [data-tab]').evaluateAll(el=>el.map(x=>x.dataset.tab));
  ok(navs.includes('sheet')&&navs.includes('compendium')&&navs.length>=5,'Navegação tem ficha e ferramentas');
  ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+14)),'Página sem overflow horizontal crítico '+viewport.width);
  ok(errs.length===0,'Sem exceções JavaScript no uso básico '+viewport.width+': '+errs.join('; '));
  await context.close();
 }
 const offline=await browser.newContext();
 const page=await offline.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8091/site.html',{waitUntil:'load'});
 ok(await page.locator('[data-tab="compendium"]').count()===1,'Versão HTML standalone carrega compêndio');
 ok(errors.length===0,'HTML standalone sem exceções de inicialização: '+errors.join('; '));
 await offline.close();
 await browser.close();
 console.log('REGRESSÃO: '+checks+' verificações aprovadas.');
})().catch(err=>{console.error('FAIL',err.stack||err);process.exit(1);});