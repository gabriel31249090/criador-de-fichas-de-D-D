/* Ficha D&D 5e (2014) - V5. Regras gerais, metadados resumidos e decisões explícitas.
   Base: Livro do Jogador 2014 fornecido pelo usuário. Não reproduz descrições integrais de magias.
   Hooks da V4: DNDDebug; persistência continua na biblioteca da V4. */
(()=>{'use strict';
const $=id=>document.getElementById(id), D=()=>window.DNDDebug, st=()=>D()?.getMutableState(), f=()=>st().fields;
const AB=['str','dex','con','int','wis','cha'],ABIL={str:'Força',dex:'Destreza',con:'Constituição',int:'Inteligência',wis:'Sabedoria',cha:'Carisma'};
const CLASSES=['Bárbaro','Bardo','Bruxo','Clérigo','Druida','Feiticeiro','Guerreiro','Ladino','Mago','Monge','Paladino','Patrulheiro'];
const DICE={'Bárbaro':12,'Bardo':8,'Bruxo':8,'Clérigo':8,'Druida':8,'Feiticeiro':6,'Guerreiro':10,'Ladino':8,'Mago':6,'Monge':8,'Paladino':10,'Patrulheiro':10};
const SUBS={
'Bárbaro':{at:3,choices:['Berserker','Guerreiro Totêmico']},'Bardo':{at:3,choices:['Colégio do Conhecimento','Colégio da Bravura']},
'Bruxo':{at:1,choices:['Arquifada','Corruptor','Grande Antigo']},'Clérigo':{at:1,choices:['Conhecimento','Vida','Luz','Natureza','Tempestade','Trapaça','Guerra']},
'Druida':{at:2,choices:['Círculo da Terra','Círculo da Lua']},'Feiticeiro':{at:1,choices:['Linhagem Dracônica','Magia Selvagem']},
'Guerreiro':{at:3,choices:['Campeão','Mestre de Batalha','Cavaleiro Arcano']},'Ladino':{at:3,choices:['Ladrão','Assassino','Trapaceiro Arcano']},
'Mago':{at:2,choices:['Abjuração','Conjuração','Adivinhação','Encantamento','Evocação','Ilusão','Necromancia','Transmutação']},
'Monge':{at:3,choices:['Mão Aberta','Sombra','Quatro Elementos']},'Paladino':{at:3,choices:['Devoção','Ancestrais','Vingança']},
'Patrulheiro':{at:3,choices:['Caçador','Mestre das Feras']}
};
const SUB_FEATURES={
'Campeão':[[3,'Crítico Aprimorado: crítico em 19–20'],[7,'Atleta Extraordinário'],[10,'Segundo Estilo de Luta'],[15,'Crítico Superior: 18–20'],[18,'Sobrevivente']],
'Mestre de Batalha':[[3,'Manobras e Dados de Superioridade (4d8)'],[7,'Conheça o Inimigo'],[10,'Superioridade Aprimorada (d10)'],[15,'Implacável'],[18,'Superioridade Aprimorada (d12)']],
'Cavaleiro Arcano':[[3,'Conjuração de 1/3 e vínculo com arma'],[7,'Magia de Guerra'],[10,'Golpe Místico'],[15,'Investida Arcana'],[18,'Magia de Guerra Aprimorada']],
'Trapaceiro Arcano':[[3,'Conjuração de 1/3 e Mão Mágica habilidosa'],[9,'Emboscada Mágica'],[13,'Trapaceiro Versátil'],[17,'Ladrão de Magia']],
'Linhagem Dracônica':[[1,'Resiliência Dracônica: CA 13+DES sem armadura e +1 PV/nível'],[6,'Afinidade Elemental'],[14,'Asas de Dragão'],[18,'Presença Dracônica']],
'Círculo da Lua':[[2,'Forma Selvagem de combate'],[6,'Ataques Primordiais'],[10,'Forma Elemental'],[14,'Mil Formas']],
'Assassino':[[3,'Assassinar e ferramentas de disfarce'],[9,'Especialista em Infiltração'],[13,'Impostor'],[17,'Golpe Mortal']],
'Ladrão':[[3,'Mãos Rápidas e Escalada'],[9,'Furtividade Suprema'],[13,'Usar Dispositivo Mágico'],[17,'Reflexos de Ladrão']],
'Conhecimento':[[1,'Bênção do Conhecimento'],[2,'Canalizar Divindade: Conhecimento das Eras'],[6,'Ler Pensamentos'],[8,'Conjuração Potente'],[17,'Visões do Passado']],
'Vida':[[1,'Discípulo da Vida e armadura pesada'],[2,'Canalizar Divindade: Preservar a Vida'],[6,'Curandeiro Abençoado'],[8,'Ataque Divino'],[17,'Cura Suprema']]
};
const FEATS=[
{name:'Robusto',prereq:'',detail:'+2 PV por nível (incluindo níveis anteriores).',auto:'tough'},
{name:'Alerta',detail:'+5 iniciativa; imune a surpresa consciente.',auto:'alert'},
{name:'Observador',detail:'+5 percepção e investigação passivas; +1 INT ou SAB à escolha.',stat:true,auto:'observant'},
{name:'Resiliente',detail:'+1 em um atributo escolhido, e proficiência em sua resistência.',stat:true,auto:'resilient'},
{name:'Atleta',detail:'+1 FOR ou DES; melhora movimentos.',stat:true},
{name:'Ator',detail:'+1 CAR; talento de disfarce e atuação.',stat:true},
{name:'Combatente Montado',detail:'Benefícios quando montado; condições de combate manuais.'},
{name:'Especialista em Besta',detail:'Benefícios com bestas; regras de ataques condicionais.'},
{name:'Franco-atirador',detail:'Cobertura e distância; ajuste de ataque opcional condicionado.'},
{name:'Mestre de Armas Grandes',detail:'Ataque pesado com opção -5/+10 e bônus condicional.'},
{name:'Mestre de Armas de Haste',detail:'Ataque adicional e reação com armas específicas.'},
{name:'Mestre de Escudos',detail:'Opções de empurrão e resistência condicionais.'},
{name:'Mestre de Armaduras Pesadas',detail:'+1 FOR e redução de dano situacional.',stat:true},
{name:'Mestre de Armaduras Médias',detail:'Ajustes na CA de armaduras médias e furtividade.'},
{name:'Iniciado em Magia',detail:'Aprenda truques e uma magia, conforme classe escolhida.'},
{name:'Conjurador de Guerra',detail:'Benefícios de concentração, componentes e ataques de oportunidade.'},
{name:'Sortudo',detail:'Três pontos de sorte por descanso longo.',resource:'Sorte:3:long'},
{name:'Curandeiro',detail:'Permite cura adicional com kit (uso controlado pelo Mestre).'},
{name:'Explorador de Masmorras',detail:'Melhora certos testes e exploração.'},
{name:'Perito',detail:'Ganhos de proficiências; configure as escolhas na ficha.'},
{name:'Tenaz',detail:'Aumenta pontos de vida recuperados por Dados de Vida.',stat:true},
{name:'Duelista Defensivo',detail:'Reação de defesa situacional com arma adequada.'}
];
// Valores em metros / quilogramas e dano em dados, tomando tabela de equipamentos do PHB 2014 como referência.
const GEAR=[
['Adaga','arma',.5,'1d4','dex','perfurante',2],['Espada curta','arma',1,'1d6','dex','perfurante',10],
['Espada longa','arma',1.5,'1d8','str','cortante',15],['Espada grande','arma',3,'2d6','str','cortante',50],
['Machado de batalha','arma',2,'1d8','str','cortante',10],['Machado grande','arma',3.5,'1d12','str','cortante',30],
['Maça','arma',2,'1d6','str','concussão',5],['Clava','arma',1,'1d4','str','concussão',.1],
['Cajado','arma',2,'1d6','str','concussão',.2],['Lança','arma',1.5,'1d6','str','perfurante',1],
['Arco curto','arma',1,'1d6','dex','perfurante',25],['Arco longo','arma',1,'1d8','dex','perfurante',50],
['Besta leve','arma',2.5,'1d8','dex','perfurante',25],['Martelo de guerra','arma',1,'1d8','str','concussão',15],
['Sem armadura','armadura',0,'','','',0],['Acolchoada','armadura',4,'','','',5],['Couro','armadura',5,'','','',10],
['Couro batido','armadura',6.5,'','','',45],['Peles','armadura',6,'','','',10],['Camisão de malha','armadura',10,'','','',50],
['Brunea','armadura',22.5,'','','',50],['Peitoral','armadura',10,'','','',400],['Meia armadura','armadura',20,'','','',750],
['Cota de anéis','armadura',20,'','','',30],['Cota de malha','armadura',27.5,'','','',75],
['Cota de talas','armadura',30,'','','',200],['Armadura de placas','armadura',32.5,'','','',1500],
['Escudo','escudo',3,'','','',10],['Mochila','item',2.5,'','','',2],['Corda de cânhamo (15 m)','item',5,'','','',1],
['Tocha','item',.5,'','','',.01],['Rações (1 dia)','item',1,'','','',.5],['Poção de cura','item',.25,'2d4+2','', '',50],
['Kit de aventureiro','item',27,'','','',12]
];
// Grimório não reproduz textos comerciais. Índice compacto, ampliável pelo próprio jogador.
// Formato: nome, nível, escola, classes, concentração, ritual, componentes, resumo original.
const SPELLS=[
['Luz',0,'Evocação','Clérigo,Mago,Feiticeiro',0,0,'V,M','Ilumina um objeto tocado.'],
['Prestidigitação',0,'Transmutação','Bardo,Mago,Bruxo,Feiticeiro',0,0,'V,S','Pequenos efeitos mágicos de utilidade.'],
['Raio de Gelo',0,'Evocação','Mago,Feiticeiro',0,0,'V,S','Dano frio e redução de deslocamento.'],
['Rajada Mística',0,'Evocação','Bruxo',0,0,'V,S','Ataque mágico de força a distância.'],
['Chama Sagrada',0,'Evocação','Clérigo',0,0,'V,S','Teste de resistência e dano radiante.'],
['Orientação',0,'Adivinhação','Clérigo,Druida',1,0,'V,S','Ajuda breve em um teste de habilidade.'],
['Zombaria Viciosa',0,'Encantamento','Bardo',0,0,'V','Dano psíquico e desvantagem situacional.'],
['Mãos Mágicas',0,'Conjuração','Bardo,Mago,Bruxo,Feiticeiro',0,0,'V,S','Cria uma mão espectral para manipular objetos.'],
['Consertar',0,'Transmutação','Bardo,Clérigo,Druida,Mago,Feiticeiro',0,0,'V,S,M','Repara dano simples em objeto.'],
['Bola de Fogo',3,'Evocação','Mago,Feiticeiro',0,0,'V,S,M','Explosão de fogo com dano em área.'],
['Mísseis Mágicos',1,'Evocação','Mago,Feiticeiro',0,0,'V,S','Projéteis mágicos atingem automaticamente alvos válidos.'],
['Armadura Arcana',1,'Abjuração','Mago,Feiticeiro',0,0,'V,S,M','Define CA básica sem armadura em 13 + DES.'],
['Escudo Arcano',1,'Abjuração','Mago,Feiticeiro',0,0,'V,S','Reação defensiva que altera a CA temporariamente.'],
['Detectar Magia',1,'Adivinhação','Bardo,Clérigo,Druida,Mago,Paladino,Patrulheiro,Feiticeiro',1,1,'V,S','Percebe efeitos mágicos nas proximidades.'],
['Curar Ferimentos',1,'Evocação','Bardo,Clérigo,Druida,Paladino,Patrulheiro',0,0,'V,S','Recupera PV de criatura tocada.'],
['Palavra Curativa',1,'Evocação','Bardo,Clérigo,Druida',0,0,'V','Cura limitada a distância.'],
['Sono',1,'Encantamento','Bardo,Mago,Feiticeiro',0,0,'V,S,M','Pode adormecer criaturas segundo total rolado.'],
['Bênção',1,'Encantamento','Clérigo,Paladino',1,0,'V,S,M','Melhora ataques e resistências de aliados.'],
['Maldição',1,'Encantamento','Clérigo,Paladino',1,0,'V,S,M','Penaliza ações de criaturas alvo.'],
['Névoa Obscurecente',1,'Conjuração','Druida,Patrulheiro,Mago,Feiticeiro',1,0,'V,S','Cria área de obscurecimento.'],
['Enredar',1,'Conjuração','Druida',1,0,'V,S','Plantas restringem movimentos em uma área.'],
['Compreender Idiomas',1,'Adivinhação','Bardo,Bruxo,Mago,Feiticeiro',0,1,'V,S,M','Entende o significado literal de idiomas.'],
['Armadura de Agathys',1,'Abjuração','Bruxo',0,0,'V,S,M','PV temporários e retaliação por frio.'],
['Passos Longos',1,'Transmutação','Bardo,Druida,Mago,Patrulheiro',0,0,'V,S,M','Aumenta deslocamento temporariamente.'],
['Proteção Contra o Bem e o Mal',1,'Abjuração','Clérigo,Mago,Paladino,Bruxo',1,0,'V,S,M','Defesa contra categorias especiais de criatura.'],
['Identificação',1,'Adivinhação','Bardo,Mago',0,1,'V,S,M','Examina propriedades de objetos mágicos.'],
['Teia',2,'Conjuração','Mago,Feiticeiro',1,0,'V,S,M','Cria terreno restritivo.'],
['Invisibilidade',2,'Ilusão','Bardo,Bruxo,Mago,Feiticeiro',1,0,'V,S,M','Alvo fica invisível até condição de término.'],
['Passo Nebuloso',2,'Conjuração','Bruxo,Mago,Feiticeiro',0,0,'V','Teletransporte curto.'],
['Raio Ardente',2,'Evocação','Mago,Feiticeiro',0,0,'V,S','Múltiplos ataques de fogo.'],
['Oração Curativa',2,'Evocação','Clérigo',0,0,'V','Cura várias criaturas fora do combate imediato.'],
['Restauração Menor',2,'Abjuração','Bardo,Clérigo,Druida,Paladino,Patrulheiro',0,0,'V,S','Encerra uma condição específica.'],
['Auxílio',2,'Abjuração','Clérigo,Paladino',0,0,'V,S,M','Aumenta PV máximos e atuais temporariamente.'],
['Silêncio',2,'Ilusão','Bardo,Clérigo,Patrulheiro',1,1,'V,S','Cria área sem som.'],
['Levitação',2,'Transmutação','Mago,Feiticeiro',1,0,'V,S,M','Eleva criatura ou objeto.'],
['Contramágica',3,'Abjuração','Bruxo,Mago,Feiticeiro',0,0,'S','Reação que interrompe conjuração.'],
['Dissipar Magia',3,'Abjuração','Bardo,Clérigo,Druida,Mago,Paladino,Bruxo,Feiticeiro',0,0,'V,S','Termina efeitos mágicos válidos.'],
['Revivificar',3,'Necromancia','Clérigo,Paladino',0,0,'V,S,M','Restaura vida em janela temporal restrita.'],
['Padrão Hipnótico',3,'Ilusão','Bardo,Bruxo,Mago,Feiticeiro',1,0,'S,M','Afeta criaturas que observam área colorida.'],
['Velocidade',3,'Transmutação','Mago,Feiticeiro',1,0,'V,S,M','Melhora movimentação e combate temporariamente.'],
['Lentidão',3,'Transmutação','Mago,Feiticeiro',1,0,'V,S,M','Reduz eficácia de criaturas afetadas.'],
['Relâmpago',3,'Evocação','Mago,Feiticeiro',0,0,'V,S,M','Dano elétrico em linha.'],
['Guardião Espiritual',3,'Conjuração','Clérigo',1,0,'V,S,M','Área protetora que fere inimigos.'],
['Porta Dimensional',4,'Conjuração','Bardo,Bruxo,Mago,Feiticeiro',0,0,'V','Teletransporte entre dois lugares válidos.'],
['Invisibilidade Maior',4,'Ilusão','Bardo,Mago,Feiticeiro',1,0,'V,S','Invisibilidade resistente a ações comuns.'],
['Polimorfia',4,'Transmutação','Bardo,Druida,Mago,Feiticeiro',1,0,'V,S,M','Transforma criatura, mudando estatísticas.'],
['Banimento',4,'Abjuração','Clérigo,Paladino,Bruxo,Mago,Feiticeiro',1,0,'V,S,M','Desloca alvo para outro plano temporariamente.'],
['Escudo de Fogo',4,'Evocação','Mago',0,0,'V,S,M','Resistência situacional e dano de retaliação.'],
['Cone de Frio',5,'Evocação','Mago,Feiticeiro',0,0,'V,S,M','Dano de frio em cone.'],
['Muralha de Força',5,'Evocação','Mago',1,0,'V,S,M','Barreira invisível de energia.'],
['Curar Ferimentos em Massa',5,'Evocação','Bardo,Clérigo,Druida',0,0,'V,S','Recupera PV de vários alvos.'],
['Ressurreição dos Mortos',5,'Necromancia','Bardo,Clérigo',0,0,'V,S,M','Traz criatura morta de volta sob condições.'],
['Telecinese',5,'Transmutação','Mago,Feiticeiro',1,0,'V,S','Move alvos com força mental.'],
['Desintegrar',6,'Transmutação','Mago,Feiticeiro',0,0,'V,S,M','Raio de força com dano elevado.'],
['Cura',6,'Evocação','Clérigo,Druida',0,0,'V,S','Recupera muitos PV de um alvo.'],
['Globo de Invulnerabilidade',6,'Abjuração','Mago,Feiticeiro',1,0,'V,S,M','Proteção contra magias de níveis inferiores.'],
['Viagem Planar',7,'Conjuração','Clérigo,Druida,Mago,Bruxo,Feiticeiro',0,0,'V,S,M','Deslocamento entre planos.'],
['Teletransporte',7,'Conjuração','Bardo,Mago,Feiticeiro',0,0,'V','Transporte à distância de grupo e objetos.'],
['Regeneração',7,'Transmutação','Bardo,Clérigo,Druida',0,0,'V,S,M','Recuperação contínua e partes do corpo.'],
['Labirinto',8,'Conjuração','Mago',1,0,'V,S','Isola alvo em labirinto extradimensional.'],
['Palavra de Poder Atordoar',8,'Encantamento','Bardo,Bruxo,Mago,Feiticeiro',0,0,'V','Atordoa criatura sob limite de PV.'],
['Explosão Solar',8,'Evocação','Druida,Mago,Feiticeiro',0,0,'V,S,M','Dano radiante em grande área.'],
['Desejo',9,'Conjuração','Mago,Feiticeiro',0,0,'V','Reproduz efeitos mágicos e pedidos extraordinários.'],
['Parar o Tempo',9,'Transmutação','Mago,Feiticeiro',0,0,'V','Concede ações em tempo suspenso.'],
['Ressurreição Verdadeira',9,'Necromancia','Clérigo,Druida',0,0,'V,S,M','Restaura criatura morta sob condições especiais.'],
['Palavra de Poder Matar',9,'Encantamento','Bardo,Bruxo,Mago,Feiticeiro',0,0,'V','Mata alvo abaixo de um limiar de PV.']
];
const PREREQ={'Bárbaro':{str:13},'Bardo':{cha:13},'Bruxo':{cha:13},'Clérigo':{wis:13},'Druida':{wis:13},'Feiticeiro':{cha:13},'Guerreiro':{str:13,dex:13,one:true},'Ladino':{dex:13},'Mago':{int:13},'Monge':{dex:13,wis:13},'Paladino':{str:13,cha:13},'Patrulheiro':{dex:13,wis:13}};
const SLOTS=[ [0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1] ];
const ASI={'Bárbaro':[4,8,12,16,19],'Bardo':[4,8,12,16,19],'Bruxo':[4,8,12,16,19],'Clérigo':[4,8,12,16,19],'Druida':[4,8,12,16,19],'Feiticeiro':[4,8,12,16,19],'Guerreiro':[4,6,8,12,14,16,19],'Ladino':[4,8,10,12,16,19],'Mago':[4,8,12,16,19],'Monge':[4,8,12,16,19],'Paladino':[4,8,12,16,19],'Patrulheiro':[4,8,12,16,19]};
const XP=[0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=(x,d=0)=>x===''||x==null||!Number.isFinite(Number(x))?d:Number(x);
const id=()=>('v5-'+Date.now()+'-'+Math.random().toString(36).slice(2));
function addState(s){if(!s.v5||typeof s.v5!=='object')s.v5={};const v=s.v5;v.primaryLevel=Number.isInteger(v.primaryLevel)?v.primaryLevel:(n(s.fields.level,0)||1);v.secondaryClass=v.secondaryClass||'';v.secondaryLevel=n(v.secondaryLevel,0);v.subclasses=v.subclasses||{};v.feats=Array.isArray(v.feats)?v.feats:[];v.asi=Array.isArray(v.asi)?v.asi:[];v.gearChoices=Array.isArray(v.gearChoices)?v.gearChoices:[];v.resources=Array.isArray(v.resources)?v.resources:[];v.customSpells=Array.isArray(v.customSpells)?v.customSpells:[];v.selectedSpells=Array.isArray(v.selectedSpells)?v.selectedSpells:[];v.wizardStep=Math.min(5,Math.max(0,n(v.wizardStep,0)));v.spellFilter=v.spellFilter||'';v.classHistory=v.classHistory||[];return v}
function ability(s,a){const x=s.abilities[a];if(x===''||x==null)return null;return n(x)+(window.DND2014?.raceBonus?.(s.fields,a)||0)+abilityBonus(s,a)}
function abilityBonus(s,a){const v=addState(s),raw=s.abilities[a];if(raw===''||raw==null)return 0;const desired=v.feats.reduce((sum,feat)=>sum+(feat.stat===a?1:0),0),racial=window.DND2014?.raceBonus?.(s.fields,a)||0;return Math.min(desired,Math.max(0,20-n(raw)-racial))}
function mod(s,a){const x=ability(s,a);return x===null?null:Math.floor((x-10)/2)}
function initBonus(s){return addState(s).feats.some(x=>x.name==='Alerta')?5:0}
function thirdCaster(s,cl){const x=addState(s).subclasses[cl];return (cl==='Guerreiro'&&x==='Cavaleiro Arcano')||(cl==='Ladino'&&x==='Trapaceiro Arcano')}
function passiveBonus(s,k){return addState(s).feats.some(x=>x.name==='Observador')&&['perception','investigation'].includes(k)?5:0}
function levels(s){const v=addState(s),total=Math.max(1,Math.floor(n(s.fields.level,1)));let second=v.secondaryClass&&v.secondaryClass!==s.fields.className?Math.max(0,Math.floor(v.secondaryLevel)):0;second=Math.min(second,total-1);return {total,primary:total-second,second,main:s.fields.className,other:v.secondaryClass}}
function canMulticlass(s,to){const from=s.fields.className,needs=[from,to].map(k=>PREREQ[k]);const missing=[];for(let i=0;i<needs.length;i++){const rule=needs[i];if(!rule)continue;const req=Object.entries(rule).filter(([a])=>a!=='one');if(rule.one){if(!req.some(([a,min])=>(ability(s,a)||0)>=min))missing.push((i?'Destino':'Origem')+': FOR ou DES 13')}else req.forEach(([a,min])=>{if((ability(s,a)||0)<min)missing.push((i?'Destino':'Origem')+': '+ABIL[a]+' '+min)})}return {ok:!missing.length,missing}}
function hpForMulti(s){const lv=levels(s);if(!lv.other||!lv.second||!DICE[lv.main]||!DICE[lv.other])return null;const con=mod(s,'con');if(con===null)return null;const dice=[DICE[lv.main],...Array.from({length:lv.primary-1},()=>DICE[lv.main]),...Array.from({length:lv.second},()=>DICE[lv.other])];let total=0,values=[];dice.forEach((d,i)=>{let roll=i===0?d:s.fields.hpMethod==='rolled'?s.hpRolls[i-1]:Math.floor(d/2)+1;if(i>0&&s.fields.hpMethod==='rolled'&&(!Number.isInteger(roll)||roll<1||roll>d)){const a=new Uint32Array(1);crypto.getRandomValues(a);roll=1+a[0]%d;s.hpRolls[i-1]=roll;}const val=Math.max(1,n(roll,Math.floor(d/2)+1)+con+n(s.fields.hpPerLevel));total+=val;values.push(val)});total+=n(s.fields.hpExtra)+(window.DND2014?.healthExtra?.(s.fields,lv.total,lv.main)||0);return {total:Math.max(1,total),first:values[0],values:values.slice(1),die:DICE[lv.main],per:n(s.fields.hpPerLevel),extra:n(s.fields.hpExtra),multiDice:{[lv.main]:lv.primary,[lv.other]:lv.second}}}
function slotsForMulti(s){const lv=levels(s);if(!lv.other||!lv.second)return null;const v=addState(s),caster=(cl,l)=>['Bardo','Clérigo','Druida','Feiticeiro','Mago'].includes(cl)?l:['Paladino','Patrulheiro'].includes(cl)?Math.floor(l/2):(['Guerreiro','Ladino'].includes(cl)&&['Cavaleiro Arcano','Trapaceiro Arcano'].includes(v.subclasses[cl]))?Math.floor(l/3):0;
 const eff=caster(lv.main,lv.primary)+caster(lv.other,lv.second);const known=eff?SLOTS[Math.min(20,eff)].slice():Array(9).fill(0);const pactClass=lv.main==='Bruxo'?lv.primary:lv.other==='Bruxo'?lv.second:0;const pact=Array(9).fill(0);if(pactClass){let tier=pactClass<3?1:pactClass<5?2:pactClass<7?3:pactClass<9?4:5;pact[tier-1]=pactClass===1?1:pactClass<11?2:pactClass<17?3:4}return {totals:known,mode:'multi',pact,eff,info:'Conjurador combinado: nível '+eff+'; espaços do Bruxo separados.'}}
function featureResources(s){const v=addState(s),lv=levels(s),mainLv=lv.primary,otherLv=lv.second;let out=[];
 const add=(key,name,max,restore)=>{if(max>0)out.push({key,name,max,restore})};
 for(const [cl,L] of [[lv.main,mainLv],[lv.other,otherLv]]){if(!cl||!L)continue;
 if(cl==='Bárbaro')add('rage','Fúrias',L>=20?999:L>=17?6:L>=12?5:L>=6?4:L>=3?3:2,'long');
 if(cl==='Bardo')add('inspiration','Inspiração de Bardo',Math.max(1,mod(s,'cha')||1),L>=5?'short':'long');
 if(cl==='Monge')add('ki','Pontos de Ki',L>=2?L:0,'short');
 if(cl==='Paladino')add('layHands','Cura pelas Mãos (PV)',L*5,'long');
 if(cl==='Clérigo')add('channel','Canalizar Divindade',L>=18?3:L>=6?2:L>=2?1:0,'short');
 if(cl==='Druida')add('wildshape','Forma Selvagem',L>=2?2:0,'short');
 if(cl==='Guerreiro')add('surge','Surto de Ação',L>=17?2:L>=2?1:0,'short');
 if(cl==='Ladino')add('sneak','Ataque Furtivo (dados d6)',Math.ceil(L/2),'passive');
 if(cl==='Feiticeiro')add('sorcery','Pontos de Feitiçaria',L>=2?L:0,'long');
 if(cl==='Bruxo')add('invocations','Invocações Conhecidas',L>=18?8:L>=15?7:L>=12?6:L>=9?5:L>=7?4:L>=5?3:L>=2?2:0,'passive');
 if(cl==='Guerreiro'&&v.subclasses[cl]==='Mestre de Batalha')add('superiority','Dados de Superioridade',L>=15?6:L>=7?5:L>=3?4:0,'short');
 }
 if(v.feats.some(x=>x.name==='Sortudo'))add('luck','Pontos de Sorte',3,'long');return out}
function bonusApplyAfterRest(s,type){const v=addState(s);v.pactUsed=0;const defs=featureResources(s);v.resources.forEach(r=>{const definition=defs.find(x=>x.key===r.key);if(definition&&definition.restore===type||type==='long'&&definition&&definition.restore==='short')r.used=0});}
function validate(s){const lv=levels(s),v=addState(s),problems=[];const add=(type,text)=>problems.push({type,text});if(!s.fields.name.trim())add('info','Dê um nome ao personagem.');if(!lv.main)add('error','Selecione a classe inicial.');if(!s.fields.race)add('warn','Raça não selecionada.');if(!s.fields.background)add('warn','Antecedente não selecionado.');AB.forEach(a=>{const x=ability(s,a);if(x===null)add('error','Atributo '+ABIL[a]+' sem valor.');else if(x<1||x>30)add('error',ABIL[a]+' fora de 1–30.')});
 if(lv.other&&lv.second){const req=canMulticlass(s,lv.other);if(!req.ok)add('error','Multiclasse não atende pré-requisitos: '+req.missing.join('; '));if(lv.primary+lv.second!==lv.total)add('error','Soma dos níveis incorreta.');}
 if(lv.total>20||lv.total<1)add('error','Nível total fora de 1–20.');
 for(const [cl,L] of [[lv.main,lv.primary],[lv.other,lv.second]]){const sc=SUBS[cl];if(sc&&L>=sc.at&&!v.subclasses[cl])add('warn','Selecione uma subclasse de '+cl+' (liberada no nível '+sc.at+').')}
 if(s.skillProfs.length>18)add('error','Número de perícias impossível.');
 if(s.expertise.some(x=>!s.skillProfs.includes(x)))add('warn','Especialização registrada sem proficiência na perícia.');
 if(s.fields.armor!=='Sem armadura'&&s.fields.armor&&!['Bárbaro','Guerreiro','Paladino','Patrulheiro','Clérigo'].includes(lv.main)&&['Cota de malha','Cota de talas','Armadura de placas'].includes(s.fields.armor))add('warn','Confira proficiência com armadura pesada.');
 if(v.feats.length>v.asi.filter(x=>x.mode==='feat').length+(s.fields.race==='Humano'&&s.fields.subrace==='Variante'?1:0))add('warn','Talentos podem exceder suas oportunidades de escolha; revise os avanços.');
 const avail=slotsForMulti(s)?.totals||D()?.getSlots()?.totals||[];s.slotsUsed.forEach((spent,i)=>{if(spent>n(avail[i]))add('warn','Espaços gastos no nível '+(i+1)+' excedem os disponíveis.')});
 const hp=D()?.getHP();if(hp&&n(s.fields.hpCurrent)>hp.total)add('error','PV atuais ultrapassam o máximo.');
 const selected=v.selectedSpells.filter(Boolean);if(selected.length&&lv.main==='')add('warn','Magias selecionadas sem classe.');return problems}
window.DNDV5={abilityBonus,initBonus,passiveBonus,hpForMulti,slotsForMulti,thirdCaster,featureResources,validate,canMulticlass,levels,SUBS,SPELLS,GEAR,FEATS,addState,bonusApplyAfterRest,render,refresh,load:mount};
let mounted=false,step=0,spellSearch='',spellLevel='',spellClass='',spellConcentration=false,selectedGear='',selectedFeat='';
function output(id,text){const node=$(id);if(node)node.textContent=text}
function mount(){if(mounted||!D())return;mounted=true;const nav=document.querySelector('.topnav');nav.insertAdjacentHTML('beforeend','<button class="tab" data-tab="v5">V · Construtor V5</button>');const section=document.createElement('section');section.id='v5';section.className='sheet-page v5-page';section.innerHTML='<div class="sheet-heading"><div class="emblem">V<span>5</span></div><div class="heading-text"><h1>Construtor de Heróis</h1><p>Criação guiada • classes • grimório • equipamentos • validação</p></div><div class="serial">D&D 2014</div></div><div class="v5-nav"><button class="v5-navbtn active" data-v5panel="guide">Criação guiada</button><button class="v5-navbtn" data-v5panel="levels">Evolução</button><button class="v5-navbtn" data-v5panel="subclasses">Subclasses</button><button class="v5-navbtn" data-v5panel="spellbook">Grimório</button><button class="v5-navbtn" data-v5panel="items">Equipar</button><button class="v5-navbtn" data-v5panel="feats">Talentos</button><button class="v5-navbtn" data-v5panel="multi">Multiclasse</button><button class="v5-navbtn" data-v5panel="resources">Recursos</button><button class="v5-navbtn" data-v5panel="valid">Validador</button><button class="v5-navbtn" data-v5panel="pdf">PDF</button></div><div id="v5Content" class="v5-content"></div>';
 document.querySelector('main').appendChild(section);
 nav.querySelector('[data-tab="v5"]').addEventListener('click',()=>{document.querySelectorAll('.sheet-page').forEach(p=>p.classList.toggle('active',p.id==='v5'));document.querySelectorAll('.tab').forEach(p=>p.classList.toggle('active',p.dataset.tab==='v5'));switchPanel('guide');window.scrollTo(0,0)});
 section.querySelectorAll('[data-v5panel]').forEach(btn=>btn.addEventListener('click',()=>switchPanel(btn.dataset.v5panel)));
 const rest=$('restDiceCount');if(rest&&!$('v5HitDieWrap'))rest.insertAdjacentHTML('afterend','<label id="v5HitDieWrap" class="v5-dice-choice" hidden>Classe do Dado de Vida<select id="v5HitDieClass"></select></label>');
 section.addEventListener('click',onClick);section.addEventListener('change',onChange);section.addEventListener('input',onInput);
 switchPanel('guide');
}
let panel='guide';function switchPanel(name){panel=name;const section=$('v5');if(!section)return;section.querySelectorAll('[data-v5panel]').forEach(b=>b.classList.toggle('active',b.dataset.v5panel===name));render()}
function save(){D().recalc();}
function opts(arr,value){return arr.map(x=>'<option value="'+E(x)+'"'+(String(x)===String(value)?' selected':'')+'>'+E(x||'Selecione')+'</option>').join('')}
function selector(id,label,options,value){return '<label>'+label+'<select id="'+id+'">'+opts(options,value)+'</select></label>'}
function input(id,label,value,type='text'){return '<label>'+label+'<input id="'+id+'" type="'+type+'" value="'+E(value??'')+'"></label>'}
function guide(){const s=st(),v=addState(s);step=v.wizardStep;const titles=['Identidade','Raça e classe','Atributos','Proficiências','Equipamento','Revisão'];let content='';
 if(step===0)content='<div class="v5-fields">'+input('wgName','Nome do personagem',s.fields.name)+input('wgPlayer','Nome do jogador',s.fields.player)+input('wgAlignment','Tendência',s.fields.alignment)+'</div>';
 if(step===1)content='<div class="v5-fields">'+selector('wgClass','Classe inicial',['',...CLASSES],s.fields.className)+selector('wgRace','Raça',['','Anão','Elfo','Halfling','Humano','Draconato','Gnomo','Meio-Elfo','Meio-Orc','Tiefling'],s.fields.race)+selector('wgBg','Antecedente',['','Acolito','Artesão de Guilda','Artista','Charlatão','Criminoso','Eremita','Forasteiro','Herói do Povo','Marinheiro','Nobre','Órfão','Sábio','Soldado'],s.fields.background)+'</div><p class="helper">Sub-raças e escolhas flexíveis continuam disponíveis na ficha principal.</p>';
 if(step===2)content='<p>Preencha os seis valores-base (antes dos aumentos raciais). Você também pode usar os dados ou a compra por pontos da ficha original.</p><div class="v5-fields">'+AB.map(a=>input('wg-'+a,ABIL[a],s.abilities[a],'number')).join('')+'</div><button data-v5="standard">Aplicar valores padrão por ordem (15,14,13,12,10,8)</button>';
 if(step===3)content='<p>A ficha oferece distribuição automática por classe, raça e antecedente. Revise as escolhas manuais no quadro de perícias.</p><div class="v5-bar"><button data-v5="skills" class="solid">Distribuir perícias</button><button data-v5="to-sheet">Abrir perícias da ficha</button></div>';
 if(step===4)content='<p>Você pode começar com equipamentos típicos e escolher armas e armaduras detalhadas em <b>Equipar</b>.</p><button data-v5="starter-kit" class="solid">Adicionar kit básico de aventureiro</button><button data-v5="open-items">Abrir catálogo</button>';
 if(step===5){const issues=validate(s);content='<h3>Conferência da criação</h3><p class="v5-stat">'+E(s.fields.name||'Sem nome')+' · '+E(s.fields.className||'Sem classe')+' · Nível '+E(s.fields.level||'—')+'</p><p>'+issues.length+' item(ns) a revisar.</p><button data-v5="open-valid" class="solid">Ver validador</button><button data-v5="to-sheet">Ir para a ficha</button>'}
 return '<article class="panel"><div class="v5-steps">'+titles.map((t,i)=>'<button class="v5-step '+(i===step?'active':'')+'" data-v5step="'+i+'">'+(i+1)+'. '+t+'</button>').join('')+'</div><h2>Etapa '+(step+1)+' — '+titles[step]+'</h2>'+content+'<div class="v5-bar"><button data-v5="back" '+(step===0?'disabled':'')+'>Anterior</button><button data-v5="next" class="solid">'+(step===5?'Concluir':'Próxima etapa')+'</button></div></article>'}
function classChoiceUI(s){const v=addState(s),lv=levels(s);return '<div class="v5-fields">'+[[lv.main,lv.primary],[lv.other,lv.second]].filter(x=>x[0]).map(([cl,L])=>'<article class="v5-option"><strong>'+E(cl)+' · nível '+L+'</strong><p>Escolha liberada no nível '+(SUBS[cl]?.at||'?')+'</p>'+(L<(SUBS[cl]?.at||1)?'<p class="v5-note">Subclasse disponível apenas no nível '+SUBS[cl].at+'.</p>':selector('sub-'+cl,'Subclasse',['',...(SUBS[cl]?.choices||[])],v.subclasses[cl]||''))+'<div class="v5-minilist">'+(SUB_FEATURES[v.subclasses[cl]]||[]).filter(x=>x[0]<=L).map(x=>'<p><b>N'+x[0]+':</b> '+E(x[1])+'</p>').join('')+'<small>Outras características dependem da descrição da subclasse no livro e ficam registráveis na ficha.</small></div></article>').join('')+'</div>'}
function subclasses(){return '<article class="panel"><h2>Subclasses — Livro do Jogador 2014</h2><p class="helper">Lista das opções das 12 classes. Recursos numéricos mais frequentes entram nos contadores; características situacionais são exibidas para consulta e registro.</p>'+classChoiceUI(st())+'</article>'}
function levelsPanel(){const s=st(),v=addState(s),lv=levels(s),c=lv.other||lv.main,progress=lv.other?lv.second:lv.primary;const next=progress+1,eligible=ASI[c]?.includes(next),raceExtra=s.fields.race==='Humano'&&s.fields.subrace==='Variante';return '<article class="panel"><h2>Evolução de personagem</h2><p>Atual: <b>'+lv.total+'</b> · '+E(lv.main)+' '+lv.primary+(lv.other?' / '+E(lv.other)+' '+lv.second:'')+'.</p><div class="v5-fields">'+selector('upClass','Classe que receberá um nível',[lv.main,...(lv.other?[lv.other]:[])],c)+selector('upChoice','Aumento neste nível',eligible?['Nenhum','+2 em atributo','+1 em dois atributos','Talento']:['Nenhum'], 'Nenhum')+selector('upAbility','Atributo principal',AB,'str')+selector('upAbility2','Segundo atributo',AB,'dex')+'</div><button class="solid" data-v5="level-up" '+(lv.total>=20?'disabled':'')+'>Confirmar subida para nível '+(lv.total+1)+'</button><div class="v5-note">Se houver escolha de subclasse ou habilidade concedida no novo nível, o validador apontará a pendência. Não adiciona talentos sem sua escolha.</div><div class="v5-minilist"><h3>Avanços registrados</h3>'+(v.classHistory.length?v.classHistory.map(x=>'<p>• '+E(x)+'</p>').join(''):'Nenhum avanço registrado por este módulo.')+'</div></article>'}
function spellbook(){const s=st(),v=addState(s),prepared=v.selectedSpells||[];const search=spellSearch.toLowerCase().trim(),match=SPELLS.filter(x=>(!spellLevel||String(x[1])===spellLevel)&&(!spellClass||x[3].split(',').includes(spellClass))&&(!spellConcentration||x[4])&&(!search||x[0].toLowerCase().includes(search)||x[2].toLowerCase().includes(search))).slice(0,120);return '<article class="panel"><h2>Grimório pesquisável · 2014</h2><p class="helper">Índice inicial de '+SPELLS.length+' magias com dados resumidos e descrições originais. Não substitui o texto de cada magia no Livro do Jogador. Permite adicionar magias personalizadas à ficha.</p><div class="v5-filters">'+input('spSearch','Pesquisar',spellSearch)+selector('spLevel','Nível',['',...'0123456789'.split('')],spellLevel)+selector('spClass','Classe',['',...CLASSES],spellClass)+'<label class="v5-toggle"> <input id="spConc" type="checkbox" '+(spellConcentration?'checked':'')+'> Somente concentração</label></div><button data-v5="search-spells">Buscar magias</button><p>'+match.length+' resultados · '+prepared.length+' selecionadas</p><div class="v5-spellgrid">'+match.map(x=>'<div class="v5-spell"><b>'+E(x[0])+'</b><small>N'+x[1]+' · '+E(x[2])+(x[4]?' · CONC':'')+(x[5]?' · Ritual':'')+' · '+E(x[6])+'</small><p>'+E(x[7])+'</p><small>'+E(x[3])+'</small><button data-v5="spell-add" data-name="'+E(x[0])+'" '+(prepared.includes(x[0])?'disabled':'')+'>'+(prepared.includes(x[0])?'Na ficha':'Adicionar')+'</button></div>').join('')+'</div><hr><h3>Magias personalizadas</h3><div class="v5-fields">'+input('customSpellName','Nome','')+selector('customSpellLevel','Nível','0123456789'.split(''),'0')+'</div><button data-v5="custom-spell">Registrar e adicionar</button><div class="v5-minilist"><h3>Magias selecionadas</h3>'+prepared.map(x=>'<span class="v5-chip">'+E(x)+' <button title="Remover" data-v5="spell-remove" data-name="'+E(x)+'">×</button></span>').join('')+'</div></article>'}
function equip(){const s=st(),v=addState(s);return '<article class="panel"><h2>Equipamentos automáticos</h2><p class="helper">Catálogo de armas, armaduras e itens. Ao equipar uma arma, ela entra nos ataques; armaduras ajustam a CA. O peso é registrado no inventário.</p><div class="v5-fields">'+selector('gearSelect','Item',GEAR.map(x=>x[0]),selectedGear||GEAR[0][0])+input('gearQty','Quantidade',1,'number')+'</div><button data-v5="equip" class="solid">Adicionar e equipar</button><button data-v5="starter-kit">Kit inicial básico</button><div class="v5-minilist">'+v.gearChoices.map((x,i)=>'<p><b>'+E(x.name)+'</b> · '+x.qty+' un. <button data-v5="remove-gear" data-index="'+i+'">Remover vínculo automático</button></p>').join('')+'</div><p class="helper">Itens adicionados podem ser editados na ficha. A adição de armadura pode alterar o campo Armadura e a de escudo ativa a caixa Escudo. O cálculo de proficiência com armas continua sob controle do jogador.</p></article>'}
function feats(){const s=st(),v=addState(s);return '<article class="panel"><h2>Talentos · seleção com consequências</h2><p class="helper">Escolha quando sua progressão permitir. Efeitos automáticos: Alerta, Robusto, Observador (passivas), Resiliente (salvaguarda), aumentos de atributos. Efeitos condicionais são descritos, não aplicados cegamente.</p><div class="v5-fields">'+selector('featSelect','Talento',FEATS.map(x=>x.name),selectedFeat||FEATS[0].name)+selector('featStat','Atributo (quando aplicável)',AB.map(a=>a+' · '+ABIL[a]),'str · Força')+'</div><button data-v5="feat-add" class="solid">Selecionar talento</button><div class="v5-minilist">'+v.feats.map((x,i)=>'<p><b>'+E(x.name)+'</b> '+E(x.stat?ABIL[x.stat]:'')+' <button data-v5="feat-remove" data-index="'+i+'">Remover</button></p>').join('')+'</div><h3>Catálogo</h3><div class="v5-featgrid">'+FEATS.map(x=>'<div><b>'+E(x.name)+'</b><p>'+E(x.detail)+'</p></div>').join('')+'</div></article>'}
function multi(){const s=st(),v=addState(s),lv=levels(s),choices=['',...CLASSES.filter(x=>x!==lv.main)],req=canMulticlass(s,lv.other||lv.main);return '<article class="panel"><h2>Multiclasse (opcional)</h2><p class="helper">Verifica pré-requisitos das duas classes, preserva as resistências da classe inicial e combina Dados de Vida e espaços de magia quando aplicável. Apenas duas classes por personagem nesta versão.</p><div class="v5-fields">'+selector('multiClass','Segunda classe',choices,v.secondaryClass)+input('multiLevel','Níveis na segunda classe (do total '+lv.total+')',v.secondaryLevel,'number')+'</div><p>Distribuição: <b>'+E(lv.main)+' '+lv.primary+'</b> '+(lv.other?' / '+E(lv.other)+' '+lv.second:'')+'</p><p id="multiChecks" class="v5-note">'+(lv.other?(req.ok?'Pré-requisitos atendidos.':'Pendências: '+E(req.missing.join(', '))):'Selecione a segunda classe.')+'</p><button data-v5="apply-multi" class="solid">Aplicar divisão de níveis</button><button data-v5="clear-multi">Remover multiclasse</button><p class="helper">Pontos de vida ganhos ao multiclassear podem depender de rolagens históricas da campanha. Com o modo de PV rolados, registre as rolagens existentes na ficha; o modo de média usa o valor fixo do Dado de Vida.</p><div class="v5-note" id="multiSlots">'+(slotsForMulti(s)?.info||'Sem multiclasse')+'</div>'+(slotsForMulti(s)?.pact.some(Boolean)?'<div class="v5-minilist"><b>Espaços do Pacto (separados): '+Math.max(0,slotsForMulti(s).pact.reduce((a,b)=>a+b,0)-n(v.pactUsed,0))+' / '+slotsForMulti(s).pact.reduce((a,b)=>a+b,0)+' no nível '+(slotsForMulti(s).pact.findIndex(x=>x>0)+1)+'</b><div class="v5-bar"><button data-v5="pact-spend">Gastar Pacto</button><button data-v5="pact-restore">Recuperar Pacto</button></div></div>':'')+'</article>'}
function resources(){const s=st(),v=addState(s),defs=featureResources(s);defs.forEach(x=>{if(!v.resources.find(r=>r.key===x.key))v.resources.push({key:x.key,used:0})});return '<article class="panel"><h2>Recursos de classe e descansos</h2><p class="helper">Contadores por nível de classe. Recursos passivos mostram dados conhecidos, sem consumo.</p><div class="v5-resources">'+defs.map(x=>{const r=v.resources.find(k=>k.key===x.key),spent=Math.max(0,n(r?.used,0));return '<div class="v5-resource"><div><b>'+E(x.name)+'</b><p>Disponíveis: '+Math.max(0,x.max-spent)+' / '+x.max+' · '+(x.restore==='short'?'descanso curto':x.restore==='long'?'descanso longo':'passivo')+'</p></div><div><button data-v5="resource-spend" data-key="'+x.key+'" '+(x.restore==='passive'||spent>=x.max?'disabled':'')+'>Usar</button><button data-v5="resource-restore" data-key="'+x.key+'" '+(x.restore==='passive'||spent===0?'disabled':'')+'>Recuperar</button></div></div>'}).join('')+'</div><div class="v5-bar"><button data-v5="rest-short">Descanso curto · recursos</button><button data-v5="rest-long" class="solid">Descanso longo · recursos</button></div></article>'}
function validator(){const issues=validate(st());return '<article class="panel"><h2>Validador de ficha</h2><p class="helper">Confere preenchimento, pré-requisitos e conflitos calculáveis. Avisos não substituem decisões do Mestre.</p><div class="v5-bar"><strong>'+issues.filter(x=>x.type==='error').length+' erros</strong><strong>'+issues.filter(x=>x.type==='warn').length+' alertas</strong><strong>'+issues.filter(x=>x.type==='info').length+' sugestões</strong></div>'+(issues.length?issues.map(x=>'<div class="v5-issue '+x.type+'">'+(x.type==='error'?'⛔':x.type==='warn'?'⚠️':'ℹ️')+' '+E(x.text)+'</div>').join(''):'<div class="v5-issue good">✓ Nenhuma inconsistência detectada pelas regras verificadas.</div>')+'<button data-v5="refresh-valid" class="solid">Revalidar</button></article>'}
function pdf(){return '<article class="panel"><h2>Exportação em PDF</h2><p>Use a impressão do navegador para gerar um PDF em A4 com as três páginas tradicionais da ficha. O construtor V5 não aparece na impressão.</p><div class="v5-bar"><button data-v5="export-pdf" class="solid">Abrir exportação PDF</button><button data-v5="to-sheet">Revisar ficha antes</button></div><p class="v5-note">Na janela que abrir, selecione <b>Salvar como PDF</b>, papel A4, orientação retrato. JSON continua sendo o formato de backup editável.</p></article>'}
function render(){if(!mounted||!$('v5Content'))return;const view={guide,levels:levelsPanel,subclasses,spellbook,items:equip,feats,multi,resources,valid:validator,pdf};$('v5Content').innerHTML=(view[panel]||guide)()}
function refresh(){const choice=$('v5HitDieWrap'),select=$('v5HitDieClass');if(choice&&select){const lv=levels(st()),opts=[lv.main,...(lv.other?[lv.other]:[])].filter(Boolean);choice.hidden=!lv.other;if(opts.join('|')!==select.dataset.current){const old=select.value;select.innerHTML=opts.map(x=>'<option value=\"'+E(x)+'\">'+E(x)+' d'+DICE[x]+'</option>').join('');select.dataset.current=opts.join('|');if(opts.includes(old))select.value=old}}if(mounted&&$('v5')?.classList.contains('active')&&panel!=='spellbook')render()}
function onInput(e){const t=e.target;if(t.id==='spSearch')spellSearch=t.value;}
function onChange(e){const t=e.target,id=t.id;if(id.startsWith('sub-')){const cls=id.slice(4),v=addState(st());v.subclasses[cls]=t.value;if(cls==='Feiticeiro')st().fields.draconicSoul=t.value==='Linhagem Dracônica';save();render();return}if(id==='spSearch'){render()}else if(id==='spLevel'){spellLevel=t.value;render()}else if(id==='spClass'){spellClass=t.value;render()}else if(id==='spConc'){spellConcentration=t.checked;render()}else if(id==='gearSelect'){selectedGear=t.value}else if(id==='featSelect'){selectedFeat=t.value}}
function applyWizard(){const s=st(),v=addState(s);const update=(key,source)=>{if($(source))s.fields[key]=$(source).value};if(step===0){update('name','wgName');update('player','wgPlayer');update('alignment','wgAlignment')}
 else if(step===1){update('className','wgClass');update('race','wgRace');update('background','wgBg');s.fields.castClass=s.fields.className;s.fields.castAbility={'Mago':'int','Clérigo':'wis','Druida':'wis','Paladino':'cha','Patrulheiro':'wis','Bardo':'cha','Bruxo':'cha','Feiticeiro':'cha'}[s.fields.className]||'';if(!s.fields.level)s.fields.level=1;const cf=D()?.getClass?.(s.fields.className);if(cf){s.saves=cf.saves.slice();}if(s.fields.race==='Anão'||s.fields.race==='Gnomo'||s.fields.race==='Halfling')s.fields.speed=7.5;else s.fields.speed=9}
 else if(step===2){AB.forEach(a=>{if($('wg-'+a))s.abilities[a]=$('wg-'+a).value})}save()}
function clickAct(action,b){const s=st(),v=addState(s),lv=levels(s);if(action==='next'){applyWizard();if(step<5)step++;else{step=0;document.querySelector('[data-tab="sheet"]').click();return}v.wizardStep=step;render();return}
if(action==='back'){step=Math.max(0,step-1);v.wizardStep=step;render();return}
if(action==='standard'){[15,14,13,12,10,8].forEach((x,i)=>s.abilities[AB[i]]=x);save();render();return}
if(action==='skills'){document.querySelector('#autoSkills')?.click();render();return}
if(action==='to-sheet'){document.querySelector('[data-tab="sheet"]').click();return}
if(action==='starter-kit'){if(!s.items.some(x=>x.name==='Kit de aventureiro'))s.items.push({id:id(),name:'Kit de aventureiro',qty:1,weight:27});save();render();return}
if(action==='open-items'){switchPanel('items');return}
if(action==='open-valid'){switchPanel('valid');return}
if(action==='refresh-valid'){render();return}
if(action==='level-up'){
 if(lv.total>=20)return;
 const cl=$('upClass')?.value||lv.main,choice=$('upChoice')?.value||'Nenhum';let next=cl===lv.main?lv.primary+1:lv.second+1;
 if(cl!==lv.main&&cl!==lv.other)return;
 if(ASI[cl]?.includes(next)&&choice==='Nenhum'){output('levelNotice','Escolha um aumento de atributo ou talento antes de avançar.');return}
 if(choice==='Talento'){v.pendingLevelClass=cl;switchPanel('feats');return}
 if(choice.includes('+')){let a=$('upAbility')?.value||'str',b2=$('upAbility2')?.value||'dex';if(choice.includes('dois')&&a===b2){alert('Escolha dois atributos distintos.');return}if(n(s.abilities[a],10)>=20){alert('Atributo no limite normal de 20.');return}if(choice.includes('dois')){s.abilities[a]=Math.min(20,n(s.abilities[a],10)+1);s.abilities[b2]=Math.min(20,n(s.abilities[b2],10)+1)}else s.abilities[a]=Math.min(20,n(s.abilities[a],10)+2);v.asi.push({className:cl,level:next,mode:'ability',choice})}
 if(cl!==lv.main)v.secondaryLevel=lv.second+1;s.fields.level=lv.total+1;s.fields.xp=Math.max(n(s.fields.xp,0),XP[lv.total]||0);v.classHistory.push(cl+' nível '+next+(choice==='Nenhum'?'':' · '+choice));save();render();return}
if(action==='equip'){
 const name=$('gearSelect')?.value,gear=GEAR.find(x=>x[0]===name),qty=Math.max(1,Math.min(99,n($('gearQty')?.value,1)));if(!gear)return;const [,type,weight,damage,stat,damageType]=gear;
 s.items.push({id:id(),name,qty,weight});v.gearChoices.push({name,qty});if(type==='armadura')s.fields.armor=name;if(type==='escudo')s.fields.shield=true;if(type==='arma')s.attacks.push({id:id(),name,type:stat,damage,prof:true});save();render();return}
if(action==='remove-gear'){const i=Number(b.dataset.index),record=v.gearChoices[i];if(!record)return;v.gearChoices.splice(i,1);const j=s.items.findIndex(x=>x.name===record.name);if(j>=0)s.items.splice(j,1);render();save();return}
if(action==='feat-add'){
 const name=$('featSelect')?.value,entry=FEATS.find(x=>x.name===name),stat=$('featStat')?.value?.slice(0,3);if(!entry)return;if(v.feats.some(x=>x.name===name)){alert('Este talento já foi selecionado.');return}v.feats.push({name,stat:entry.stat?stat:null,wasSave:!!s.saves.includes(stat)});if(v.pendingLevelClass){const pending=v.pendingLevelClass;const nextLv=(pending===lv.main?lv.primary:lv.second)+1;if(ASI[pending]?.includes(nextLv)&&lv.total<20){if(pending!==lv.main)v.secondaryLevel=lv.second+1;s.fields.level=lv.total+1;v.asi.push({className:pending,level:nextLv,mode:'feat',feat:name});v.classHistory.push(pending+' nível '+nextLv+' · Talento '+name);}v.pendingLevelClass='';}if(name==='Robusto')s.fields.featTough=true;if(name==='Resiliente'&&!s.saves.includes(stat))s.saves.push(stat);save();render();return}
if(action==='feat-remove'){const i=Number(b.dataset.index),entry=v.feats[i];if(!entry)return;v.feats.splice(i,1);if(entry.name==='Robusto')s.fields.featTough=false;if(entry.name==='Resiliente'&&!entry.wasSave)s.saves=s.saves.filter(x=>x!==entry.stat);save();render();return}
if(action==='apply-multi'){
 const cls=$('multiClass')?.value,levels2=Math.floor(n($('multiLevel')?.value,0));if(!cls||cls===lv.main||levels2<1||levels2>=lv.total){alert('Escolha uma segunda classe e entre 1 e '+(lv.total-1)+' níveis.');return}
 const eligibility=canMulticlass(s,cls);if(!eligibility.ok){alert('Multiclasse indisponível: '+eligibility.missing.join(', '));return}
 v.secondaryClass=cls;v.secondaryLevel=levels2;s.fields.spellProgression='auto';save();render();return}
if(action==='clear-multi'){v.secondaryClass='';v.secondaryLevel=0;save();render();return}
if(action==='search-spells'){render();return}
if(action==='spell-add'){
 const name=b.dataset.name,sp=SPELLS.find(x=>x[0]===name);if(!sp||v.selectedSpells.includes(name))return;v.selectedSpells.push(name);const old=s.spells[sp[1]]||'';s.spells[sp[1]]=(old?old.trimEnd()+'\n':'')+name;save();render();return}
if(action==='spell-remove'){const name=b.dataset.name;v.selectedSpells=v.selectedSpells.filter(x=>x!==name);for(let k=0;k<=9;k++)s.spells[k]=String(s.spells[k]||'').split('\n').filter(x=>x.trim()!==name).join('\n');save();render();return}
if(action==='custom-spell'){
 const name=$('customSpellName')?.value.trim(),lvl=Number($('customSpellLevel')?.value);if(!name||!Number.isInteger(lvl)||lvl<0||lvl>9){alert('Informe nome e nível 0–9.');return}v.customSpells.push({name,lvl});v.selectedSpells.push(name);s.spells[lvl]=(s.spells[lvl]?s.spells[lvl].trimEnd()+'\n':'')+name;save();render();return}
if(action==='resource-spend'||action==='resource-restore'){const key=b.dataset.key,x=v.resources.find(x=>x.key===key),def=featureResources(s).find(x=>x.key===key);if(!x||!def)return;x.used=action==='resource-spend'?Math.min(def.max,n(x.used)+1):Math.max(0,n(x.used)-1);save();render();return}
if(action==='pact-spend'){const slots=slotsForMulti(s);if(!slots)return;const max=slots.pact.reduce((a,b)=>a+b,0);v.pactUsed=Math.min(max,n(v.pactUsed,0)+1);save();render();return}
if(action==='pact-restore'){v.pactUsed=0;save();render();return}
if(action==='rest-short'||action==='rest-long'){if(action==='rest-short')v.pactUsed=0;bonusApplyAfterRest(s,action==='rest-short'?'short':'long');save();render();return}
if(action==='export-pdf'){window.print();return}
}
function onClick(e){const b=e.target.closest('button');if(!b)return;if(b.dataset.v5step!==undefined){applyWizard();step=Number(b.dataset.v5step);addState(st()).wizardStep=step;render();return}if(b.dataset.v5){e.preventDefault();clickAct(b.dataset.v5,b)}}
mount();
})();