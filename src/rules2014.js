/* Complemento 5e/2014 fundamentado no Livro do Jogador fornecido pelo usuário.
   Não substitui escolhas do Mestre, multiclasse, talentos ou variantes. */
(function(){
"use strict";
const A=["str","dex","con","int","wis","cha"];
const N={str:"Força",dex:"Destreza",con:"Constituição",int:"Inteligência",wis:"Sabedoria",cha:"Carisma"};
const R={
"Anão":{base:{con:2},sub:{"Colina":{wis:1},"Montanha":{str:2}}},
"Elfo":{base:{dex:2},sub:{"Alto Elfo":{int:1},"Floresta":{wis:1},"Drow":{cha:1}}},
"Halfling":{base:{dex:2},sub:{"Pés Leves":{cha:1},"Robusto":{con:1}}},
"Humano":{base:{str:1,dex:1,con:1,int:1,wis:1,cha:1},sub:{"Padrão":{},"Variante":{}}},
"Draconato":{base:{str:2,cha:1},sub:{"Padrão":{}}},
"Gnomo":{base:{int:2},sub:{"Floresta":{dex:1},"Rochas":{con:1}}},
"Meio-Elfo":{base:{cha:2},sub:{"Padrão":{}}},
"Meio-Orc":{base:{str:2,con:1},sub:{"Padrão":{}}},
"Tiefling":{base:{int:1,cha:2},sub:{"Padrão":{}}}
};
const KNOWN={
"Bardo":[4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],
"Bruxo":[2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
"Feiticeiro":[2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
"Patrulheiro":[0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]
};
const CANTRIPS={
"Bardo":[2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
"Bruxo":[2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
"Clérigo":[3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
"Druida":[2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
"Feiticeiro":[4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
"Mago":[3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5]
};
function raceBonus(f,a){
 if(!f||f.raceAuto===false)return 0;
 const r=R[f.race];if(!r)return 0;
 let v=(r.base[a]||0)+(r.sub[f.subrace||Object.keys(r.sub)[0]]?.[a]||0);
 if(f.race==="Meio-Elfo"&&(a===f.raceExtra1||a===f.raceExtra2))v++;
 if(f.race==="Humano"&&f.subrace==="Variante"){
   v=0;if(a===f.raceExtra1||a===f.raceExtra2)v++;
 }
 return v;
}
function healthExtra(f,lv,cl){
 let v=0;
 if(f?.raceAuto!==false&&f?.race==="Anão"&&f?.subrace==="Colina")v+=lv;
 if(f?.featTough)v+=2*lv;
 if(f?.draconicSoul&&cl==="Feiticeiro")v+=lv;
 return v;
}
function guide(cl,lv,stat){
 if(!cl||!lv)return "Selecione classe, nível e o atributo de conjuração.";
 const mod=stat===null?null:Math.floor((stat-10)/2);
 const caster=["Clérigo","Druida","Mago","Paladino"].includes(cl);
 let lines=[];
 if(CANTRIPS[cl])lines.push("Truques conhecidos pela classe: "+CANTRIPS[cl][lv-1]+".");
 if(KNOWN[cl])lines.push("Magias conhecidas pela classe: "+KNOWN[cl][lv-1]+".");
 if(caster&&(cl!=="Paladino"||lv>=2)){
   const base=cl==="Paladino"?Math.floor(lv/2):lv;
   lines.push("Magias que pode preparar: "+(mod===null?"preencha o atributo de conjuração":Math.max(1,base+mod))+".");
 }
 if(cl==="Bruxo"&&lv>=11)lines.push("Arcanos Místicos: nível 6 aos 11, 7 aos 13, 8 aos 15 e 9 aos 17 (1 conjuração por descanso longo para cada arcano disponível).");
 if(["Guerreiro","Ladino"].includes(cl))lines.push("Conjuração depende da subclasse; configure o modo de 1/3 conjurador quando aplicável.");
 if(!lines.length)lines.push("Esta classe não recebe conjuração pela classe básica neste nível.");
 lines.push("Talentos, domínios, círculos e outras características podem alterar o total.");
 return lines.join(" ");
}
const $=id=>document.getElementById(id);
const el=(tag,html)=>{const a=document.createElement(tag);a.innerHTML=html;return a};
let mounted=false;
function state(){return window.DNDDebug?.getMutableState?.()}
function renderSubrace(f){
 const s=$("ruleSubrace");if(!s)return;
 const r=R[f.race],all=r?Object.keys(r.sub):[];
 const current=f.subrace||all[0]||"";
 s.innerHTML=all.map(x=>'<option value="'+x+'">'+x+'</option>').join("");
 if(all.includes(current))s.value=current;
 if(!all.includes(f.subrace))f.subrace=current;
}
function refresh(){
 const s=state();if(!s||!mounted)return;
 const f=s.fields;
 renderSubrace(f);
 ["raceAuto","featTough","draconicSoul"].forEach(k=>{const node=$("rule-"+k);if(node)node.checked=f[k]!==false&&(k==="raceAuto"||!!f[k])});
 ["raceExtra1","raceExtra2"].forEach((k,i)=>{const node=$("rule-"+k);if(node)node.value=f[k]||["dex","con"][i]});
 const extra=$("raceChoices");if(extra)extra.hidden=!(f.race==="Meio-Elfo"||(f.race==="Humano"&&f.subrace==="Variante"));
 const bonuses=A.map(a=>N[a]+" "+(raceBonus(f,a)>=0?"+":"")+raceBonus(f,a)).filter(x=>!x.endsWith("+0"));
 $("racePreview").textContent=f.raceAuto===false?"Bônus raciais automáticos desligados (para evitar duplicação em fichas importadas).":bonuses.join(" · ")||"Sem bônus racial.";
 $("racialNotes").textContent=f.race==="Elfo"&&f.subrace==="Drow"?"Drow: sensibilidade à luz solar.":f.race==="Anão"&&f.subrace==="Colina"?"Anão da colina: +1 PV máximo por nível.":f.race==="Humano"&&f.subrace==="Variante"?"Humano variante: além dos 2 aumentos, escolha uma perícia e um talento (registrados manualmente).":"";
 const lvl=Number(f.level),cl=f.className;
 const casting=f.castAbility||({Mago:"int",Clérigo:"wis",Druida:"wis",Paladino:"cha",Patrulheiro:"wis",Bardo:"cha",Bruxo:"cha",Feiticeiro:"cha"}[cl]);
 const score=casting?s.abilities[casting]:null;
 const effective=casting&&score!==""&&score!==undefined&&score!==null?Number(score)+raceBonus(f,casting):null;
 $("preparedGuide").textContent=guide(cl,Number.isInteger(lvl)&&lvl>=1&&lvl<=20?lvl:null,effective);
 let hpCalc=window.DNDDebug?.getHP?.();
 $("racialHpBonus").textContent=hpCalc?"PV calculados: "+hpCalc.total+". Inclui ajustes raciais/talentos selecionados.":"PV pendentes: informe classe, nível e Constituição.";
}
function emitField(id,value){
 const node=$(id);if(!node)return;
 if(node.type==="checkbox")node.checked=!!value;else node.value=value;
 node.dispatchEvent(new Event("input",{bubbles:true}));
 node.dispatchEvent(new Event("change",{bubbles:true}));
}
function rollSaving(){
 const s=state(),f=s?.fields;
 if(!s)return;
 if(f.hpCurrent!==""&&Number(f.hpCurrent)>0){$("deathRollResult").textContent="Resistências contra a morte só são roladas com 0 PV.";return}
 const d=1+Math.floor(Math.random()*20);
 let result="";
 if(d===20){f.hpCurrent=1;s.deathSuccess=0;s.deathFailure=0;result="20 natural: recupera 1 PV e volta à consciência."}
 else{if(d===1){s.deathFailure=Math.min(3,s.deathFailure+2);result="1 natural: duas falhas."}
 else if(d>=10){s.deathSuccess=Math.min(3,s.deathSuccess+1);result="Sucesso."}
 else{s.deathFailure=Math.min(3,s.deathFailure+1);result="Falha."}
 if(s.deathSuccess>=3){s.deathSuccess=0;s.deathFailure=0;result+=" Estabilizado."}
 if(s.deathFailure>=3)result+=" Três falhas: morte (segundo regras gerais).";
 }
 $("deathRollResult").textContent="Dado d20: "+d+". "+result;
 window.DNDDebug?.recalc?.();
}
function rollConcentration(){
 const s=state(),f=s?.fields;if(!s)return;
 const dmg=Number($("concDamage").value);
 if(!Number.isFinite(dmg)||dmg<=0){$("concResult").textContent="Insira o dano sofrido.";return}
 const score=s.abilities.con;
 if(score===""||score===undefined){$("concResult").textContent="Preencha Constituição.";return}
 const mod=Math.floor((Number(score)+raceBonus(f,"con")-10)/2);
 const prof=(s.saves||[]).includes("con")?(2+Math.floor((Math.max(1,Number(f.level)||1)-1)/4)):0;
 const dc=Math.max(10,Math.floor(dmg/2)),die=1+Math.floor(Math.random()*20),total=die+mod+prof;
 $("concResult").textContent="Concentração: CD "+dc+"; d20 ["+die+"] + "+(mod+prof)+" = "+total+" → "+(total>=dc?"mantida":"perdida")+".";
}
function mount(){
 if(mounted||!$("race")||!$("spellNote"))return;mounted=true;
 const racial=el("section",'<h2>Origem e sub-raça · Livro do Jogador 2014</h2><div class="rule-grid">'+
 '<label>Sub-raça<select id="ruleSubrace"></select></label>'+
 '<label class="rule-check"><input id="rule-raceAuto" type="checkbox"> Somar bônus raciais automaticamente</label>'+
 '<div id="raceChoices" class="rule-grid"><label>1º atributo adicional<select id="rule-raceExtra1">'+A.map(a=>'<option value="'+a+'">'+N[a]+'</option>').join("")+'</select></label>'+
 '<label>2º atributo adicional<select id="rule-raceExtra2">'+A.map(a=>'<option value="'+a+'">'+N[a]+'</option>').join("")+'</select></label></div></div>'+
 '<p class="rule-meta" id="racePreview"></p><p class="rule-meta" id="racialNotes"></p>'+
 '<p class="rule-meta">Os valores digitados na coluna de atributos são <b>valores base</b>; a ficha soma os bônus de raça/sub-raça ao modificador.</p>');
 racial.id="racialRules";racial.className="panel rule-panel";
 $("race").closest(".identity")?.insertAdjacentElement("afterend",racial);
 const hp=el("div",'<h3>Exceções de PV</h3><label class="rule-check"><input id="rule-featTough" type="checkbox"> Talento Resistente (Durão): +2 PV por nível</label>'+
 '<label class="rule-check"><input id="rule-draconicSoul" type="checkbox"> Feiticeiro: Linhagem Dracônica (+1 PV por nível)</label>'+
 '<p id="racialHpBonus" class="rule-meta"></p>');
 hp.className="rule-extras";$("hpFormula").insertAdjacentElement("afterend",hp);
 const spell=el("div",'<h3>Limites de conjuração (2014)</h3><p id="preparedGuide" class="rule-meta"></p>');spell.className="rule-extras";$("spellNote").insertAdjacentElement("afterend",spell);
 const death=el("div",'<button id="rollDeathSave" type="button">🎲 Rolar resistência contra a morte</button><p id="deathRollResult" class="rule-meta"></p>');
 death.className="rule-extras";$("deathFailure").closest(".death-wrap").insertAdjacentElement("afterend",death);
 const conc=el("article",'<h2>Concentração e resistência de Constituição</h2><p class="rule-meta">Após sofrer dano mantendo concentração, faça um teste de resistência de Constituição contra CD 10 ou metade do dano, o maior.</p>'+
 '<label>Dano sofrido<input id="concDamage" type="number" min="1" value="12"></label><button id="rollConcentration" type="button">🎲 Testar concentração</button>'+
 '<p id="concResult" class="rule-meta"></p>');
 conc.className="panel";$("tools").querySelector(".story-grid")?.appendChild(conc);
 const css=document.createElement("style");css.textContent='.rule-panel{margin:12px 0;padding:14px}.rule-panel h2,.rule-extras h3{font:bold 13px Arial;letter-spacing:.04em}.rule-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.rule-check{display:flex!important;align-items:center;gap:8px;font:12px Arial!important}.rule-check input{width:17px;height:17px}.rule-meta{font-size:12px;color:#52605b;line-height:1.6}.rule-extras{margin:10px 0;padding:11px;background:#f5f7f4;border:1px solid #cbd3ce;border-radius:7px}@media(max-width:620px){.rule-grid{grid-template-columns:1fr}}@media print{.rule-panel{break-inside:avoid}.rule-extras button,.rule-extras input{display:none!important}}';
 document.head.appendChild(css);
 $("ruleSubrace").addEventListener("change",e=>{const s=state();s.fields.subrace=e.target.value;if(s.fields.race==="Elfo"&&s.fields.subrace==="Floresta")emitField("speed",10.5);else if(s.fields.race&&["Elfo","Humano","Meio-Elfo","Meio-Orc","Tiefling","Draconato"].includes(s.fields.race))emitField("speed",9);window.DNDDebug?.recalc?.()});
 ["raceAuto","featTough","draconicSoul"].forEach(k=>$("rule-"+k).addEventListener("change",e=>{state().fields[k]=e.target.checked;window.DNDDebug?.recalc?.()}));
 ["raceExtra1","raceExtra2"].forEach(k=>$("rule-"+k).addEventListener("change",e=>{const f=state().fields;const other=k==="raceExtra1"?"raceExtra2":"raceExtra1";if(e.target.value===f[other]){e.target.value=f[k]||"";return}if(f.race==="Meio-Elfo"&&e.target.value==="cha"){e.target.value=f[k]||"";return}f[k]=e.target.value;window.DNDDebug?.recalc?.()}));
 $("rollDeathSave").addEventListener("click",rollSaving);
 $("rollConcentration").addEventListener("click",rollConcentration);
 document.getElementById("race").addEventListener("change",()=>{const f=state()?.fields;if(!f)return;f.subrace="";refresh();window.DNDDebug?.recalc?.()});
 refresh();
}
window.DND2014={raceBonus,healthExtra,guide,mount,refresh};
})();