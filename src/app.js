/* D&D 5e (2014) · Ficha digital autônoma · nenhuma biblioteca externa */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const A=[['str','Força'],['dex','Destreza'],['con','Constituição'],['int','Inteligência'],['wis','Sabedoria'],['cha','Carisma']];
const SK=[['acrobatics','Acrobacia','dex'],['animal','Adestrar Animais','wis'],['arcana','Arcanismo','int'],['athletics','Atletismo','str'],['performance','Atuação','cha'],['deception','Enganação','cha'],['stealth','Furtividade','dex'],['history','História','int'],['intimidation','Intimidação','cha'],['insight','Intuição','wis'],['investigation','Investigação','int'],['medicine','Medicina','wis'],['nature','Natureza','int'],['perception','Percepção','wis'],['persuasion','Persuasão','cha'],['sleight','Prestidigitação','dex'],['religion','Religião','int'],['survival','Sobrevivência','wis']];
const CLASSES={
 'Bárbaro':{die:12,saves:['str','con'],skills:[2,['animal','athletics','intimidation','nature','perception','survival']],priority:['str','con','dex','wis','cha','int']},
 'Bardo':{die:8,saves:['dex','cha'],skills:[3,SK.map(x=>x[0])],cast:'cha',priority:['cha','dex','con','wis','int','str']},
 'Bruxo':{die:8,saves:['wis','cha'],skills:[2,['arcana','deception','history','intimidation','investigation','nature','religion']],cast:'cha',priority:['cha','con','dex','wis','int','str']},
 'Clérigo':{die:8,saves:['wis','cha'],skills:[2,['history','insight','medicine','persuasion','religion']],cast:'wis',priority:['wis','con','str','dex','cha','int']},
 'Druida':{die:8,saves:['int','wis'],skills:[2,['arcana','animal','insight','medicine','nature','perception','religion','survival']],cast:'wis',priority:['wis','con','dex','int','cha','str']},
 'Feiticeiro':{die:6,saves:['con','cha'],skills:[2,['arcana','deception','insight','intimidation','persuasion','religion']],cast:'cha',priority:['cha','con','dex','wis','int','str']},
 'Guerreiro':{die:10,saves:['str','con'],skills:[2,['acrobatics','animal','athletics','history','insight','intimidation','perception','survival']],priority:['str','con','dex','wis','int','cha']},
 'Ladino':{die:8,saves:['dex','int'],skills:[4,['acrobatics','athletics','performance','deception','stealth','intimidation','insight','investigation','perception','persuasion','sleight']],priority:['dex','con','wis','cha','int','str']},
 'Mago':{die:6,saves:['int','wis'],skills:[2,['arcana','history','insight','investigation','medicine','religion']],cast:'int',priority:['int','con','dex','wis','cha','str']},
 'Monge':{die:8,saves:['str','dex'],skills:[2,['acrobatics','athletics','stealth','history','insight','religion']],priority:['dex','wis','con','str','int','cha']},
 'Paladino':{die:10,saves:['wis','cha'],skills:[2,['athletics','insight','intimidation','medicine','persuasion','religion']],cast:'cha',priority:['str','cha','con','wis','dex','int']},
 'Patrulheiro':{die:10,saves:['str','dex'],skills:[3,['animal','athletics','stealth','insight','investigation','nature','perception','survival']],cast:'wis',priority:['dex','wis','con','str','int','cha']}
};
const BACKGROUNDS={
 'Acolito':['insight','religion'],'Artesão de Guilda':['insight','persuasion'],'Artista':['acrobatics','performance'],
 'Charlatão':['deception','sleight'],'Criminoso':['deception','stealth'],'Eremita':['medicine','religion'],
 'Forasteiro':['athletics','survival'],'Herói do Povo':['animal','survival'],'Marinheiro':['athletics','perception'],
 'Nobre':['history','persuasion'],'Órfão':['sleight','stealth'],'Sábio':['arcana','history'],'Soldado':['athletics','intimidation']
};
const RACES={'Anão':7.5,'Elfo':9,'Halfling':7.5,'Humano':9,'Draconato':9,'Gnomo':7.5,'Meio-Elfo':9,'Meio-Orc':9,'Tiefling':9};
const ARMOR={'Sem armadura':[10,99],'Acolchoada':[11,99],'Couro':[11,99],'Couro batido':[12,99],'Peles':[12,2],'Camisão de malha':[13,2],'Brunea':[14,2],'Peitoral':[14,2],'Meia armadura':[15,2],'Cota de anéis':[14,0],'Cota de malha':[16,0],'Cota de talas':[17,0],'Armadura de placas':[18,0]};
const CONDITIONS=['Agarrado','Amedrontado','Atordoado','Caído','Cego','Enfeitiçado','Envenenado','Incapacitado','Invisível','Paralisado','Petrificado','Impedido','Surdo','Inconsciente'];
const SLOT_FULL=[
 [0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
];
const XP=[0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
const COST={8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};
const FIELDS={name:'',className:'',level:'',race:'',subrace:'',raceAuto:true,raceExtra1:'dex',raceExtra2:'con',featTough:false,draconicSoul:false,initiativeExtra:'',mageArmor:false,background:'',player:'',alignment:'',xp:'',speed:'',inspiration:false,armor:'Sem armadura',acExtra:'',shield:false,acOverride:'',hpCurrent:'',hpTemp:'',hpMethod:'average',hpPerLevel:'',hpExtra:'',hitDiceSpent:'',personality:'',ideals:'',bonds:'',flaws:'',traits:'',otherProfs:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',appearance:'',allies:'',history:'',features:'',treasure:'',castClass:'',castAbility:'',spellProgression:'auto',manaMax:'',manaUsed:'',exhaustion:'',resourceName:'',resourceMax:'',resourceUsed:''};
const uid=()=>{try{return crypto.randomUUID()}catch(e){return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9)}};
const fresh=()=>({version:3,id:uid(),fields:{...FIELDS},abilities:Object.fromEntries(A.map(x=>[x[0],''])),saves:[],skillProfs:[],expertise:[],autoSkills:[],hpRolls:[],hpRollDie:null,hpLastMax:null,attacks:[{id:uid(),name:'',type:'str',damage:'1d8',prof:true}],items:[],currency:{pc:0,pp:0,pe:0,po:0,pl:0},conditions:[],deathSuccess:0,deathFailure:0,spells:Object.fromEntries(Array.from({length:10},(_,i)=>[i,''])),slotsUsed:Array(9).fill(0),pointBuy:Object.fromEntries(A.map(x=>[x[0],8])),rollLog:[]});
let library={},active='',state,saveTimer,rolls=[],restoring=false;
const blank=v=>v===''||v===null||v===undefined;
const n=(v,def=0)=>blank(v)||!Number.isFinite(Number(v))?def:Number(v);
const safeInt=(v,def=0)=>Math.trunc(n(v,def));
const score=a=>blank(state.abilities[a])?null:n(state.abilities[a])+(window.DND2014?.raceBonus?.(state.fields,a)||0)+(window.DNDV5?.abilityBonus?.(state,a)||0);
const mod=a=>score(a)===null?null:Math.floor((score(a)-10)/2);
const signed=x=>x===null?'—':(x>=0?'+':'')+x;
const level=()=>{let l=n(state.fields.level,NaN);return Number.isInteger(l)&&l>=1&&l<=20?l:null};
const pb=()=>level()===null?null:2+Math.floor((level()-1)/4);
const escaped=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rand(sides){if(window.crypto&&crypto.getRandomValues){const arr=new Uint32Array(1),lim=Math.floor(4294967296/sides)*sides;do{crypto.getRandomValues(arr)}while(arr[0]>=lim);return 1+(arr[0]%sides)}return 1+Math.floor(Math.random()*sides)}
function msg(text){const t=$('toast');t.textContent=text;t.classList.add('show');clearTimeout(msg.timer);msg.timer=setTimeout(()=>t.classList.remove('show'),3200)}
function opt(select,values,empty='Selecione...'){select.innerHTML='<option value="">'+empty+'</option>'+values.map(x=>`<option value="${escaped(x)}">${escaped(x)}</option>`).join('')}
function makeUI(){
 opt($('className'),Object.keys(CLASSES));opt($('race'),Object.keys(RACES));opt($('background'),Object.keys(BACKGROUNDS));opt($('castClass'),Object.keys(CLASSES),'Classe principal');
 $('armor').innerHTML=Object.keys(ARMOR).map(a=>`<option>${escaped(a)}</option>`).join('');
 $('abilityList').innerHTML=A.map(([k,title])=>`<div class="ability-row"><label for="attr-${k}">${title}</label><input id="attr-${k}" type="number" min="1" max="30" data-ability="${k}" aria-label="Valor de ${title}"><output class="ability-score" id="final-${k}" title="Valor final com bônus de raça">—</output><output class="ability-mod" id="mod-${k}">—</output><button class="tiny" data-action="test-ability" data-key="${k}" title="Rolar d20 com o modificador">d20</button></div>`).join('');
 $('saves').innerHTML=A.map(([k,title])=>`<div class="list-row"><input type="checkbox" data-save="${k}" aria-label="Proficiência em salvaguarda de ${title}"><span>${title}</span><output id="save-${k}">—</output><button class="tiny" data-action="test-save" data-key="${k}">d20</button></div>`).join('');
 $('skills').innerHTML=SK.map(([key,title,a])=>`<div class="list-row skill-row"><input type="checkbox" data-skill="${key}" aria-label="Proficiência em ${title}"><input type="checkbox" data-expert="${key}" aria-label="Especialização em ${title}" title="Especialização (dobrar proficiência)"><span>${title} <small>(${a.toUpperCase()})</small></span><output id="skill-${key}">—</output><button class="tiny" data-action="test-skill" data-key="${key}">d20</button></div>`).join('');
 $('currencyFields').innerHTML=[['pc','PC'],['pp','PP'],['pe','PE'],['po','PO'],['pl','PL']].map(([k,name])=>`<label>${name}<input data-currency="${k}" type="number" min="0" step="1"></label>`).join('');
 $('conditionList').innerHTML=CONDITIONS.map(k=>`<label class="checkbox-label"><input type="checkbox" data-condition="${escaped(k)}">${escaped(k)}</label>`).join('');
 for(const type of ['Success','Failure'])$('death'+type).innerHTML=[0,1,2].map(i=>`<input type="checkbox" data-death="${type}" data-index="${i}" aria-label="${type} ${i+1}">`).join('');
 $('pointBuy').innerHTML=A.map(([k,title])=>`<label class="pointbuy-row">${title}<select data-point="${k}">${Object.keys(COST).map(v=>`<option value="${v}">${v} · ${COST[v]} pts</option>`).join('')}</select></label>`).join('');
 $('spellList').innerHTML=Array.from({length:10},(_,i)=>`<article class="spell-level"><h2><span>${i}</span>${i===0?'Truques':'Magias nível '+i}</h2>${i>0?`<div class="slot-row"><small id="slotAvailable-${i}">Espaços: —</small><label>Gastos<input type="number" data-slot="${i}" min="0"></label><output id="slotRest-${i}">—</output></div>`:''}<textarea data-spell="${i}" rows="7" placeholder="Uma magia por linha..."></textarea></article>`).join('');
}
function save(){try{library[active]=state;localStorage.setItem('dnd-v3-library',JSON.stringify({version:3,active,library}));$('saveStatus').textContent='Salvo ✓'}catch(e){$('saveStatus').textContent='Sem espaço';msg('Falha ao salvar localmente: exporte um JSON.')}}
function queueSave(){ $('saveStatus').textContent='Salvando...';clearTimeout(saveTimer);saveTimer=setTimeout(save,350)}
function normalize(raw){const v=fresh();if(!raw||typeof raw!=='object')return v;
 if(raw.version===3){Object.assign(v,raw);v.fields={...FIELDS,...raw.fields};if(raw.fields?.raceAuto===undefined)v.fields.raceAuto=false;v.abilities={...v.abilities,...raw.abilities};v.currency={...v.currency,...raw.currency};v.spells={...v.spells,...raw.spells};v.pointBuy={...v.pointBuy,...raw.pointBuy};for(const prop of ['attacks','items','saves','skillProfs','expertise','autoSkills','hpRolls','conditions','slotsUsed','rollLog'])if(!Array.isArray(v[prop]))v[prop]=fresh()[prop];return v}
 const obj=raw.form&&typeof raw.form==='object'?raw.form:raw;
 const mapping={charName:'name',playerName:'player',classe:'className',level:'level',race:'race',background:'background',xp:'xp',alignment:'alignment',speed:'speed',hpCur:'hpCurrent',hpTemp:'hpTemp',initMisc:'initiativeExtra',traits:'traits',inventory:'otherProfs',proficiencies:'otherProfs',languages:'otherProfs',castingStat:'castAbility',manaMax:'manaMax',manaUsed:'manaUsed',armorType:'armor',hpPerLevelBonus:'hpPerLevel',hpMisc:'hpExtra',hitDiceSpent:'hitDiceSpent',autoHp:'autoHp'};
 for(const [k,d] of Object.entries(mapping))if(k in obj&&d in v.fields)v.fields[d]=obj[k];
 for(const [k] of A){if(k in obj)v.abilities[k]=obj[k];if(obj['profSave-'+k])v.saves.push(k)}
 for(const [k] of SK){if(obj['prof-'+k])v.skillProfs.push(k);if(obj['exp-'+k])v.expertise.push(k)}
 for(let i=0;i<=9;i++)if(obj['spells'+i])v.spells[i]=obj['spells'+i];
 if('autoHp'in obj&&obj.autoHp===false&&'hpMax'in obj)v.fields.hpExtra='';
 if(Array.isArray(raw.attacks))v.attacks=raw.attacks.map(x=>({id:uid(),name:x.name||'',damage:x.damage||'1d8',type:x.stat||'str',prof:!!x.prof}));
 return v;
}
function firstLoad(){try{const value=JSON.parse(localStorage.getItem('dnd-v3-library')||'null');if(value?.library&&typeof value.library==='object'&&Object.keys(value.library).length){library=Object.fromEntries(Object.entries(value.library).map(([id,v])=>[id,normalize(v)]));active=library[value.active]?value.active:Object.keys(library)[0];state=library[active];return}}catch(e){}
 let entry=null;try{entry=JSON.parse(localStorage.getItem('dnd-sheet-2014-autosave-v2')||'null')}catch(e){}
 state=entry?normalize(entry):fresh();active=state.id;library[active]=state;save();}
function renderSelect(){const s=$('characterSelect');s.innerHTML=Object.entries(library).map(([key,c])=>`<option value="${escaped(key)}">${escaped(c.fields.name||'Personagem sem nome')} ${c.fields.level?'· Nível '+escaped(c.fields.level):''}</option>`).join('');s.value=active}
function renderFields(){for(const el of document.querySelectorAll('[data-field]')){const k=el.dataset.field,val=state.fields[k];if(el.type==='checkbox')el.checked=!!val;else el.value=blank(val)?'':val}
 for(const el of document.querySelectorAll('[data-ability]'))el.value=state.abilities[el.dataset.ability]??'';
 for(const el of document.querySelectorAll('[data-save]'))el.checked=state.saves.includes(el.dataset.save);
 for(const el of document.querySelectorAll('[data-skill]'))el.checked=state.skillProfs.includes(el.dataset.skill);
 for(const el of document.querySelectorAll('[data-expert]'))el.checked=state.expertise.includes(el.dataset.expert);
 for(const el of document.querySelectorAll('[data-condition]'))el.checked=state.conditions.includes(el.dataset.condition);
 for(const el of document.querySelectorAll('[data-currency]'))el.value=state.currency[el.dataset.currency]??0;
 for(const el of document.querySelectorAll('[data-spell]'))el.value=state.spells[el.dataset.spell]??'';
 for(const el of document.querySelectorAll('[data-slot]'))el.value=state.slotsUsed[Number(el.dataset.slot)-1]||'';
 for(const el of document.querySelectorAll('[data-point]'))el.value=state.pointBuy[el.dataset.point]??8;
 for(const el of document.querySelectorAll('[data-death]'))el.checked=el.dataset.index<(el.dataset.death==='Success'?state.deathSuccess:state.deathFailure);
 renderAttacks();renderItems();drawLog();renderDerived();renderSelect();}
function toggleIn(arr,key,check){const s=new Set(arr);if(check)s.add(key);else s.delete(key);return [...s]}
function setField(key,val){state.fields[key]=val;
 if(key==='className'){state.saves=CLASSES[val]?.saves.slice()||[];state.fields.castClass=val;state.fields.castAbility=CLASSES[val]?.cast||'';state.autoSkills.forEach(x=>{state.skillProfs=state.skillProfs.filter(y=>y!==x)});state.autoSkills=[];
 $('castClass').value=state.fields.castClass;$('castAbility').value=state.fields.castAbility;document.querySelectorAll('[data-save]').forEach(el=>el.checked=state.saves.includes(el.dataset.save));document.querySelectorAll('[data-skill]').forEach(el=>el.checked=state.skillProfs.includes(el.dataset.skill));}
 if(key==='race'&&val in RACES){state.fields.speed=RACES[val];$('speed').value=state.fields.speed}
 if(key==='castClass'){state.fields.castAbility=CLASSES[val]?.cast||'';$('castAbility').value=state.fields.castAbility}
 if(key==='hpMethod'&&val==='rolled'){state.hpRolls=[]}
}
function calcHP(){const multi=window.DNDV5?.hpForMulti?.(state);if(multi)return multi;const l=level(),cl=CLASSES[state.fields.className],con=mod('con');if(!l||!cl||con===null)return null;
 if(state.hpRollDie!==cl.die){state.hpRollDie=cl.die;state.hpRolls=[]}
 const per=n(state.fields.hpPerLevel),extra=n(state.fields.hpExtra),values=[];
 let first=Math.max(1,cl.die+con+per);let total=first;
 for(let i=2;i<=l;i++){let d=state.fields.hpMethod==='rolled'?state.hpRolls[i-2]:Math.floor(cl.die/2)+1;
 if(state.fields.hpMethod==='rolled'&&(!Number.isInteger(d)||d<1||d>cl.die)){d=rand(cl.die);state.hpRolls[i-2]=d}
 let gain=Math.max(1,d+con+per);total+=gain;values.push(gain)}
 return {total:Math.max(1,total+extra+(window.DND2014?.healthExtra?.(state.fields,l,state.fields.className)||0)),first,values,die:cl.die,per,extra};}
function spellSlots(){const shared=window.DNDV5?.slotsForMulti?.(state);if(shared)return shared;const l=level(),cl=state.fields.castClass||state.fields.className;if(!l)return {totals:Array(9).fill(0),mode:'none'};
 let mode=state.fields.spellProgression;if(mode==='auto'&&window.DNDV5?.thirdCaster?.(state,cl))mode='third';if(mode==='auto')mode=['Bardo','Clérigo','Druida','Feiticeiro','Mago'].includes(cl)?'full':cl==='Bruxo'?'pact':['Paladino','Patrulheiro'].includes(cl)?'half':'none';
 let slots=Array(9).fill(0);
 if(mode==='pact'){const tier=l<3?1:l<5?2:l<7?3:l<9?4:5;slots[tier-1]=l===1?1:l<11?2:l<17?3:4}
 else{const idx=mode==='full'?l:mode==='half'?(l<2?0:Math.ceil(l/2)):mode==='third'?(l<3?0:Math.ceil(l/3)):0;if(idx>0)slots=SLOT_FULL[Math.min(20,idx)].slice()}
 return {totals:slots,mode};}
function derivedSkill(id){const sk=SK.find(x=>x[0]===id),m=sk?mod(sk[2]):null,p=pb();if(m===null)return null;return m+(p??0)*(state.expertise.includes(id)?2:state.skillProfs.includes(id)?1:0)}
function derivedAC(){const override=state.fields.acOverride;if(!blank(override)&&Number.isFinite(Number(override)))return n(override);
 const dex=mod('dex');if(dex===null)return null;
 const armor=state.fields.armor,base=ARMOR[armor]||ARMOR['Sem armadura'];let val=base[0]+Math.min(dex,base[1]);
 if(armor==='Sem armadura'){
 if(state.fields.mageArmor)val=Math.max(val,13+dex);
 if(state.fields.draconicSoul&&state.fields.className==='Feiticeiro')val=Math.max(val,13+dex);
 if(state.fields.className==='Bárbaro'&&mod('con')!==null)val=Math.max(val,10+dex+mod('con'));
 if(state.fields.className==='Monge'&&!state.fields.shield&&mod('wis')!==null)val=Math.max(val,10+dex+mod('wis'));
 }
 return val+(state.fields.shield?2:0)+n(state.fields.acExtra)+(window.DNDV6?.armorBonus?.(state)||0);
}
function deriveAttack(row){const p=pb(),a=row.type==='spell'?(state.fields.castAbility||CLASSES[state.fields.className]?.cast):row.type;const bonus=a?mod(a):null;return bonus===null?null:bonus+(row.prof?(p??0):0)+(window.DNDV6?.attackBonus?.(row)||0)}
function renderDerived(){const l=level(),p=pb(),cl=CLASSES[state.fields.className];$('profBonus').textContent=signed(p);
 for(const [key] of A){$('final-'+key).textContent=score(key)===null?'—':score(key);$('mod-'+key).textContent=signed(mod(key));const save=mod(key);$('save-'+key).textContent=signed(save===null?null:save+(state.saves.includes(key)?p||0:0))}
 for(const [key] of SK)$('skill-'+key).textContent=signed(derivedSkill(key));
 const passive=id=>{const b=derivedSkill(id);return b===null?'—':10+b+(window.DNDV5?.passiveBonus?.(state,id)||0)};$('passPerception').textContent=passive('perception');$('passInvestigation').textContent=passive('investigation');$('passInsight').textContent=passive('insight');
 const xp=n(state.fields.xp,NaN);$('xpNext').textContent=l===null?'Preencha o nível':l===20?'Nível máximo':Number.isFinite(xp)?`${Math.max(0,XP[l]-xp).toLocaleString('pt-BR')} XP até nível ${l+1}`:`Próximo nível: ${XP[l].toLocaleString('pt-BR')} XP`;
 $('initiative').textContent=signed(mod('dex')===null?null:mod('dex')+n(state.fields.initiativeExtra)+(window.DNDV5?.initBonus?.(state)||0));$('acValue').textContent=derivedAC()??'—';
 const hp=calcHP();if(hp){const old=state.hpLastMax;const newMax=hp.total;const oldCur=state.fields.hpCurrent;
 if(blank(oldCur))state.fields.hpCurrent=newMax;
 else if(old!==null&&old!==newMax){const prev=n(oldCur);state.fields.hpCurrent=prev<=0?0:Math.min(newMax,Math.max(0,prev+newMax-old))}
 else if(n(oldCur)>newMax)state.fields.hpCurrent=newMax;
 state.hpLastMax=newMax;
 $('hpMax').textContent=newMax;$('hpCurrent').value=state.fields.hpCurrent;$('hpBar').style.width=Math.max(0,Math.min(100,100*n(state.fields.hpCurrent)/newMax))+'%';
 $('hpFormula').textContent=`1º nível: ${hp.first} PV · demais: ${state.fields.hpMethod==='average'?'média fixa':'dados rolados'} · Mod. CON: ${signed(mod('con'))} · Total: ${newMax} PV`;
 $('hitDice').textContent=hp.multiDice?Object.entries(hp.multiDice).map(([cls,count])=>count+'d'+CLASSES[cls].die+' ('+cls+')').join(' + ')+' · '+Math.max(0,l-n(state.fields.hitDiceSpent))+' DV disponíveis':`${Math.max(0,l-n(state.fields.hitDiceSpent))} de ${l}d${hp.die} restantes`;
 }else{$('hpMax').textContent='—';$('hpBar').style.width='0';$('hitDice').textContent='—';$('hpFormula').textContent='Selecione classe, nível (1–20) e Constituição.'}
 $('rollHp').disabled=!hp||state.fields.hpMethod!=='rolled';
 for(const tr of $('attacksBody').children){const a=state.attacks.find(x=>x.id===tr.dataset.id);if(a){tr.querySelector('output').textContent=signed(deriveAttack(a))}}
 const caster=state.fields.castAbility;const castMod=caster?mod(caster):null;$('spellDC').textContent=castMod===null||p===null?'—':8+p+castMod;$('spellAttack').textContent=castMod===null||p===null?'—':signed(p+castMod);
 const slots=spellSlots();for(let i=1;i<=9;i++){$('slotAvailable-'+i).textContent='Espaços: '+slots.totals[i-1];const spent=Math.max(0,n(state.slotsUsed[i-1]));$('slotRest-'+i).textContent=`Restam ${Math.max(0,slots.totals[i-1]-spent)}`;}
 $('spellNote').textContent=slots.mode==='pact'?'Bruxo: espaços de pacto voltam após descanso curto. Arcanos Místicos são separados.':'Espaços calculados conforme a classe ou progressão selecionada. Multiclasse exige cálculo próprio.';
 $('manaLeft').textContent=blank(state.fields.manaMax)?'—':Math.max(0,n(state.fields.manaMax)-n(state.fields.manaUsed));$('resourceRemaining').textContent=blank(state.fields.resourceMax)?'—':Math.max(0,n(state.fields.resourceMax)-n(state.fields.resourceUsed));
 const totalWeight=state.items.reduce((s,x)=>s+Math.max(0,n(x.qty))*Math.max(0,n(x.weight)),0);const carry=score('str');$('weightSummary').textContent=totalWeight.toLocaleString('pt-BR',{maximumFractionDigits:2})+' kg';$('carrySummary').textContent=carry===null?'—':(carry*7.5).toLocaleString('pt-BR')+' kg';$('coinSummary').textContent=(n(state.currency.pc)*.01+n(state.currency.pp)*.1+n(state.currency.pe)*.5+n(state.currency.po)+n(state.currency.pl)*10).toLocaleString('pt-BR',{maximumFractionDigits:2})+' PO';
 renderPointSummary();window.DND2014?.refresh?.();window.DNDV5?.refresh?.();
}
function renderAttacks(){$('attacksBody').innerHTML=state.attacks.map(a=>`<tr data-id="${escaped(a.id)}"><td><input data-attack="name" value="${escaped(a.name)}" aria-label="Nome do ataque"></td><td><select data-attack="type"><option value="str" ${a.type==='str'?'selected':''}>FOR</option><option value="dex" ${a.type==='dex'?'selected':''}>DES</option><option value="spell" ${a.type==='spell'?'selected':''}>MAG</option></select></td><td><output>—</output><label title="Proficiente" class="checkbox-label"><input data-attack="prof" type="checkbox" ${a.prof?'checked':''}>Prof.</label></td><td><input data-attack="damage" value="${escaped(a.damage)}" aria-label="Expressão do dano"></td><td><button data-remove-attack="${escaped(a.id)}" title="Remover ataque">×</button></td></tr>`).join('')}
function renderItems(){$('itemsBody').innerHTML=state.items.map(a=>`<tr data-id="${escaped(a.id)}"><td><input data-item="name" value="${escaped(a.name)}" aria-label="Nome do item"></td><td><input data-item="qty" type="number" min="0" value="${escaped(a.qty)}" aria-label="Quantidade"></td><td><input data-item="weight" type="number" step="0.01" min="0" value="${escaped(a.weight)}" aria-label="Peso em quilogramas"></td><td><button data-remove-item="${escaped(a.id)}" title="Remover item">×</button></td></tr>`).join('')}
function drawLog(){$('rollLog').innerHTML=state.rollLog.slice(0,12).map(x=>`<p>${escaped(x)}</p>`).join('')}
function rollExpression(expression){const e=String(expression).toLowerCase().replace(/\s+/g,'');const m=/^(\d{0,2})d(\d{1,3})(?:(kh|kl)(\d{1,2}))?([+-]\d{1,4})?$/.exec(e);if(!m)return {error:'Formato inválido. Use 1d20+3, 2d8-1 ou 4d6kh3.'};const count=Number(m[1]||1),faces=Number(m[2]),keep=m[4]?Number(m[4]):count,flat=Number(m[5]||0);if(count<1||count>50||faces<2||faces>100||keep<1||keep>count)return {error:'Limite: 1–50 dados, d2–d100 e seleção válida.'};const rolls=Array.from({length:count},()=>rand(faces));let used=rolls.slice();if(m[3])used.sort((a,b)=>m[3]==='kh'?b-a:a-b).splice(keep);const total=used.reduce((a,b)=>a+b,0)+flat;return {total,rolls,used,flat,formula:e}}
function appendLog(label,text){state.rollLog.unshift(label+' — '+text);state.rollLog=state.rollLog.slice(0,30);drawLog();queueSave()}
function rollTest(label,bonus,adv='normal'){if(bonus===null){msg('Preencha o atributo necessário primeiro.');return}const dice=[rand(20)];if(adv!=='normal')dice.push(rand(20));const chosen=adv==='advantage'?Math.max(...dice):adv==='disadvantage'?Math.min(...dice):dice[0];const result=chosen+bonus;const line=`${label}: d20 [${dice.join(', ')}] ${signed(bonus)} = ${result}`;appendLog('Teste',line);$('rolledResults').textContent=line;msg(line)}
function assignSkills(){const cl=CLASSES[state.fields.className];if(!cl){$('skillFeedback').textContent='Selecione uma classe antes de distribuir.';return}
 const old=new Set(state.autoSkills);state.skillProfs=state.skillProfs.filter(x=>!old.has(x));state.autoSkills=[];
 const chosen=new Set(state.skillProfs),manualClassCount=cl.skills[1].filter(k=>chosen.has(k)).length,managed=[];
 const add=id=>{if(!chosen.has(id)){chosen.add(id);managed.push(id)}};
 const bg=BACKGROUNDS[state.fields.background]||[];bg.forEach(add);
 if(state.fields.race==='Elfo')add('perception');if(state.fields.race==='Meio-Orc')add('intimidation');
 const sorted=arr=>arr.filter(x=>!chosen.has(x)).sort((x,y)=>{const sx=SK.find(s=>s[0]===x),sy=SK.find(s=>s[0]===y);return (mod(sy?.[2])??-100)-(mod(sx?.[2])??-100)||x.localeCompare(y)});
 if(state.fields.race==='Meio-Elfo')sorted(SK.map(s=>s[0])).slice(0,2).forEach(add);
 for(const key of sorted(cl.skills[1]).slice(0,Math.max(0,cl.skills[0]-manualClassCount)))add(key);
 state.skillProfs=[...chosen];state.autoSkills=managed;document.querySelectorAll('[data-skill]').forEach(el=>el.checked=chosen.has(el.dataset.skill));$('skillFeedback').textContent=`Distribuição concluída: ${managed.length} novas proficiências. Revise escolhas raciais e da mesa.`;renderDerived();queueSave();}
function pointTotal(){return A.reduce((s,[k])=>s+COST[state.pointBuy[k]],0)}
function renderPointSummary(){const spent=pointTotal(),rem=27-spent;$('pointRemaining').textContent=rem+' / 27';$('pointRemaining').style.color=rem<0?'#ae403e':rem===0?'#20704c':''}
function toggleTab(id){document.querySelectorAll('.sheet-page').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));window.scrollTo({top:0,behavior:'instant'})}
function download(filename,body,type='application/json'){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function updateActive(){library[active]=state;renderSelect();queueSave()}
function newCharacter(duplicate=false){const next=duplicate?normalize(JSON.parse(JSON.stringify(state))):fresh();next.id=uid();if(duplicate)next.fields.name=(next.fields.name||'Personagem')+' (cópia)';active=next.id;state=next;library[active]=state;renderFields();save();msg(duplicate?'Ficha duplicada.':'Nova ficha criada.')}
function levelUpRecover(){renderDerived();queueSave()}
function shortRest(){const hp=calcHP();if(!hp){$('restResult').textContent='Preencha classe, nível e Constituição para descansar.';return}const count=safeInt($('restDiceCount').value),lv=level(),spent=Math.max(0,safeInt(state.fields.hitDiceSpent)),left=lv-spent;if(count<1||count>left){$('restResult').textContent=`Você tem ${left} Dado(s) de Vida disponível(is).`;return}
 const rolls=[];let heal=0;const multi=window.DNDV5?.levels?.(state),selectedDie=multi?.second?CLASSES[$('v5HitDieClass')?.value||state.fields.className]?.die||hp.die:hp.die;for(let i=0;i<count;i++){let d=rand(selectedDie);rolls.push(d);heal+=Math.max(0,d+(mod('con')||0))}
 const prev=n(state.fields.hpCurrent);state.fields.hpCurrent=Math.min(hp.total,prev+heal);state.fields.hitDiceSpent=spent+count;
 if(spellSlots().mode==='pact')state.slotsUsed.fill(0);window.DNDV5?.bonusApplyAfterRest?.(state,'short');
 $('restResult').textContent=`Descanso curto: dados [${rolls.join(', ')}] + CON por dado; recuperados até ${heal} PV. Agora ${state.fields.hpCurrent}/${hp.total} PV.`;renderFields();queueSave()}
function longRest(){const hp=calcHP();if(!hp){$('restResult').textContent='Preencha classe, nível e Constituição para descansar.';return}const l=level(),spent=Math.max(0,safeInt(state.fields.hitDiceSpent)),recover=Math.max(1,Math.floor(l/2));state.fields.hitDiceSpent=Math.max(0,spent-recover);state.fields.hpCurrent=hp.total;state.fields.hpTemp=0;state.deathSuccess=0;state.deathFailure=0;state.slotsUsed=Array(9).fill(0);window.DNDV5?.bonusApplyAfterRest?.(state,'long');
 $('restResult').textContent=`Descanso longo: PV restaurados para ${hp.total}; ${Math.min(spent,recover)} Dado(s) de Vida recuperado(s); espaços de magia restaurados.`;renderFields();queueSave()}
function currencyAdjust(){renderDerived();queueSave()}
function bindEvents(){
 document.addEventListener('input',e=>{const t=e.target;if(t.dataset.field){const k=t.dataset.field;setField(k,t.type==='checkbox'?t.checked:t.value);if(k==='name')renderSelect();renderDerived();queueSave()}
 else if(t.dataset.ability){state.abilities[t.dataset.ability]=t.value;renderDerived();queueSave()}
 else if(t.dataset.currency){state.currency[t.dataset.currency]=Math.max(0,n(t.value));currencyAdjust()}
 else if(t.dataset.spell!==undefined){state.spells[t.dataset.spell]=t.value;queueSave()}
 else if(t.dataset.slot){state.slotsUsed[Number(t.dataset.slot)-1]=Math.max(0,safeInt(t.value));renderDerived();queueSave()}
 else if(t.dataset.point){state.pointBuy[t.dataset.point]=Number(t.value);renderPointSummary();queueSave()}
 else if(t.dataset.attack){const row=state.attacks.find(a=>a.id===t.closest('tr').dataset.id);if(row){row[t.dataset.attack]=t.type==='checkbox'?t.checked:t.value;renderDerived();queueSave()}}
 else if(t.dataset.item){const row=state.items.find(a=>a.id===t.closest('tr').dataset.id);if(row){row[t.dataset.item]=t.value;renderDerived();queueSave()}}
 });
 document.addEventListener('change',e=>{const t=e.target;if(t.dataset.save){state.saves=toggleIn(state.saves,t.dataset.save,t.checked);renderDerived();queueSave()}
 else if(t.dataset.skill){state.skillProfs=toggleIn(state.skillProfs,t.dataset.skill,t.checked);state.autoSkills=state.autoSkills.filter(x=>x!==t.dataset.skill);renderDerived();queueSave()}
 else if(t.dataset.expert){state.expertise=toggleIn(state.expertise,t.dataset.expert,t.checked);renderDerived();queueSave()}
 else if(t.dataset.condition){state.conditions=toggleIn(state.conditions,t.dataset.condition,t.checked);queueSave()}
 else if(t.dataset.death){let kind=t.dataset.death==='Success'?'deathSuccess':'deathFailure';let number=Number(t.dataset.index)+1;state[kind]=t.checked?number:number-1;document.querySelectorAll(`[data-death="${t.dataset.death}"]`).forEach(el=>el.checked=Number(el.dataset.index)<state[kind]);queueSave()}
 });
 document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const key=t.dataset.key;
 if(t.dataset.action==='test-ability')rollTest('Teste de '+A.find(a=>a[0]===key)?.[1],mod(key));
 if(t.dataset.action==='test-save')rollTest('Resistência de '+A.find(a=>a[0]===key)?.[1],mod(key)===null?null:mod(key)+(state.saves.includes(key)?pb()||0:0));
 if(t.dataset.action==='test-skill')rollTest('Perícia '+SK.find(x=>x[0]===key)?.[1],derivedSkill(key));
 if(t.dataset.removeAttack){state.attacks=state.attacks.filter(a=>a.id!==t.dataset.removeAttack);renderAttacks();renderDerived();queueSave()}
 if(t.dataset.removeItem){state.items=state.items.filter(a=>a.id!==t.dataset.removeItem);renderItems();renderDerived();queueSave()}
 });
 document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>toggleTab(btn.dataset.tab)));
 $('characterSelect').addEventListener('change',e=>{if(!library[e.target.value])return;save();active=e.target.value;state=library[active];renderFields();save()});
 $('btnNew').onclick=()=>newCharacter();$('btnDuplicate').onclick=()=>newCharacter(true);
 $('btnDelete').onclick=()=>{if(Object.keys(library).length===1){msg('Crie outra ficha antes de excluir a última.');return}if(!confirm('Excluir esta ficha do armazenamento local? Exporte antes, se precisar.'))return;delete library[active];active=Object.keys(library)[0];state=library[active];renderFields();save();msg('Ficha excluída.')};
 $('btnExport').onclick=()=>download((state.fields.name||'ficha-dnd').replace(/[^a-zA-Z\d_á-úÁ-Ú\- ]/g,'_')+'.json',JSON.stringify(state,null,2));
 $('btnImport').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>3_000_000)throw Error('Arquivo muito grande.');const text=await file.text(),parsed=JSON.parse(text);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('JSON inválido.');const converted=normalize(parsed);converted.id=uid();state=converted;active=converted.id;library[active]=state;renderFields();save();msg('Ficha importada. Revise os dados.')}catch(err){msg('Não foi possível importar: '+err.message)}e.target.value=''};
 $('btnPrint').onclick=()=>window.print();
 $('rollAll').onclick=()=>{rolls=Array.from({length:6},()=>{const d=Array.from({length:4},()=>rand(6));return{dice:d,total:d.reduce((a,b)=>a+b,0)-Math.min(...d)}});$('rolledResults').textContent='Rolagens: '+rolls.map(x=>`${x.total} [${x.dice.join(', ')}]`).join(' · ')};
 $('standardArray').onclick=()=>{rolls=[15,14,13,12,10,8].map(v=>({total:v,dice:[]}));$('rolledResults').textContent='Valores padrão: 15, 14, 13, 12, 10, 8. Clique em distribuir.'};
 $('assignRolled').onclick=()=>{const cl=CLASSES[state.fields.className];if(!cl){msg('Selecione a classe antes de distribuir atributos.');return}if(rolls.length!==6){msg('Role 4d6 ou selecione os valores padrão primeiro.');return}const values=rolls.map(x=>x.total).sort((a,b)=>b-a);cl.priority.forEach((key,i)=>{state.abilities[key]=values[i]});renderFields();queueSave();$('rolledResults').textContent=`Atributos distribuídos para ${state.fields.className}. Ajustes raciais precisam ser aplicados separadamente.`};
 $('autoSkills').onclick=assignSkills;$('clearAutoSkills').onclick=()=>{state.skillProfs=state.skillProfs.filter(k=>!state.autoSkills.includes(k));state.autoSkills=[];document.querySelectorAll('[data-skill]').forEach(el=>el.checked=state.skillProfs.includes(el.dataset.skill));$('skillFeedback').textContent='Escolhas automáticas removidas; as manuais foram preservadas.';renderDerived();queueSave()};
 $('rollInitiative').onclick=()=>rollTest('Iniciativa',mod('dex')===null?null:mod('dex')+n(state.fields.initiativeExtra)+(window.DNDV5?.initBonus?.(state)||0));
 $('rollEnemyAttack').onclick=()=>{const ac=derivedAC();if(ac===null){msg('Informe Destreza ou a CA personalizada.');return}const b=n($('enemyBonus').value),d=rand(20),total=d+b,hit=d===20||(d!==1&&total>=ac);$('acResult').textContent=`Ataque recebido: d20 [${d}] ${signed(b)} = ${total} contra CA ${ac}: ${d===20?'ACERTO CRÍTICO':hit?'ACERTOU':'ERROU'}${d===1?' (1 natural)':''}.`;appendLog('Contra CA',$('acResult').textContent)};
 $('rollDefense').onclick=()=>{const dex=mod('dex');if(dex===null){msg('Informe Destreza para testar a defesa opcional.');return}const roll=rand(20),bonus=n($('defenseExtra').value),total=roll+dex+bonus;$('acResult').textContent=`DEFESA ATIVA (regra da casa): d20 [${roll}] + DES ${signed(dex)} + extra ${signed(bonus)} = ${total}. O Mestre determina o resultado.`;appendLog('Defesa opcional',$('acResult').textContent)};
 $('rollHp').onclick=()=>{if(state.fields.hpMethod!=='rolled'){msg('Escolha rolagens por nível para esta função.');return}state.hpRolls=[];state.hpLastMax=state.hpLastMax??null;renderDerived();queueSave();msg('PV por nível rolados novamente.')};
 $('restoreHp').onclick=()=>{const hp=calcHP();if(!hp){msg('Preencha classe, nível e Constituição.');return}state.fields.hpCurrent=hp.total;$('hpCurrent').value=hp.total;renderDerived();queueSave();msg('PV restaurados ao máximo.')};
 for(const [id,positive] of [['damageBtn',false],['healBtn',true]])$(id).onclick=()=>{const hp=calcHP(),amount=n($('damageAmount').value,NaN);if(!hp||!Number.isInteger(amount)||amount<=0){msg('Preencha os PV e uma quantidade positiva.');return}const cur=n(state.fields.hpCurrent);if(positive)state.fields.hpCurrent=Math.min(hp.total,cur+amount);else{const block=Math.min(Math.max(0,n(state.fields.hpTemp)),amount);state.fields.hpTemp=Math.max(0,n(state.fields.hpTemp)-block);state.fields.hpCurrent=Math.max(0,cur-amount+block)}$('hpCurrent').value=state.fields.hpCurrent;$('hpTemp').value=state.fields.hpTemp;renderDerived();queueSave();msg(positive?'Cura registrada.':'Dano registrado.')};
 $('addAttack').onclick=()=>{state.attacks.push({id:uid(),name:'',type:'str',damage:'1d8',prof:true});renderAttacks();renderDerived();queueSave()};
 $('addItem').onclick=()=>{state.items.push({id:uid(),name:'',qty:1,weight:0});renderItems();renderDerived();queueSave()};
 $('pointApply').onclick=()=>{if(pointTotal()!==27){$('pointFeedback').textContent='Distribua exatamente 27 pontos (restantes: '+(27-pointTotal())+').';return}for(const [key] of A)state.abilities[key]=state.pointBuy[key];renderFields();queueSave();$('pointFeedback').textContent='Valores aplicados, antes dos ajustes raciais.';msg('Atributos aplicados com 27 pontos.')};
 $('pointReset').onclick=()=>{for(const [key] of A)state.pointBuy[key]=8;renderFields();$('pointFeedback').textContent='Distribuição reiniciada.';queueSave()};
 $('shortRest').onclick=shortRest;$('longRest').onclick=longRest;
 $('rollDice').onclick=()=>{const r=rollExpression($('diceInput').value);$('diceResult').textContent=r.error||`${r.formula}: [${r.rolls.join(', ')}] → usados [${r.used.join(', ')}] ${signed(r.flat)} = ${r.total}`;if(!r.error)appendLog('Dados',$('diceResult').textContent)};
 $('clearLog').onclick=()=>{state.rollLog=[];drawLog();queueSave()};
 $('genNpc').onclick=()=>{const names=['Aelar','Bryn','Calia','Dorn','Helga','Iriel','Lyra','Neris','Rurik','Syl','Veya'];const jobs=['ferreiro(a)','curandeiro(a)','vigia','mercador(a)','explorador(a)','sacerdote','escriba'];$('npcResult').textContent=names[rand(names.length)-1]+' · '+jobs[rand(jobs.length)-1]};
 $('estimateEncounter').onclick=()=>{const l=n($('partyLevel').value),size=n($('partySize').value),xp=n($('encXP').value);if(l<1||l>20||size<1||xp<0){$('encResult').textContent='Nível 1–20, participantes positivos e XP válido.';return}const limits=[25,50,75,100].map(x=>x*l*size);const category=xp>=limits[3]?'Mortal':xp>=limits[2]?'Difícil':xp>=limits[1]?'Médio':xp>=limits[0]?'Fácil':'Trivial';$('encResult').textContent=category+' (estimativa simples, sem multiplicador por número de monstros).'};
 $('resetCurrent').onclick=()=>{if(!confirm('Limpar campos da ficha ativa? Essa ação não pode ser desfeita sem backup.'))return;const id=active;state=fresh();state.id=id;library[id]=state;renderFields();save();msg('Ficha limpa.')};
}
makeUI();firstLoad();bindEvents();renderFields();
window.DNDDebug={getState:()=>structuredClone(state),getMutableState:()=>state,recalc:()=>{renderFields();queueSave()},getHP:calcHP,getAC:derivedAC,getSlots:spellSlots,rollExpression,setField:setField,getClass:className=>CLASSES[className],getLevel:level};window.DND2014?.mount?.();
})();