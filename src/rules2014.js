/* Regras complementares do Livro do Jogador 2014.
   Recursos de subclasse, talentos e regras do mestre podem exigir revisão manual. */
(function(){
'use strict';
const AB=['str','dex','con','int','wis','cha'],NAMES=['Força','Destreza','Constituição','Inteligência','Sabedoria','Carisma'];
const RACES={
 'Anão':[{con:2},{Colina:{wis:1},Montanha:{str:2}}],
 'Elfo':[{dex:2},{'Alto Elfo':{int:1},Floresta:{wis:1},Drow:{cha:1}}],
 'Halfling':[{dex:2},{'Pés Leves':{cha:1},Robusto:{con:1}}],
 'Humano':[{str:1,dex:1,con:1,int:1,wis:1,cha:1},{Padrão:{},Variante:{}}],
 'Draconato':[{str:2,cha:1},{Padrão:{}}],
 'Gnomo':[{int:2},{Floresta:{dex:1},Rochas:{con:1}}],
 'Meio-Elfo':[{cha:2},{Padrão:{}}],
 'Meio-Orc':[{str:2,con:1},{Padrão:{}}],
 'Tiefling':[{int:1,cha:2},{Padrão:{}}]
};
const KNOWN={Bardo:[4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],Bruxo:[2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],Feiticeiro:[2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],Patrulheiro:[0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]};
const TRICKS={Bardo:[2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],Bruxo:[2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],Clérigo:[3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],Druida:[2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],Feiticeiro:[4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],Mago:[3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5]};
const el=id=>document.getElementById(id), sheet=()=>window.DNDDebug?.getMutableState?.();
function raceBonus(f,a){if(!f||f.raceAuto===false)return 0;const r=RACES[f.race];if(!r)return 0;const sub=f.subrace||Object.keys(r[1])[0];let v=(r[0][a]||0)+(r[1][sub]?.[a]||0);
 if(f.race==='Meio-Elfo'&&(a===f.raceExtra1||a===f.raceExtra2))v++;
 if(f.race==='Humano'&&sub==='Variante')v=(a===f.raceExtra1||a===f.raceExtra2)?1:0;
 return v;
}
function healthExtra(f,lv,cl){return (f.raceAuto!==false&&f.race==='Anão'&&f.subrace==='Colina'?lv:0)+(f.featTough?2*lv:0)+(f.draconicSoul&&cl==='Feiticeiro'?lv:0)}
function magicGuide(cl,lv,castScore){if(!cl||!lv)return 'Selecione classe, nível e atributo de conjuração.';let lines=[];
 if(TRICKS[cl])lines.push('Truques conhecidos: '+TRICKS[cl][lv-1]+'.');
 if(KNOWN[cl])lines.push('Magias conhecidas (pela classe): '+KNOWN[cl][lv-1]+'.');
 if(['Clérigo','Druida','Mago','Paladino'].includes(cl)&&(cl!=='Paladino'||lv>=2)){
  let base=cl==='Paladino'?Math.floor(lv/2):lv;
  lines.push('Magias preparadas: '+(castScore===null?'preencha o atributo':Math.max(1,base+Math.floor((castScore-10)/2)))+'.');
 }
 if(cl==='Bruxo'&&lv>=11)lines.push('Arcanos Místicos: um por nível de magia 6 aos 11, 7 aos 13, 8 aos 15, 9 aos 17.');
 if(['Guerreiro','Ladino'].includes(cl))lines.push('Magia da subclasse exige progressão manual de 1/3 conjurador.');
 if(!lines.length)lines.push('Sem magias da classe básica neste nível.');
 lines.push('Subclasses, talentos e multiclasse podem alterar os limites.');return lines.join(' ');
}
const XP_LEVELS=[0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
const RAGES=[2,2,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,Infinity];
function classResourceGuide(cl,lv,cha){
 if(!cl||!Number.isInteger(lv)||lv<1||lv>20)return 'Selecione uma classe e um nível válido.';
 const parts=[];
 switch(cl){
  case 'Bárbaro':parts.push('Fúrias por descanso longo: '+(lv===20?'ilimitadas':RAGES[lv-1]));parts.push('Dano adicional da fúria: +'+(lv<9?2:lv<16?3:4));break;
  case 'Bardo':parts.push('Inspiração de Bardo: '+(cha===null?'modificador de Carisma (mín. 1)':Math.max(1,Math.floor((cha-10)/2)))+' usos, dado d'+(lv<5?6:lv<10?8:lv<15?10:12));parts.push('Recuperação em descanso '+(lv>=5?'curto ou longo':'longo'));break;
  case 'Clérigo':parts.push('Canalizar Divindade: '+(lv<2?0:lv<6?1:lv<18?2:3)+' uso(s) por descanso curto ou longo');break;
  case 'Druida':parts.push('Forma Selvagem: '+(lv>=2?'2 usos por descanso curto ou longo':'liberada no nível 2'));break;
  case 'Feiticeiro':parts.push('Pontos de feitiçaria: '+(lv<2?0:lv)+' (a partir do 2º nível)');break;
  case 'Guerreiro':parts.push('Retomar Fôlego: 1 uso por descanso curto ou longo');parts.push('Surto de Ação: '+(lv<2?0:lv<17?1:2)+' uso(s) por descanso curto ou longo');parts.push('Ataques por ação de Ataque: '+(lv<5?1:lv<11?2:lv<20?3:4));break;
  case 'Ladino':parts.push('Ataque Furtivo: '+Math.ceil(lv/2)+'d6');break;
  case 'Mago':parts.push('Recuperação Arcana: soma de níveis de espaços até '+Math.ceil(lv/2)+' (nenhum acima do 5º nível; 1 vez/dia)');break;
  case 'Monge':parts.push('Pontos de Ki: '+(lv<2?0:lv));parts.push('Dado de Artes Marciais: d'+(lv<5?4:lv<11?6:lv<17?8:10));break;
  case 'Paladino':parts.push('Reserva de Cura pelas Mãos: '+lv*5+' PV');parts.push('Canalizar Divindade disponível após escolher Juramento no nível 3');break;
  case 'Patrulheiro':parts.push('Inimigo Favorito e Explorador Natural: escolhas manuais dependem de nível e campanha');break;
  case 'Bruxo':parts.push('Espaços de Pacto: recuperados em descanso curto; Arcanos Místicos registrados separadamente');break;
 }
 parts.push('Recursos adicionais de arquétipos, talentos e subclasses devem ser escolhidos e registrados à parte.');
 return parts.join(' • ');
}
function levelByXP(xp){let n=1;for(let i=0;i<XP_LEVELS.length;i++)if(xp>=XP_LEVELS[i])n=i+1;return n}

let mounted=false;
function renderSub(f){const dest=el('subrace');const variants=RACES[f.race]?Object.keys(RACES[f.race][1]):[];let cur=variants.includes(f.subrace)?f.subrace:(variants[0]||'');if(f.subrace!==cur)f.subrace=cur;
 dest.innerHTML=variants.map(x=>'<option value="'+x+'">'+x+'</option>').join('');dest.value=cur;}
function refresh(){if(!mounted)return;const s=sheet();if(!s)return;const f=s.fields;renderSub(f);
 const auto=el('raceAuto');auto.checked=f.raceAuto!==false;
 ['featTough','draconicSoul','mageArmor'].forEach(k=>{const x=el('rule-'+k);if(x)x.checked=!!f[k]});
 for(let i=1;i<=2;i++)el('raceExtra'+i).value=f['raceExtra'+i]||['','dex','con'][i];
 el('raceChoices').hidden=!(f.race==='Meio-Elfo'||(f.race==='Humano'&&f.subrace==='Variante'));
 const bonuses=AB.map((a,i)=>({name:NAMES[i],v:raceBonus(f,a)})).filter(a=>a.v);
 el('racePreview').textContent=auto.checked?(bonuses.map(a=>a.name+' +'+a.v).join(' · ')||'Sem bônus aplicado.'):'Bônus raciais desligados. Evita duplicá-los em fichas antigas.';
 el('raceSpecial').textContent=f.race==='Anão'&&f.subrace==='Colina'?'Tenacidade anã: +1 PV por nível.':f.race==='Elfo'&&f.subrace==='Drow'?'Sensibilidade à luz solar: consulte as condições.':f.race==='Humano'&&f.subrace==='Variante'?'Humano variante: escolher 1 perícia e 1 talento manualmente.':'';
 const cl=f.className,lv=Number(f.level);const cas=f.castAbility||({Mago:'int',Clérigo:'wis',Druida:'wis',Paladino:'cha',Patrulheiro:'wis',Bardo:'cha',Bruxo:'cha',Feiticeiro:'cha'}[cl]);
 const base=s.abilities[cas];const score=cas&&base!==''&&base!=null?Number(base)+raceBonus(f,cas):null;
 el('magicGuide').textContent=magicGuide(cl,Number.isInteger(lv)&&lv>=1&&lv<=20?lv:null,score);
 el('classResourceGuide').textContent=classResourceGuide(cl,lv,s.abilities.cha===""?null:Number(s.abilities.cha)+raceBonus(f,'cha'));
 let hp=window.DNDDebug?.getHP?.();el('racialHPNote').textContent=hp?'PV máximos '+hp.total+' (incluindo bônus raciais e talentos configurados).':'Configure classe, nível e Constituição para calcular a vida.';
}
function mount(){if(mounted||!el('race')||!el('hpFormula')||!el('spellNote'))return;mounted=true;
 const box=document.createElement('article');box.id='rulesOrigin';box.className='panel rules-origin';box.innerHTML='<h2>Raça, sub-raça e bônus oficiais (2014)</h2><div class="rules-grid"><label>Sub-raça<select id="subrace"></select></label><label class="rule-check"><input type="checkbox" id="raceAuto">Somar bônus raciais à pontuação base</label></div><div class="rules-grid" id="raceChoices"><label>Escolha bônus +1 nº 1<select id="raceExtra1">'+AB.map((a,i)=>'<option value="'+a+'">'+NAMES[i]+'</option>').join('')+'</select></label><label>Escolha bônus +1 nº 2<select id="raceExtra2">'+AB.map((a,i)=>'<option value="'+a+'">'+NAMES[i]+'</option>').join('')+'</select></label></div><p class="rule-info" id="racePreview"></p><p class="rule-info" id="raceSpecial"></p><small>Os campos dos seis atributos guardam o valor base; o cálculo mostra o total com bônus raciais. Ajustes antigos ficam desligados para evitar contagem duplicada.</small>';
 el('race').closest('.identity').insertAdjacentElement('afterend',box);
 const hp=document.createElement('div');hp.className='rules-detail';hp.innerHTML='<b>PV especiais</b><label class="rule-check"><input id="rule-featTough" type="checkbox">Talento Robusto: +2 PV por nível</label><label class="rule-check"><input id="rule-draconicSoul" type="checkbox">Feiticeiro: Linhagem Dracônica +1 PV por nível</label><p class="rule-info" id="racialHPNote"></p>';el('hpFormula').insertAdjacentElement('afterend',hp);
 const magic=document.createElement('div');magic.className='rules-detail';magic.innerHTML='<b>Preparação e conhecimento de magias</b><p class="rule-info" id="magicGuide"></p>';el('spellNote').insertAdjacentElement('afterend',magic);
 const death=document.createElement('div');death.className='rules-detail';death.innerHTML='<button id="deathRoll" type="button">🎲 Rolagem de resistência à morte</button><p class="rule-info" id="deathResult"></p>';el('deathFailure').closest('.death-wrap').insertAdjacentElement('afterend',death);
 const conc=document.createElement('article');conc.className='panel';conc.innerHTML='<h2>Concentração de magia</h2><p class="helper">Teste de resistência de Constituição com CD 10 ou metade do dano, o maior.</p><label>Dano sofrido<input type="number" min="1" id="concDamage" value="12"></label><button id="concRoll" type="button">🎲 Testar concentração</button><p id="concResult" class="results">Aguardando teste.</p>';el('tools').querySelector('.story-grid').appendChild(conc);
 const resource=document.createElement('article');resource.className='panel';resource.innerHTML='<h2>Recursos por classe e nível (2014)</h2><p class="rule-info" id="classResourceGuide"></p>';el('tools').querySelector('.story-grid').appendChild(resource);
 const xp=document.createElement('button');xp.id='xpLevelBtn';xp.type='button';xp.textContent='Atualizar nível pelo XP';xp.className='tiny';xp.title='Atualiza o nível numérico, não as escolhas de arquétipo e melhorias de atributo';el('xpNext').parentElement.appendChild(xp);
 xp.addEventListener('click',()=>{const f=sheet().fields,v=Number(f.xp);if(!Number.isFinite(v)||v<0){el('raceSpecial').textContent='XP inválido.';return}const target=levelByXP(v);const field=el('level');field.value=target;field.dispatchEvent(new Event('input',{bubbles:true}));el('raceSpecial').textContent='Nível atualizado para '+target+'. Revise escolhas de classe, talentos e melhorias de atributos.'});
 const css=document.createElement('style');css.textContent='.rules-origin{margin-bottom:14px}.rules-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.rule-check{display:flex!important;align-items:center;flex-direction:row!important;gap:6px;font-size:11px!important}.rule-check input{width:17px;height:17px;flex:none}.rule-info{font-size:11px;color:#63746a;line-height:1.6}.rules-detail{border:1px solid #cbd4cb;background:#f7faf6;padding:9px;border-radius:6px;margin:8px 0}.rules-detail b{font-size:11px}.rules-detail p{margin:7px 0}@media(max-width:650px){.rules-grid{grid-template-columns:1fr}}@media print{#rulesOrigin{display:none}.rules-detail button{display:none}}';document.head.appendChild(css);
 el('subrace').addEventListener('change',()=>{const f=sheet().fields;f.subrace=el('subrace').value;if(f.race==='Elfo'&&f.subrace==='Floresta')setSpeed(10.5);else if(f.race==='Elfo')setSpeed(9);window.DNDDebug.recalc()});
 el('raceAuto').addEventListener('change',()=>{sheet().fields.raceAuto=el('raceAuto').checked;window.DNDDebug.recalc()});
 for(const k of ['featTough','draconicSoul'])el('rule-'+k).addEventListener('change',()=>{sheet().fields[k]=el('rule-'+k).checked;window.DNDDebug.recalc()});
 for(const k of ['raceExtra1','raceExtra2'])el(k).addEventListener('change',()=>{const f=sheet().fields,other=k==='raceExtra1'?'raceExtra2':'raceExtra1',newVal=el(k).value;if(newVal===f[other]||(f.race==='Meio-Elfo'&&newVal==='cha')){el(k).value=f[k]||'';return}f[k]=newVal;window.DNDDebug.recalc()});
 el('race').addEventListener('change',()=>{sheet().fields.subrace='';window.DNDDebug.recalc()});
 el('deathRoll').addEventListener('click',rollDeath);el('concRoll').addEventListener('click',rollConcentration);refresh();
}
function setSpeed(v){const e=el('speed');e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}
function rollDeath(){const s=sheet();if(!s)return;const f=s.fields;if(f.hpCurrent!==''&&Number(f.hpCurrent)>0){el('deathResult').textContent='A rolagem só ocorre com 0 PV.';return}const d=1+Math.floor(Math.random()*20);let x='';if(d===20){f.hpCurrent=1;s.deathSuccess=0;s.deathFailure=0;x='20 natural: recupera 1 PV.'}else{if(d===1){s.deathFailure=Math.min(3,s.deathFailure+2);x='1 natural: duas falhas.'}else if(d>=10){s.deathSuccess=Math.min(3,s.deathSuccess+1);x='Um sucesso.'}else{s.deathFailure=Math.min(3,s.deathFailure+1);x='Uma falha.'}if(s.deathSuccess===3){s.deathSuccess=0;s.deathFailure=0;x+=' Personagem estabilizado.'}if(s.deathFailure===3)x+=' Três falhas: personagem morreu.'}el('deathResult').textContent='d20: '+d+'. '+x;window.DNDDebug.recalc()}
function rollConcentration(){const s=sheet(),f=s?.fields;if(!s)return;const dmg=Number(el('concDamage').value);if(!Number.isFinite(dmg)||dmg<=0){el('concResult').textContent='Insira dano válido.';return}const val=s.abilities.con;if(val===''||val==null){el('concResult').textContent='Preencha Constituição.';return}const md=Math.floor((Number(val)+raceBonus(f,'con')-10)/2);const lv=Number(f.level)||1,prof=s.saves.includes('con')?2+Math.floor((lv-1)/4):0,dc=Math.max(10,Math.floor(dmg/2)),d=1+Math.floor(Math.random()*20),total=d+md+prof;el('concResult').textContent='CD '+dc+' · d20 ['+d+'] + '+(md+prof)+' = '+total+' · '+(total>=dc?'Concentração mantida.':'Concentração perdida.')}
window.DND2014={raceBonus,healthExtra,magicGuide,classResourceGuide,levelByXP,mount,refresh};
})();