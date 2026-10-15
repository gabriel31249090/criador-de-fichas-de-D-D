/* Compêndio integrado — interface autoral. Regras 2014 e origens 2024 identificadas. */
(function () {
  'use strict';
  if (window.DNDCompendium || !window.DNDDebug || !window.DNDV5) return;
  const $ = id => document.getElementById(id);
  const api = window.DNDDebug, v5 = window.DNDV5;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean = value => String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const identifier = () => (window.crypto?.randomUUID?.() || 'lib-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  const cur = () => api.getMutableState();
  const additional = () => { const s=cur();if(!s.compendium||typeof s.compendium!=='object')s.compendium={};return s.compendium; };
  const persist = () => { api.recalc(); render(); };
  const text = (label, value) => '<div class="cx-line"><span>'+esc(label)+'</span><b>'+esc(value)+'</b></div>';
  const species = [
   {name:'Aasimar',speed:9,summary:'Herança celestial, cura, luz e transformação.',traits:['Resistência a dano necrótico e radiante','Visão no escuro: 18 m','Mãos Curativas: cura bônus de proficiência d4, uma vez por descanso longo','Truque Luz: atributo Carisma','Revelação Celestial no nível 3: asas, radiância ou manto necrótico a cada ativação']},
   {name:'Draconato',speed:9,summary:'Herança dracônica e sopro elemental.',traits:['Ancestralidade dracônica e resistência correspondente','Arma de sopro escalonada','Voo dracônico em níveis elevados']},
   {name:'Anão',speed:9,summary:'Resiliência, percepção da pedra e vigor.',traits:['Visão no escuro: 36 m','Resiliência anã','Tenacidade anã: +1 PV máximo por nível','Conhecimento de pedra']},
   {name:'Elfo',speed:9,summary:'Transe, herança élfica e sentidos aguçados.',traits:['Visão no escuro','Transe','Linhagem élfica escolhida manualmente']},
   {name:'Gnomo',speed:9,summary:'Magia e engenhosidade de origem feérica.',traits:['Visão no escuro','Astúcia gnômica','Linhagem de gnomo com traços específicos']},
   {name:'Golias',speed:10.5,summary:'Descendência gigante, força e crescimento.',traits:['Ascendência gigante (escolher benefício)','Grande estatura temporária em níveis elevados']},
   {name:'Halfling',speed:9,summary:'Sorte, coragem e agilidade.',traits:['Sorte halfling','Coragem','Agilidade para atravessar espaços ocupados']},
   {name:'Humano',speed:9,summary:'Adaptabilidade e versatilidade.',traits:['Recurso versátil de origem','Inspiração heroica e proficiência com perícia conforme regras 2024']},
   {name:'Orc',speed:9,summary:'Resistência e ímpeto em combate.',traits:['Visão no escuro: 36 m','Avanço Adrenalínico','Resistência Implacável']},
   {name:'Tiefling',speed:9,summary:'Herança extraplanar e magia inata.',traits:['Visão no escuro','Resistência elemental por legado','Magia de legado extraplanar']}
  ];
  // Dados referenciais do Guia do Mestre 2014, cap. 9; não substituem ficha completa do Manual dos Monstros.
  const crTable = [
   ['0',13,'1–6','+3','0–1',13],
   ['1/8',13,'7–35','+3','2–3',13],
   ['1/4',13,'36–49','+3','4–5',13],
   ['1/2',13,'50–70','+3','6–8',13],
   ['1',13,'71–85','+3','9–14',13],
   ['2',13,'86–100','+3','15–20',13],
   ['3',13,'101–115','+4','21–26',13],
   ['4',14,'116–130','+5','27–32',14],
   ['5',15,'131–145','+6','33–38',15],
   ['6',15,'146–160','+6','39–44',15],
   ['7',15,'161–175','+6','45–50',15],
   ['8',16,'176–190','+7','51–56',16],
   ['9',16,'191–205','+7','57–62',16],
   ['10',17,'206–220','+7','63–68',16]
  ];
  let view='species',query='',spellLevel='all',spellClass='all',gearType='all',editionFilter='2024',showAll=false;
  const styles="\n@media screen {\n #compendium{max-width:1380px;background:#f6f0e5;padding:0;border-radius:16px;overflow:hidden}\n .cx-hero{padding:clamp(22px,4vw,48px);color:#f7e7ca;background:radial-gradient(circle at 84% 12%,#71573c88,transparent 35%),linear-gradient(125deg,#1b242b,#392d29 67%,#634832)}\n .cx-hero h1{font:700 clamp(25px,3.3vw,41px) Georgia,serif;color:#ffe8bd;line-height:1.17;margin:8px 0 12px}\n .cx-hero p{font-size:14px;line-height:1.7;max-width:85ch;color:#e0d2c3}\n .cx-overline{font-size:11px;font-weight:800;letter-spacing:.17em;color:#e2b97b}\n .cx-tabs{display:flex;gap:8px;padding:15px 20px;background:#e8dbc7;flex-wrap:wrap;border-bottom:1px solid #ccb994}\n .cx-tabs button{border-radius:10px;background:#fffaf1;color:#403329;min-height:42px;font-weight:700}\n .cx-tabs button.active{background:#45372d;color:#ffe4b3;border-color:#45372d}\n .cx-content{padding:clamp(12px,2.5vw,28px);display:grid;gap:18px}\n .cx-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start}\n .cx-box{border:1px solid #d3bfa4;border-radius:14px;background:#fffdfa;padding:clamp(16px,2vw,24px);box-shadow:0 8px 23px #503b2b0b}\n .cx-box h2{font:700 22px Georgia,serif;color:#493421;margin:0 0 12px}\n .cx-box h3{font:700 18px Georgia,serif;color:#493421;margin:0 0 13px}\n .cx-box p,.cx-box li{font-size:13px;line-height:1.7;color:#655445}\n .cx-box ul{padding-left:22px}\n .cx-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:16px 0}\n .cx-box label{font-size:12px;line-height:1.4;margin:12px 0}\n .cx-box input,.cx-box select{width:100%;font-size:13px;min-height:40px;border:1px solid #cab99e;border-radius:8px;background:#fff}\n .cx-box button{min-height:38px}\n .cx-box button:not(:disabled):hover{border-color:#ab8353;background:#f1e7d8}\n .cx-muted{font-size:11px!important;color:#8a7865!important;line-height:1.65!important}\n .cx-options{display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:9px;max-height:420px;overflow-y:auto;margin:15px 0}\n .cx-species{text-align:left!important;padding:12px;background:#fffaf2;border:1px solid #cdb99c;display:flex;flex-direction:column;gap:5px}\n .cx-species.selected{background:#eed9b8;border-color:#9d7548;box-shadow:inset 0 0 0 1px #b88f61}\n .cx-species small{font-size:10px;line-height:1.4;font-weight:500;color:#6f5b49}\n .cx-line{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #e5d9c9;font-size:12px}\n .cx-highlight{border:1px solid #e0cbaa;background:#fbf2e6;padding:16px;border-radius:12px;margin:18px 0}\n .cx-highlight button{margin:9px 0}\n .cx-results{display:grid;gap:9px;max-height:610px;overflow:auto}\n .cx-entry{border:1px solid #eadfce;border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fff}\n .cx-entry>div{min-width:0;flex:1}\n .cx-entry b,.cx-entry small{display:block}\n .cx-entry b{color:#3e2d1f;font-size:14px}\n .cx-entry small{margin-top:4px;font-size:11px;color:#81715d}\n .cx-entry p{margin:7px 0;font-size:12px}\n .cx-entry button{flex:0 0 auto;white-space:nowrap;background:#3e443f;color:#fff7e8;border-color:#3e443f}\n .cx-entry button:not(:disabled):hover{background:#665037;color:#fff}\n .cx-chips{display:flex;flex-wrap:wrap;gap:8px;font-size:12px;line-height:1.7}\n .cx-chips>span{display:inline-flex;align-items:center;gap:6px;padding:5px 5px 5px 11px;background:#f4eadc;border:1px solid #dfc9ae;border-radius:999px}\n .cx-chips button{min-height:26px;padding:0 7px;border-radius:50%;background:transparent}\n .cx-output{white-space:pre-line;font:12px/1.7 ui-monospace,monospace;background:#f8f1e5;border:1px solid #dfcfb8;border-radius:10px;padding:14px;margin-top:15px;min-height:55px}\n .cx-notice{padding:0 25px;color:#493321;font-size:12px}\n .cx-notice.cx-visible{padding:13px 25px;background:#e6d3af;border-top:1px solid #cdb387}\n}\n@media(max-width:800px){.cx-layout{grid-template-columns:1fr}.cx-hero{padding:22px}.cx-tabs{padding:10px;gap:7px}.cx-tabs button{flex:1 1 140px}.cx-entry{align-items:flex-start}.cx-entry button{font-size:11px}}\n@media(max-width:480px){.cx-entry{flex-direction:column}.cx-entry button{align-self:stretch}.cx-options{grid-template-columns:repeat(2,minmax(0,1fr))}.cx-content{padding:9px}.cx-box{padding:13px}}\n@media print{#compendium{display:none!important}}\n";
  function selectOptions(opts,value){
    return opts.map(([val,title])=>'<option value="'+esc(val)+'"'+(String(val)===String(value)?' selected':'')+'>'+esc(title)+'</option>').join('');
  }
  function createShell(){
    if($('compendium'))return;
    const css=document.createElement('style');css.id='compendiumStyles';css.textContent=styles+"\n .cx-detailed-entry{align-items:flex-start;gap:14px}\n .cx-entry-main{min-width:0;flex:1}\n .cx-entry-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px}\n .cx-entry-head b{font-size:15px}\n .cx-chip{font-size:10px;font-weight:700;padding:3px 8px;background:#f1e6d1;border:1px solid #ddc7a7;border-radius:999px;color:#695333}\n .cx-statpair{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin-top:10px}\n .cx-statpair strong{display:inline-block;color:#58361f;background:#f9ead6;padding:6px 9px;border-radius:7px;font-size:12px;font-weight:800}\n .cx-statpair span{font-size:11px;color:#6e5a49}\n .cx-effect{line-height:1.7!important;color:#473b2e!important;font-size:13px!important;margin:10px 0!important}\n .cx-details{border-top:1px solid #ece1d2;margin-top:10px;padding-top:9px}\n .cx-details summary{cursor:pointer;color:#70512c;font-weight:700;font-size:12px;padding:5px 0}\n .cx-details>p{font-size:12px}\n .cx-detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin:12px 0}\n .cx-detail-grid>div{border-radius:8px;background:#f8f2e8;border:1px solid #eadbc5;padding:10px}\n .cx-detail-grid small{font-size:10px;color:#786754;display:block}\n .cx-detail-grid b{display:block;font-size:12px;color:#392d24;margin-top:3px}\n .cx-rollbar{display:flex;gap:10px;align-items:end;flex-wrap:wrap;margin:12px 0}\n .cx-rollbar label{flex:1;min-width:135px;max-width:220px;margin:0}\n .cx-roll-output{white-space:pre-wrap;overflow-wrap:anywhere;display:block;margin:10px 0;padding:10px 12px;background:#e6f1e5;color:#27462c;border-radius:8px;font-size:12px;line-height:1.6}\n .cx-roll-output:empty{display:none}\n .cx-inline-check{display:flex;align-items:center;gap:7px}\n .cx-inline-check input{width:auto;min-height:0}\n";document.head.appendChild(css);
    const tab=document.createElement('button');tab.type='button';tab.className='tab';tab.dataset.tab='compendium';tab.textContent='✦ Biblioteca & Mestre';tab.setAttribute('aria-label','Abrir biblioteca de D&D e ferramentas do Mestre');
    document.querySelector('.topnav').appendChild(tab);
    const raceSelect=$('race');
    if(raceSelect){
      species.forEach(entry=>{
        if(![...raceSelect.options].some(option=>option.value===entry.name)){
          const opt=document.createElement('option');opt.value=entry.name;opt.textContent=entry.name+' (2024)';raceSelect.appendChild(opt);
        }
      });
      raceSelect.addEventListener('change',()=>{
        const name=raceSelect.value;
        if(['Aasimar','Golias','Orc'].includes(name)||cur().fields.rulesEdition==='2024'){
          if(species.some(entry=>entry.name===name))applySpecies(name);
        }
      });
    }
    const page=document.createElement('section');page.id='compendium';page.className='sheet-page cx-page';page.setAttribute('aria-label','Compêndio e ferramentas do mestre');page.innerHTML='<div class="cx-hero"><span class="cx-overline">COMPÊNDIO DE AVENTURAS</span><h1>Biblioteca de personagem e Mestre</h1><p>Escolha origens, truques, magias e equipamento diretamente na ficha. Ferramentas do Guia do Mestre 2014 e espécies 2024 são separadas por edição.</p></div><div class="cx-tabs" role="tablist" aria-label="Seções do compêndio"><button type="button" data-cx-tab="species">✧ Espécies 2024</button><button type="button" data-cx-tab="spells">✦ Truques e magias</button><button type="button" data-cx-tab="gear">⚔ Armas e itens</button><button type="button" data-cx-tab="dm">♜ Guia do Mestre</button></div><div id="cxContent" class="cx-content"></div><div id="cxNotice" class="cx-notice" role="status" aria-live="polite"></div>';
    document.querySelector('main').appendChild(page);
    tab.addEventListener('click',()=>{document.querySelectorAll('.sheet-page').forEach(x=>x.classList.toggle('active',x.id==='compendium'));document.querySelectorAll('.topnav .tab').forEach(x=>x.classList.toggle('active',x===tab));render();window.scrollTo({top:0,behavior:'instant'});});
    page.addEventListener('click',handleClick);
    page.addEventListener('input',handleInput);
    page.addEventListener('change',handleChange);
    $('characterSelect')?.addEventListener('change',()=>setTimeout(render,0));
    $('btnImport')?.addEventListener('click',()=>setTimeout(render,200));
    document.addEventListener('click',e=>{if(e.target?.id==='longRest'){const s=cur();if(s.fields.rulesEdition==='2024'&&s.fields.race==='Aasimar'&&s.compendium){s.compendium.aasimarHealingUsed=false;s.compendium.revelationUsed=false;api.recalc();if(view==='species')render();}}});
    render();
  }
  function status(msg){const el=$('cxNotice');if(!el)return;el.textContent=msg;el.classList.add('cx-visible');}
  function render(){
    if(!$('cxContent'))return;
    document.querySelectorAll('[data-cx-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.cxTab===view);b.setAttribute('aria-selected',b.dataset.cxTab===view?'true':'false');});
    $('cxContent').innerHTML=({species:speciesPanel,spells:spellPanel,gear:gearPanel,dm:dmPanel}[view])();
  }
  function speciesPanel(){
    const s=cur(),f=s.fields,chosen=f.rulesEdition==='2024'?f.race:'',c=additional(),active=species.find(x=>x.name===chosen);
    const fields=[['str','Força'],['dex','Destreza'],['con','Constituição'],['int','Inteligência'],['wis','Sabedoria'],['cha','Carisma']];
    const opt=(v)=>selectOptions([['','Não selecionado'],...fields],v||'');
    let ancestryNote=f.rulesEdition==='2024'?'O aumento de atributos da edição 2024 vem do antecedente, não da espécie.':'A ficha usa atualmente as opções raciais de 2014.';
    const is24=f.rulesEdition==='2024';
    return '<div class="cx-layout"><div class="cx-box"><h2>Origens e espécies</h2><p>'+esc(ancestryNote)+'</p><label>Modo de origem<select id="cxEdition">'+selectOptions([['2024','Espécies 2024 (5.5)'],['2014','Raças 2014']],f.rulesEdition||'2014')+'</select></label><label>Pesquisar espécie<input id="cxSearch" placeholder="Aasimar, orc, elfo..." value="'+esc(query)+'"></label><div class="cx-options">'+species.filter(x=>clean(x.name+' '+x.summary).includes(clean(query))).map(x=>'<button class="cx-species'+(chosen===x.name&&is24?' selected':'')+'" type="button" data-cx-species="'+esc(x.name)+'"><b>'+esc(x.name)+'</b><small>'+esc(x.summary)+'</small></button>').join('')+'</div><p class="cx-muted">2014 mantém as opções do seletor original da ficha. Ao retornar à edição 2014, escolha novamente sua raça na ficha se necessário.</p></div><div class="cx-box"><h2>'+(active&&is24?esc(active.name)+' • 2024':'Características da origem')+'</h2>'+(active&&is24?'<p>'+esc(active.summary)+'</p><ul>'+active.traits.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+text('Deslocamento',active.speed+' m')+(active.name==='Aasimar'?'<div class="cx-highlight"><h3>Recursos do Aasimar</h3>'+text('Mãos Curativas',Math.max(2,2+Math.floor((Math.max(1,Number(f.level)||1)-1)/4))+'d4 de cura')+'<button data-cx-action="heal" '+(c.aasimarHealingUsed?'disabled':'')+'>'+(c.aasimarHealingUsed?'Mãos Curativas usadas':'Rolar Mãos Curativas (em mim)')+'</button><p class="cx-muted">Consome 1 uso por descanso longo. O truque Luz é registrado na ficha.</p><label>Revelação Celestial (nível 3)<select id="cxRevelation">'+selectOptions([['','Escolha ao ativar'],['Asas Celestiais','Asas Celestiais'],['Radiância Interior','Radiância Interior'],['Manto Necrótico','Manto Necrótico']],c.revelation||'')+'</select></label><button data-cx-action="revelation" '+((Number(f.level)||0)<3||c.revelationUsed?'disabled':'')+'>'+(c.revelationUsed?'Revelação usada':'Ativar revelação')+'</button></div>':''):'<p>Selecione uma espécie 2024 para consultar e aplicar os traços. Os benefícios de linhagem específicos que ainda dependem de escolhas aparecem como orientação ao jogador.</p>')+'</div></div><div class="cx-box"><h2>Aumentos de atributos pelo antecedente (2024)</h2><p>Escolha +2 em um atributo e +1 em outro, ou +1 em três atributos distintos. Confira os três atributos permitidos pelo antecedente escolhido no Livro do Jogador 2024; esta interface não valida essas restrições.</p><div class="cx-grid"><label>Distribuição<select id="cxBgMode">'+selectOptions([['2+1','+2 / +1'],['1+1+1','+1 / +1 / +1']],f.bg2024Mode||'2+1')+'</select></label><label>1º atributo<select id="cxBgA">'+opt(f.bg2024A)+'</select></label><label>2º atributo<select id="cxBgB">'+opt(f.bg2024B)+'</select></label>'+(f.bg2024Mode==='1+1+1'?'<label>3º atributo<select id="cxBgC">'+opt(f.bg2024C)+'</select></label>':'')+'</div><p class="cx-muted">Somente ativo no modo 2024. O PV e as demais estatísticas se recalculam após a escolha de Constituição.</p></div>';
  }
  function spellPanel(){
    const s=cur(),v=v5.addState(s),selected=v.selectedSpells,spells=v5.SPELLS,meta=window.DNDSpellDetails,phb=window.DNDPHB2014;
    const level=Math.max(1,Math.min(20,Number(s.fields.level)||1)),patron=v.subclasses.Bruxo||'';
    const matches=spells.filter(sp=>{
      const info=meta?.get(sp[0]);
      const classAllowed=spellClass==='all'||sp[3].split(',').includes(spellClass)||
        (spellClass==='Bruxo'&&phb?.forPatron(sp[0],patron));
      return (spellLevel==='all'||String(sp[1])===spellLevel)
        &&classAllowed
        &&clean([sp[0],sp[2],info?.effect||'',info?.damage||''].join(' ')).includes(clean(query));
    });
    const entries=matches.slice(0,showAll?matches.length:60).map(sp=>{
      const item=meta?.get(sp[0])||{effect:sp[7],damage:'Não informado',range:'Não informado',save:'—',scaling:'',time:'Consulte o livro',duration:'Consulte o livro'};
      const expanded=!!(spellClass==='Bruxo'&&phb?.isExpanded(sp[0],patron));
      const arcanum=spellClass==='Bruxo'&&sp[1]>=6&&phb?.forPatron(sp[0],patron);
      const arcanumLvl=arcanum?phb.requiredWarlockLevel(sp[1]):null;
      const calc=meta?.formulaFor(sp[0],level,sp[1]);
      const canRoll=!!calc;
      const slotHtml=sp[1]>0&&!arcanum?'<label>Espaço para prévia<select data-cx-slot="'+esc(sp[0])+'">'+
       Array.from({length:10-sp[1]},(_,i)=>'<option value="'+(sp[1]+i)+'">'+(sp[1]+i)+'º nível</option>').join('')+'</select></label>':'';
      return '<article class="cx-entry cx-detailed-entry" data-cx-spell-card="'+esc(sp[0])+'"><div class="cx-entry-main"><div class="cx-entry-head"><b>'+esc(sp[0])+'</b><span class="cx-chip">'+(sp[1]===0?'Truque':'Nível '+sp[1])+' · 2014</span>'+(expanded?'<span class="cx-chip">Patrono: '+esc(patron)+'</span>':'')+(arcanum?'<span class="cx-chip">Arcano Místico · Bruxo '+arcanumLvl+'+</span>':'')+'</div><small>'+esc(sp[2])+' · '+esc(sp[3])+(sp[4]?' · Concentração':'')+(sp[5]?' · Ritual':'')+'</small>'+
       '<div class="cx-statpair"><strong>⚔ '+esc(item.damage)+'</strong><span>'+esc(item.save==='—'?'Sem ataque ou resistência':item.save)+'</span></div>'+
       '<p class="cx-effect">'+esc(item.effect)+'</p>'+
       (arcanum?'<p class="cx-muted">Esta magia é um Arcano Místico. Não utiliza espaços normais de Magia de Pacto; normalmente possui um uso por descanso longo.</p>':'')+
       '<details class="cx-details"><summary>Alcance, duração, escalonamento e dados</summary><div class="cx-detail-grid"><div><small>Alcance</small><b>'+esc(item.range)+'</b></div><div><small>Conjuração</small><b>'+esc(item.time)+'</b></div><div><small>Duração</small><b>'+esc(item.duration)+'</b></div><div><small>Componentes</small><b>'+esc(sp[6])+'</b></div></div>'+
       '<p><b>Evolução:</b> '+esc(item.scaling||'Sem aumento de dano por nível.')+'</p>'+
       (canRoll?'<div class="cx-rollbar">'+slotHtml+'<button type="button" data-cx-roll-spell="'+esc(sp[0])+'">🎲 Rolar '+(calc.kind==='cura'?'cura':calc.kind==='pool'?'efeito':'dano')+'</button></div><small>Fórmula de prévia: '+esc(calc.label)+'. Não consome espaços de magia nem aplica dano automaticamente.</small><output class="cx-roll-output" aria-live="polite" data-cx-result-spell="'+esc(sp[0])+'"></output>':'<p class="cx-muted">Esta magia não tem rolagem direta de dano ou cura no catálogo. O Mestre resolve os efeitos especiais.</p>')+
       '</details></div><button type="button" data-cx-spell="'+esc(sp[0])+'" '+(selected.includes(sp[0])||(arcanum&&level<arcanumLvl)?'disabled':'')+'>'+(selected.includes(sp[0])?'Adicionada ✓':arcanum&&level<arcanumLvl?'Requer Bruxo '+arcanumLvl:'+ Selecionar')+'</button></article>';
    }).join('');
    return '<div class="cx-box"><h2>Truques e magias • efeitos completos</h2><p>Resumo mecânico original das magias disponíveis neste catálogo. Dados e testes seguem 5e 2014 (SRD 5.1); escolha 2024 requer conferir alterações do Livro do Jogador 2024.</p>'+
      '<div class="cx-grid"><label>Pesquisar pelo nome ou efeito<input id="cxSearch" value="'+esc(query)+'" placeholder="Raio, fogo, cura, invisibilidade..."></label><label>Nível<select id="cxSpellLevel">'+selectOptions([['all','Todos'],['0','Truques'],...Array.from({length:9},(_,i)=>[String(i+1),'Nível '+(i+1)])],spellLevel)+'</select></label><label>Classe<select id="cxSpellClass">'+selectOptions([['all','Todas as classes'],...['Bardo','Bruxo','Clérigo','Druida','Feiticeiro','Mago','Paladino','Patrulheiro'].map(x=>[x,x])],spellClass)+'</select></label>'+
      (spellClass==='Bruxo'?'<label>Patrono do Bruxo (2014)<select id="cxPatron">'+selectOptions([['','Apenas lista básica'],...phb.patrons().map(x=>[x,x])],patron)+'</select></label>':'')+'</div>'+
      (spellClass==='Bruxo'?'<p class="cx-muted">Magias do patrono são opções adicionais para aprender, não magias concedidas automaticamente. Escolha sua subclasse para ver o catálogo expandido. Arcanos Místicos (6º–9º) não usam espaços de Magia de Pacto.</p>':'')+
      '<p class="cx-muted">'+matches.length+' magias encontradas · '+selected.length+' selecionadas · Nível do personagem: '+level+'</p>'+
      '<div class="cx-results">'+(entries||'<p>Nenhuma magia encontrada. Tente outro filtro.</p>')+'</div>'+(matches.length>60&&!showAll?'<button type="button" data-cx-action="all">Mostrar todas</button>':'')+
      '</div><div class="cx-box"><h2>Magias da ficha</h2><div class="cx-chips">'+(selected.length?selected.map(x=>'<span>'+esc(x)+' <button type="button" data-cx-remove-spell="'+esc(x)+'" aria-label="Remover '+esc(x)+'">×</button></span>').join(''):'Nenhuma magia selecionada.')+'</div></div>';
  }
  function gearPanel(){
    const s=cur(),c=additional(),items=v5.GEAR,meta=window.DNDSpellDetails;
    const matches=items.filter(x=>(gearType==='all'||x[1]===gearType)&&clean(x[0]+' '+x[1]+' '+(meta?.gearDetail(x).effect||'')).includes(clean(query)));
    const contents=matches.map(x=>{
      const info=meta?.gearDetail(x)||{damage:x[3]||'Não causa dano',range:'—',effect:'Consulte as propriedades da arma ou equipamento.',weight:x[2],price:x[6]};
      const roll=x[1]==='arma'||x[0]==='Poção de cura';
      return '<article class="cx-entry cx-detailed-entry" data-cx-gear-card="'+esc(x[0])+'"><div class="cx-entry-main"><div class="cx-entry-head"><b>'+esc(x[0])+'</b><span class="cx-chip">'+esc(x[1])+' · 2014</span></div><small>'+esc(info.weight)+' kg · '+(Number(info.price)||0).toLocaleString('pt-BR')+' PO</small><div class="cx-statpair"><strong>'+esc(info.damage)+'</strong><span>'+esc(info.range||'—')+'</span></div><p class="cx-effect">'+esc(info.effect)+'</p>'+
       '<details class="cx-details"><summary>Detalhes'+(roll?' e rolagem de exemplo':' do item')+'</summary><p>Este item é registrado no inventário com a quantidade selecionada. '+(x[1]==='arma'?'O ataque aparece na ficha, com modificador e proficiência conforme as escolhas do personagem.':x[1]==='armadura'?'A CA é recalculada quando a armadura é equipada.':'Confira peso, custo e utilização na aventura.')+'</p>'+
       (roll?(x[1]==='arma'?'<label class="cx-inline-check"><input type="checkbox" data-cx-proficient checked> Incluir bônus de proficiência na rolagem</label>':'')+
       '<button type="button" data-cx-roll-gear="'+esc(x[0])+'">🎲 '+(x[1]==='arma'?'Rolar ataque e dano':'Rolar cura')+'</button><output class="cx-roll-output" aria-live="polite" data-cx-result-gear="'+esc(x[0])+'"></output>':'')+
       '</details></div><button type="button" data-cx-gear="'+esc(x[0])+'">+ Adicionar</button></article>';
    }).join('');
    return '<div class="cx-box"><h2>Armas, armaduras e equipamentos • efeitos</h2><p>Veja dados de dano, propriedades, alcance, Classe de Armadura, preço e peso. Exemplos de rolagem não aplicam dano a nenhuma criatura automaticamente.</p><div class="cx-grid"><label>Pesquisar<input id="cxSearch" value="'+esc(query)+'" placeholder="Espada, arco, escudo..."></label><label>Categoria<select id="cxGearType">'+selectOptions([['all','Todas'],['arma','Armas'],['armadura','Armaduras'],['escudo','Escudos'],['item','Equipamentos']],gearType)+'</select></label><label>Quantidade<input id="cxQuantity" type="number" min="1" max="99" value="'+(c.quantity||1)+'"></label></div><div class="cx-results">'+(contents||'<p>Nenhum equipamento encontrado.</p>')+'</div></div><div class="cx-box"><h2>Adicionados à ficha</h2><div class="cx-chips">'+((c.gear||[]).length?(c.gear||[]).map(x=>'<span>'+esc(x.name)+' (×'+esc(x.qty)+') <button data-cx-remove-gear="'+esc(x.id)+'" aria-label="Retirar item">×</button></span>').join(''):'Nenhum item adicionado por aqui.')+'</div></div>';
  }
  function previewSpell(name,button){
    const module=window.DNDSpellDetails,sp=v5.SPELLS.find(x=>x[0]===name),s=cur();if(!sp||!module)return;
    const card=button.closest('[data-cx-spell-card]'),output=card?.querySelector('[data-cx-result-spell]');
    const requested=Number(card?.querySelector('[data-cx-slot]')?.value??sp[1]),lv=Math.max(1,Math.min(20,Number(s.fields.level)||1));
    const ability=s.fields.castAbility||({Mago:'int',Feiticeiro:'cha',Bruxo:'cha',Bardo:'cha',Clérigo:'wis',Druida:'wis',Patrulheiro:'wis',Paladino:'cha'}[s.fields.className]);
    const mod=ability?window.DNDV6?.modifier?.(ability):null;
    const formula=module.formulaFor(name,lv,requested);if(!formula||!output)return;
    const result=module.rollSpell(name,lv,requested,mod??0);if(!result)return;
    const each=result.results.map((x,i)=>(result.results.length>1?'#'+(i+1)+' ':'')+'['+x.dice.join('+')+']'+(formula.addMod?' + '+(mod??0):formula.bonus?String(formula.bonus):'')+' = '+x.total).join(' | ');
    output.textContent=(result.kind==='cura'?'Cura':result.kind==='pool'?'Total do efeito':'Dano')+' • '+result.formula+' → '+each+(result.results.length>1?' • Total: '+result.total:'')+
      (formula.addMod&&mod===null?' • ATENÇÃO: preencha o atributo de conjuração; modificador assumido 0 nesta prévia.':'')+
      (name==='Rajada Mística'||name==='Raio Ardente'?' • Cada raio exige jogada de ataque própria; resultados são hipóteses de acerto.':'')+
      (name==='Mísseis Mágicos'?' • Verifique Escudo Arcano; dardos são distribuídos pelo conjurador.':'');
  }
  function previewGear(name,button){
    const module=window.DNDSpellDetails,g=v5.GEAR.find(x=>x[0]===name),output=button.closest('[data-cx-gear-card]')?.querySelector('[data-cx-result-gear]');if(!module||!g||!output)return;
    if(g[1]!=='arma'){
      const healed=module.roll('2d4+2');output.textContent='Poção de cura: ['+healed.dice.join('+')+'] +2 = '+healed.total+' PV recuperáveis. Não alterou a ficha.';return;
    }
    const stat=g[4]||'str',m=window.DNDV6?.modifier?.(stat),charLevel=Number(cur().fields.level)||0;
    const prof=charLevel>=1?2+Math.floor((charLevel-1)/4):0;
    const proficient=button.closest('[data-cx-gear-card]')?.querySelector('[data-cx-proficient]')?.checked!==false;
    const hit=module.roll('1d20'),natural=hit.dice[0],totalHit=natural+(m??0)+(proficient?prof:0);
    const dmg=module.roll(g[3]||'1d4',m??0,natural===20);
    output.textContent='Ataque: d20 ['+natural+'] '+(m===null?'(atributo não preenchido, +0 provisório)':'mod. '+(m>=0?'+':'')+m)+(proficient?' + prof. '+prof:'')+' = '+totalHit+(natural===20?' (crítico: dados de dano dobrados)':natural===1?' (erro natural)':'')+
      ' | Dano se acertar: '+dmg.dice.join('+')+' + modificador '+(m??0)+' = '+dmg.total+' '+g[5]+'. Não foi aplicado a nenhum alvo.';
  }
  function dmPanel(){
    const c=additional(),nd=c.cr||'1',record=crTable.find(x=>x[0]===nd)||crTable[4];
    return '<div class="cx-box"><h2>Guia do Mestre • 5e 2014</h2><p>Referência prática baseada em criação de encontros (cap. 3), armadilhas (cap. 5), tesouros (cap. 7) e criação de monstros (cap. 9). Resultados orientativos; o Mestre decide os efeitos finais.</p></div><div class="cx-layout"><div class="cx-box"><h3>Encontros por XP</h3><div class="cx-grid"><label>Níveis dos heróis (separados por vírgula)<input id="cxParty" value="'+esc(c.party||'3,3,3,3')+'"></label><label>XP individual do monstro<input type="number" min="0" id="cxXP" value="'+esc(c.xp||200)+'"></label><label>Quantidade de monstros<input type="number" min="1" id="cxCount" value="'+esc(c.count||2)+'"></label></div><button data-cx-action="encounter">Calcular dificuldade</button><div class="cx-output" id="cxEncounterOut">'+esc(c.encounterText||'Preencha os dados e calcule.')+'</div></div><div class="cx-box"><h3>Criador rápido de monstros</h3><label>Nível de Desafio (ND)<select id="cxCR">'+selectOptions(crTable.map(x=>[x[0],x[0]]),nd)+'</select></label>'+text('CA sugerida',record[1])+text('PV de referência',record[2])+text('Ataque',record[3])+text('Dano por rodada',record[4])+text('CD de resistência',record[5])+'<p class="cx-muted">Tabela para criação rápida no DMG 2014, ND 0–10. Não substitui traços, resistências, ações e matemática final do monstro.</p></div></div><div class="cx-layout"><div class="cx-box"><h3>Armadilhas e obstáculos</h3><label>Faixa de nível<select id="cxTrapTier">'+selectOptions([['1','Níveis 1–4'],['2','Níveis 5–10'],['3','Níveis 11–16'],['4','Níveis 17–20']],c.trapTier||'1')+'</select></label><button data-cx-action="trap">Gerar ideia de armadilha</button><div class="cx-output">'+esc(c.trapText||'Uma ideia adaptável ao cenário, com valores indicativos.')+'</div></div><div class="cx-box"><h3>Tesouros de aventura</h3><label>Escala<select id="cxLootTier">'+selectOptions([['1','Baixo nível'],['2','Intermediário'],['3','Alto nível'],['4','Épico']],c.lootTier||'1')+'</select></label><button data-cx-action="loot">Gerar recompensa</button><div class="cx-output">'+esc(c.lootText||'Recompensas narrativas originais, não as tabelas de tesouro do livro.')+'</div></div></div>';
  }
  function applySpecies(name){
    const entry=species.find(x=>x.name===name);if(!entry)return;const s=cur(),f=s.fields,c=additional();
    if(!('previousLegacyRace' in c)&&f.rulesEdition!=='2024')c.previousLegacyRace=f.race||'';
    f.rulesEdition='2024';f.raceAuto=false;f.subrace='';api.setField('race',entry.name);
    f.speed=entry.speed;c.revelation='';c.aasimarHealingUsed=false;c.revelationUsed=false;
    if(entry.name==='Aasimar'&&window.DNDV5){
      const v=v5.addState(s);if(!v.selectedSpells.includes('Luz'))v.selectedSpells.push('Luz');
      const names=String(s.spells[0]||'').split(/\r?\n/).map(x=>x.trim());if(!names.includes('Luz'))s.spells[0]=(s.spells[0]?String(s.spells[0]).trimEnd()+'\n':'')+'Luz';
    }
    persist();status(entry.name+' 2024 selecionado. Bônus de antecedente e traços podem exigir escolhas.');
  }
  function setEdition(value){
    const s=cur(),f=s.fields,c=additional();
    if(value==='2014'){
      f.rulesEdition='2014';f.raceAuto=c.previousRaceAuto!==false;
      const race=c.previousLegacyRace||'Humano';api.setField('race',race);c.previousLegacyRace='';
      persist();return;
    }
    if(f.rulesEdition!=='2024'){
      c.previousLegacyRace=f.race||'';
      c.previousRaceAuto=f.raceAuto!==false;
    }
    f.rulesEdition='2024';f.raceAuto=false;
    const match=species.find(x=>x.name===f.race);
    if(!match){applySpecies('Aasimar');return;}
    f.speed=match.speed;
    persist();
  }
  function pickSpell(name){
    const s=cur(),sp=v5.SPELLS.find(x=>x[0]===name);if(!sp)return;
    const v=v5.addState(s),patron=v.subclasses.Bruxo||'',phb=window.DNDPHB2014;
    if(spellClass==='Bruxo'&&phb&&!phb.forPatron(name,patron)){status('Esta magia não está na lista básica do Bruxo nem no patrono selecionado.');return;}
    if(spellClass==='Bruxo'&&phb&&sp[1]>=6&&Number(s.fields.level)<phb.requiredWarlockLevel(sp[1])){status('Arcano Místico requer Bruxo de nível '+phb.requiredWarlockLevel(sp[1])+'.');return;}
    if(v.selectedSpells.includes(name))return;
    v.selectedSpells.push(name);
    const old=String(s.spells[sp[1]]||'');
    if(!old.split(/\r?\n/).map(x=>x.trim()).includes(name))s.spells[sp[1]]=(old?old.trimEnd()+'\n':'')+name;
    persist();status(name+' registrada na ficha de magias ('+(sp[1]===0?'truque':'nível '+sp[1])+').');
  }
  function removeSpell(name){
    const s=cur(),v=v5.addState(s);v.selectedSpells=v.selectedSpells.filter(x=>x!==name);
    for(let i=0;i<=9;i++)s.spells[i]=String(s.spells[i]||'').split(/\r?\n/).filter(x=>x.trim()!==name).join('\n');
    persist();
  }
  function addGear(name){
    const g=v5.GEAR.find(x=>x[0]===name);if(!g)return;const s=cur(),c=additional(),q=Math.max(1,Math.min(99,Math.floor(Number(c.quantity)||1))),id=identifier();
    const row={id,name,qty:q,weight:Number(g[2])||0};s.items.push(row);
    const entry={id,name,qty:q,attackId:null};
    if(g[1]==='arma'){const attack={id:identifier(),name,type:g[4]||'str',damage:g[3]||'1d4',prof:true};s.attacks.push(attack);entry.attackId=attack.id;}
    if(g[1]==='armadura')api.setField('armor',name);
    if(g[1]==='escudo')api.setField('shield',true);
    c.gear=Array.isArray(c.gear)?c.gear:[];c.gear.push(entry);
    v5.addState(s).gearChoices.push({name,qty:q});persist();status(name+' foi adicionado ao inventário'+(g[1]==='arma'?' e aos ataques':'')+'.');
  }
  function removeGear(id){
    const s=cur(),c=additional(),item=(c.gear||[]).find(x=>x.id===id);if(!item)return;
    s.items=s.items.filter(x=>x.id!==id);if(item.attackId)s.attacks=s.attacks.filter(x=>x.id!==item.attackId);
    c.gear=c.gear.filter(x=>x.id!==id);
    const v=v5.addState(s);const pos=v.gearChoices.findIndex(x=>x.name===item.name&&x.qty===item.qty);if(pos>=0)v.gearChoices.splice(pos,1);
    const g=v5.GEAR.find(x=>x[0]===item.name);if(g?.[1]==='escudo'&&!s.items.some(x=>v5.GEAR.find(z=>z[0]===x.name)?.[1]==='escudo'))s.fields.shield=false;
    if(g?.[1]==='armadura'&&s.fields.armor===item.name)s.fields.armor='Sem armadura';
    persist();
  }
  function rollDie(d){const array=new Uint32Array(1);if(window.crypto?.getRandomValues){window.crypto.getRandomValues(array);return 1+array[0]%d;}return 1+Math.floor(Math.random()*d);}
  function action(kind){
    const s=cur(),c=additional(),level=Number(s.fields.level)||0;
    if(kind==='all'){showAll=true;render();return;}
    if(kind==='heal'){
      if(s.fields.race!=='Aasimar'||s.fields.rulesEdition!=='2024'||c.aasimarHealingUsed)return;
      const pb=2+Math.floor((Math.max(1,level)-1)/4);let amount=0;for(let k=0;k<pb;k++)amount+=rollDie(4);
      const max=api.getHP()?.total;const before=Number(s.fields.hpCurrent);
      if(Number.isFinite(before)&&Number.isFinite(max)){
        s.fields.hpCurrent=Math.min(max,Math.max(0,before+amount));
        if(s.fields.hpCurrent>0){s.deathSuccess=0;s.deathFailure=0;}
      }
      c.aasimarHealingUsed=true;persist();status('Mãos Curativas: '+pb+'d4 recuperou '+amount+' PV. Seu PV atual foi atualizado, quando disponível.');return;
    }
    if(kind==='revelation'){
      if(level<3||c.revelationUsed||!c.revelation)return status('Escolha uma revelação e tenha pelo menos nível 3.');
      c.revelationUsed=true;persist();status(c.revelation+' ativada por 1 minuto; dano extra uma vez por turno igual ao bônus de proficiência.');return;
    }
    if(kind==='encounter'){
      const party=String(c.party??'3,3,3,3');
      const rawLevels=party.split(',').map(x=>x.trim());
      const levels=rawLevels.map(x=>Number(x)).filter(x=>Number.isInteger(x)&&x>=1&&x<=20);
      const xp=Math.max(0,Math.floor(Number(c.xp??200)||0)),count=Math.max(1,Math.floor(Number(c.count??2)||1));
      if(!levels.length||levels.length!==rawLevels.length){return status('Informe níveis de personagens de 1 a 20, separados por vírgulas.');}
      const result=window.DNDV6?.encounter?.(levels,[{xp,count}]);if(!result){return status('O calculador de encontros ainda não foi carregado.');}
      c.encounterText='XP bruto: '+result.raw+' | XP ajustado: '+result.adjusted+' (×'+result.mult+')\nDificuldade: '+result.rank+'\nLimiares: fácil '+result.thresholds[0]+', médio '+result.thresholds[1]+', difícil '+result.thresholds[2]+', mortal '+result.thresholds[3]+'\nRecompense com XP bruto, não com XP ajustado.';
      persist();return;
    }
    if(kind==='trap'){
      const tier=Math.min(4,Math.max(1,Number(c.trapTier)||1)),names=['placas de pressão ocultas','runas arcanas instáveis','gás em corredores antigos','ídolo que dispara projéteis','portal planar irregular'],theme=names[rollDie(names.length)-1],cd=[11,13,16,19][tier-1],damage=['1d10','2d10','4d10','8d10'][tier-1];
      c.trapText='Ideia: '+theme+'.\nCD sugerida para perceber/desarmar: '+cd+'.\nDano indicativo: '+damage+'.\nAdapte tipo de resistência, severidade, pistas e contramedidas à aventura.';
      persist();return;
    }
    if(kind==='loot'){
      const tier=Math.min(4,Math.max(1,Number(c.lootTier)||1)),reward=['mapa parcial de uma ruína','pergaminho com um segredo regional','insígnia de uma ordem antiga','relíquia com maldição desconhecida','contrato de um patrono misterioso'][rollDie(5)-1],gold=[15,80,450,2500][tier-1]+rollDie([15,60,350,1500][tier-1]);
      c.lootText='Tesouro sugerido: '+gold+' PO + '+reward+'.\nRecompensa narrativa original (não é uma rolagem das tabelas oficiais). Revise economia e poder da campanha.';
      persist();
    }
  }
  function handleClick(event){
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.cxTab){view=target.dataset.cxTab;query='';showAll=false;render();return;}
    if(target.dataset.cxSpecies){applySpecies(target.dataset.cxSpecies);return;}
    if(target.dataset.cxRollSpell){previewSpell(target.dataset.cxRollSpell,target);return;}
    if(target.dataset.cxRollGear){previewGear(target.dataset.cxRollGear,target);return;}
    if(target.dataset.cxSpell){pickSpell(target.dataset.cxSpell);return;}
    if(target.dataset.cxRemoveSpell){removeSpell(target.dataset.cxRemoveSpell);return;}
    if(target.dataset.cxGear){addGear(target.dataset.cxGear);return;}
    if(target.dataset.cxRemoveGear){removeGear(target.dataset.cxRemoveGear);return;}
    if(target.dataset.cxAction)action(target.dataset.cxAction);
  }
  function handleInput(event){
    const t=event.target,c=additional();
    if(t.id==='cxSearch'){query=t.value;const start=t.selectionStart;render();const inp=$('cxSearch');inp?.focus();if(start!==null)inp?.setSelectionRange(start,start);return;}
    if(t.id==='cxQuantity')c.quantity=Math.min(99,Math.max(1,Number(t.value)||1));
    if(t.id==='cxParty')c.party=t.value;
    if(t.id==='cxXP')c.xp=t.value;
    if(t.id==='cxCount')c.count=t.value;
  }
  function handleChange(event){
    const t=event.target,s=cur(),f=s.fields,c=additional();
    if(t.id==='cxEdition'){setEdition(t.value);return;}
    if(['cxBgMode','cxBgA','cxBgB','cxBgC'].includes(t.id)){
      const field={cxBgMode:'bg2024Mode',cxBgA:'bg2024A',cxBgB:'bg2024B',cxBgC:'bg2024C'}[t.id];
      f[field]=t.value;
      const chosen=[f.bg2024A,f.bg2024B,...(f.bg2024Mode==='1+1+1'?[f.bg2024C]:[])].filter(Boolean);
      if(new Set(chosen).size!==chosen.length){f[field]='';persist();return status('Escolha atributos diferentes para distribuir os bônus.');}
      persist();return;
    }
    if(t.id==='cxSpellLevel'){spellLevel=t.value;render();return;}
    if(t.id==='cxSpellClass'){spellClass=t.value;render();return;}
    if(t.id==='cxPatron'){v5.addState(s).subclasses.Bruxo=t.value;persist();return;}
    if(t.id==='cxGearType'){gearType=t.value;render();return;}
    if(t.id==='cxCR'){c.cr=t.value;persist();return;}
    if(t.id==='cxTrapTier'){c.trapTier=t.value;persist();return;}
    if(t.id==='cxLootTier'){c.lootTier=t.value;persist();return;}
    if(t.id==='cxRevelation'){c.revelation=t.value;persist();return;}
    if(t.id==='cxQuantity'){c.quantity=Math.max(1,Number(t.value)||1);persist();}
  }
  window.DNDCompendium={mount:createShell,render,getSpecies:()=>species.map(x=>x.name),getGearCount:()=>v5.GEAR.length,getSpellCount:()=>v5.SPELLS.length};
  createShell();
})();