/* Catálogo descritivo autoral baseado nas mecânicas do SRD 5.1 (2014).
 * SRD 5.1 © Wizards of the Coast LLC, CC BY 4.0: https://www.dndbeyond.com/srd
 * https://creativecommons.org/licenses/by/4.0/
 * Adaptação e resumos em português: compêndio do projeto.
 * Não reproduz textos extensos dos livros comerciais nem converte magias automaticamente para 2024.
 */
(function(){
 'use strict';
 const S=(effect,damage='Não causa dano direto',range='Consulte a descrição',save='—',scaling='',roll='',extras={})=>Object.assign({effect,damage,range,save,scaling,roll,time:'1 ação',duration:'Instantânea'},extras);
 const spells={
  'Luz':S('Faz um objeto tocado iluminar a região; útil para exploração e leitura.','Não causa dano','Toque','—','—','',{duration:'1 hora'}),
  'Prestidigitação':S('Cria pequenas alterações sensoriais, limpa ou suja objetos e produz efeitos mágicos simples.','Não causa dano','3 m','—','—','',{duration:'Até 1 hora'}),
  'Raio de Gelo':S('Ataque mágico à distância. Se acertar, reduz o deslocamento do alvo em 3 m até o início do seu próximo turno.','1d8 frio','18 m','Ataque mágico','Truque: 2d8/3d8/4d8 nos níveis 5/11/17.','1d8',{scale:'cantrip'}),
  'Rajada Mística':S('Faça um ataque mágico separado para cada feixe; os feixes podem mirar alvos diferentes.','1d10 energético por feixe','36 m','Ataques mágicos','2/3/4 feixes nos níveis 5/11/17.','1d10',{scale:'beams'}),
  'Chama Sagrada':S('O alvo faz resistência de Destreza. Se falhar, sofre dano radiante; cobertura não beneficia essa resistência.','1d8 radiante','18 m','Resistência de DES','2d8/3d8/4d8 nos níveis 5/11/17.','1d8',{scale:'cantrip'}),
  'Orientação':S('O alvo pode somar 1d4 a um teste de habilidade enquanto durar o efeito, conforme a edição 2014.','Não causa dano','Toque','—','Bônus de 1d4','',{duration:'Concentração, até 1 minuto'}),
  'Zombaria Viciosa':S('Resistência de Sabedoria; em falha, dano psíquico e desvantagem na próxima jogada de ataque antes do fim do próximo turno.','1d4 psíquico','18 m','Resistência de SAB','2d4/3d4/4d4 nos níveis 5/11/17.','1d4',{scale:'cantrip'}),
  'Mãos Mágicas':S('Invoca uma mão espectral que manipula objetos leves, abre recipientes e interage à distância, mas não ataca.','Não causa dano','9 m','—','—','',{duration:'1 minuto'}),
  'Consertar':S('Repara uma ruptura ou dano pequeno em um objeto, sem recriar partes perdidas.','Não causa dano','Toque','—','—','',{time:'1 minuto'}),
  'Raio de Fogo':S('Ataque mágico à distância de fogo; objetos inflamáveis sem portador podem incendiar.','1d10 fogo','36 m','Ataque mágico','2d10/3d10/4d10 nos níveis 5/11/17.','1d10',{scale:'cantrip'}),
  'Toque Chocante':S('Ataque mágico corpo a corpo com eletricidade que impede reações do alvo até o início do próximo turno.','1d8 elétrico','Toque','Ataque mágico','2d8/3d8/4d8 nos níveis 5/11/17.','1d8',{scale:'cantrip'}),
  'Bola de Fogo':S('Explosão de 6 m de raio. Criaturas na área fazem resistência de Destreza; sucesso reduz o dano pela metade.','8d6 fogo','45 m','Resistência de DES','+1d6 por nível de espaço acima do 3º.','8d6',{upcast:'1d6'}),
  'Mísseis Mágicos':S('Cria três dardos que acertam automaticamente criaturas visíveis; cada dardo causa 1d4+1. Escudo Arcano pode anulá-los.','3 × (1d4+1) energético','36 m','Acerto automático','+1 dardo por nível de espaço acima do 1º.','1d4+1',{multi:3,multiUpcast:1}),
  'Armadura Arcana':S('O alvo sem armadura passa a ter CA base igual a 13 + modificador de Destreza.','Não causa dano','Toque','—','CA 13 + DES','',{duration:'8 horas'}),
  'Escudo Arcano':S('Reação ao ser atingido: concede +5 de CA até o início do próximo turno e bloqueia Mísseis Mágicos.','Não causa dano','Pessoal','—','+5 CA temporariamente','',{time:'1 reação',duration:'Até o início do próximo turno'}),
  'Detectar Magia':S('Detecta a presença de magia na proximidade; pode revelar a escola de uma aura visível.','Não causa dano','Pessoal: raio de 9 m','—','Pode ser conjurada como ritual','',{duration:'Concentração, até 10 minutos'}),
  'Curar Ferimentos':S('Recupera PV de uma criatura tocada; não tem efeito em mortos-vivos nem constructos na 5e 2014.','1d8 + mod. de conjuração (cura)','Toque','—','+1d8 por nível de espaço acima do 1º.','1d8',{upcast:'1d8',addMod:true,kind:'cura'}),
  'Palavra Curativa':S('Recupera PV de uma criatura que possa ver, usando uma ação bônus.','1d4 + mod. de conjuração (cura)','18 m','—','+1d4 por nível de espaço acima do 1º.','1d4',{upcast:'1d4',addMod:true,kind:'cura',time:'1 ação bônus'}),
  'Sono':S('A rolagem determina quantos PV de criaturas podem ser afetados, começando pelas de PV mais baixos; não causa dano.','5d8 PV afetados, não é dano','27 m','—','+2d8 por nível de espaço acima do 1º.','5d8',{upcast:'2d8',kind:'pool',duration:'1 minuto'}),
  'Bênção':S('Até três criaturas somam 1d4 às jogadas de ataque e testes de resistência enquanto você mantiver a concentração.','Não causa dano','9 m','—','+1 criatura por nível de espaço acima do 1º.','',{duration:'Concentração, até 1 minuto'}),
  'Maldição':S('O alvo faz resistência de Carisma; em falha, suas jogadas de ataque e resistências recebem penalidade de 1d4.','Não causa dano','9 m','Resistência de CAR','—','',{duration:'Concentração, até 1 minuto'}),
  'Névoa Obscurecente':S('Cria esfera de névoa fortemente obscurecida que impede visão dentro da área.','Não causa dano','36 m','—','+6 m de raio por nível de espaço acima do 1º.','',{duration:'Concentração, até 1 hora'}),
  'Enredar':S('Plantas tornam área de 6 m um terreno difícil; criaturas na área fazem resistência de Força ou ficam impedidas.','Não causa dano','27 m','Resistência de FOR','Terreno difícil / impedido','',{duration:'Concentração, até 1 minuto'}),
  'Compreender Idiomas':S('Você entende o significado literal de línguas faladas e escritas tocadas; não decifra mensagens secretas.','Não causa dano','Pessoal','—','Pode ser conjurada como ritual','',{duration:'1 hora'}),
  'Armadura de Agathys':S('Ganha 5 PV temporários; uma criatura que acertar você com ataque corpo a corpo enquanto esses PV durarem sofre dano de frio.','5 PV temporários + 5 frio por acerto recebido','Pessoal','—','+5 PV temporários e +5 frio por nível de espaço acima do 1º.','',{duration:'1 hora'}),
  'Passos Longos':S('Aumenta o deslocamento do alvo em 3 m sem exigir concentração.','Não causa dano','Toque','—','+1 criatura por nível de espaço acima do 1º.','',{duration:'1 hora'}),
  'Proteção Contra o Bem e o Mal':S('Protege contra ataques e efeitos de criaturas de tipos específicos, como corruptores e mortos-vivos.','Não causa dano','Toque','—','Desvantagem para ataques dessas criaturas e defesa contra encantamento','',{duration:'Concentração, até 10 minutos'}),
  'Identificação':S('Revela propriedades de um item mágico tocado ou magias que estejam afetando uma criatura; requer componente material especial.','Não causa dano','Toque','—','Pode ser conjurada como ritual','',{time:'1 minuto',duration:'Instantânea'}),
  'Teia':S('Cria área coberta de teias: terreno difícil; resistências de Destreza podem impedir criaturas na área.','Não causa dano','18 m','Resistência de DES','Terreno difícil, impedido','',{duration:'Concentração, até 1 hora'}),
  'Invisibilidade':S('Deixa uma criatura invisível. Termina se ela atacar ou conjurar uma magia, conforme a versão 2014.','Não causa dano','Toque','—','+1 alvo por nível de espaço acima do 2º.','',{duration:'Concentração, até 1 hora'}),
  'Passo Nebuloso':S('Teletransporta o conjurador para espaço desocupado que consiga ver.','Não causa dano','Pessoal: até 9 m','—','Teletransporte','',{time:'1 ação bônus'}),
  'Raio Ardente':S('Dispara três raios; cada raio precisa de ataque mágico separado e causa dano próprio.','3 raios de 2d6 fogo','36 m','Ataques mágicos','+1 raio por nível de espaço acima do 2º.','2d6',{multi:3,multiUpcast:1}),
  'Oração Curativa':S('Cura até seis criaturas que possa ver em um alcance de 9 m; tem conjuração longa, inadequada ao combate direto.','2d8 + mod. de conjuração por alvo (cura)','9 m','—','+1d8 por nível de espaço acima do 2º.','2d8',{upcast:'1d8',addMod:true,kind:'cura',time:'10 minutos'}),
  'Restauração Menor':S('Remove uma condição entre cegueira, surdez, paralisia, envenenamento ou uma doença.','Não causa dano','Toque','—','Remove condição',''),
  'Auxílio':S('Até três criaturas ganham 5 PV máximos e atuais adicionais durante a duração.','+5 PV máximos e atuais, não dano','9 m','—','+5 PV por nível de espaço acima do 2º.','',{duration:'8 horas'}),
  'Silêncio':S('Cria área de silêncio que bloqueia sons e magias com componente verbal no local.','Não causa dano','36 m','—','Zona de silêncio','',{duration:'Concentração, até 10 minutos'}),
  'Levitação':S('Faz criatura ou objeto subir verticalmente; alvo involuntário resiste com Constituição.','Não causa dano','18 m','Resistência de CON','Movimento vertical','',{duration:'Concentração, até 10 minutos'}),
  'Contramágica':S('Como reação, tenta interromper uma magia em conjuração. Magias acima do 3º nível podem exigir teste de atributo.','Não causa dano','18 m','Teste de conjuração situacional','Interrompe conjuração','',{time:'1 reação'}),
  'Dissipar Magia':S('Encerra efeitos de magia num alvo. Contra magias de nível superior ao espaço usado, pode exigir teste de conjuração.','Não causa dano','36 m','Teste de conjuração situacional','Remove efeitos mágicos',''),
  'Revivificar':S('Traz de volta criatura que morreu há no máximo 1 minuto, sujeito às condições e ao componente material.','Não causa dano','Toque','—','Ressurreição limitada',''),
  'Padrão Hipnótico':S('Criaturas na área fazem resistência de Sabedoria; em falha, ficam enfeitiçadas e incapacitadas até serem despertadas ou sofrerem dano.','Não causa dano','36 m','Resistência de SAB','Incapacitado / enfeitiçado','',{duration:'Concentração, até 1 minuto'}),
  'Velocidade':S('Dobra deslocamento, concede +2 CA, vantagem em resistências de DES e uma ação limitada adicional.','Não causa dano','9 m','—','+2 CA, deslocamento ×2','',{duration:'Concentração, até 1 minuto'}),
  'Lentidão':S('Até seis criaturas fazem resistência de Sabedoria; ficam com movimento e ações prejudicados enquanto durar.','Não causa dano','36 m','Resistência de SAB','Movimento reduzido e limita ações','',{duration:'Concentração, até 1 minuto'}),
  'Relâmpago':S('Linha de eletricidade de 30 m. Resistência de Destreza reduz dano pela metade.','8d6 elétrico','30 m em linha','Resistência de DES','+1d6 por nível de espaço acima do 3º.','8d6',{upcast:'1d6'}),
  'Guardião Espiritual':S('Espíritos protegem área de 4,5 m à sua volta; inimigos reduzem deslocamento e sofrem dano radiante/necrótico em testes de SAB conforme a edição 2014.','3d8 radiante ou necrótico por ativação','Pessoal: raio de 4,5 m','Resistência de SAB','+1d8 por nível de espaço acima do 3º.','3d8',{upcast:'1d8',duration:'Concentração, até 10 minutos'}),
  'Porta Dimensional':S('Teletransporta você e possivelmente outra criatura voluntária até um local a 150 m, conhecido ou descrito.','Não causa dano','150 m','—','Teletransporte',''),
  'Invisibilidade Maior':S('Alvo continua invisível mesmo se atacar ou lançar magias, enquanto houver concentração.','Não causa dano','Toque','—','Invisibilidade persistente','',{duration:'Concentração, até 1 minuto'}),
  'Polimorfia':S('Transforma alvo em uma besta adequada ao nível/ND; substitui estatísticas e pontos de vida temporariamente.','Varia conforme a forma assumida','18 m','Resistência de SAB se alvo involuntário','PV, ataques e ações passam a usar a forma','',{duration:'Concentração, até 1 hora'}),
  'Banimento':S('Força alvo a resistir com Carisma ou ser removido temporariamente para outro plano ou semiplano.','Não causa dano','18 m','Resistência de CAR','+1 criatura por nível de espaço acima do 4º.','',{duration:'Concentração, até 1 minuto'}),
  'Escudo de Fogo':S('Cria chamas protetoras, concedendo resistência a frio ou fogo, com retaliação quando você é atingido corpo a corpo.','2d8 fogo ou frio na retaliação','Pessoal','—','Resistência escolhida / 2d8 retaliação','2d8',{duration:'10 minutos'}),
  'Cone de Frio':S('Cone de 18 m. Criaturas fazem resistência de Constituição; sucesso recebe metade do dano.','8d8 frio','Cone de 18 m','Resistência de CON','+1d8 por nível de espaço acima do 5º.','8d8',{upcast:'1d8'}),
  'Muralha de Força':S('Cria barreira invisível quase impenetrável que impede passagem; não causa dano.','Não causa dano','36 m','—','Barreira','',{duration:'Concentração, até 10 minutos'}),
  'Curar Ferimentos em Massa':S('Cura até seis criaturas numa área; cada uma recupera PV e não ultrapassa o máximo.','3d8 + mod. conjuração por alvo (cura)','18 m','—','+1d8 por nível de espaço acima do 5º.','3d8',{upcast:'1d8',addMod:true,kind:'cura'}),
  'Ressurreição dos Mortos':S('Ressuscita criatura morta há até 10 dias, com condições e componentes especiais.','Não causa dano','Toque','—','Ressurreição','',{time:'1 hora'}),
  'Telecinese':S('Move criatura ou objeto com força mental; envolve testes opostos quando o alvo tenta resistir.','Não causa dano','18 m','Teste oposto de habilidade','Manipulação à distância','',{duration:'Concentração, até 10 minutos'}),
  'Desintegrar':S('Raio acerta criatura se falhar em resistência de Destreza; causa alto dano energético.','10d6+40 energético','18 m','Resistência de DES','+3d6 por nível de espaço acima do 6º.','10d6+40',{upcast:'3d6'}),
  'Cura':S('Recupera 70 PV de um alvo, sem exceder PV máximos; remove certos efeitos de cegueira/surdez ou doenças.','70 PV recuperados (fixos)','18 m','—','+10 PV por nível de espaço acima do 6º.','',{kind:'cura'}),
  'Globo de Invulnerabilidade':S('Barreira impede que magias de nível inferior ao limiar afetem criaturas dentro do globo.','Não causa dano','Pessoal','—','Bloqueia magias de nível 5 ou menor','',{duration:'Concentração, até 1 minuto'}),
  'Viagem Planar':S('Transporta criaturas voluntárias para outro plano; exige componente material especial e definição do destino.','Não causa dano','Toque','—','Viagem entre planos',''),
  'Teletransporte':S('Transporta você e até oito criaturas voluntárias para destino escolhido, com chance de desvio conforme familiaridade.','Não causa dano','3 m','—','Viagem instantânea',''),
  'Regeneração':S('Recupera 4d8+15 PV inicialmente e mais 1 PV por turno; pode restaurar membros perdidos.','4d8+15 de cura inicial','Toque','—','1 PV no início de cada turno','4d8+15',{kind:'cura',duration:'1 hora'}),
  'Labirinto':S('Prende criatura em labirinto extradimensional; ações e testes de Inteligência podem permitir fuga.','Não causa dano','18 m','Teste de INT para escapar','Isolamento temporário','',{duration:'Concentração, até 10 minutos'}),
  'Palavra de Poder Atordoar':S('Atordoa criatura com até 150 PV atuais; o alvo tenta se libertar por resistência de Constituição.','Não causa dano','18 m','Resistência de CON após o efeito','Alvo até 150 PV',''),
  'Explosão Solar':S('Grande área radiante. Resistência de Constituição reduz o dano pela metade e pode evitar cegueira.','12d6 radiante','45 m','Resistência de CON','Pode causar cegueira','12d6'),
  'Desejo':S('Reproduz uma magia de nível até 8 sem requisitos normais ou tenta efeito maior definido pelo Mestre.','Depende da magia reproduzida','Pessoal','Depende','Poder narrativo e risco ao usar desejos extraordinários',''),
  'Parar o Tempo':S('Você realiza 1d4+1 turnos consecutivos; o efeito termina ao afetar outra criatura ou objeto carregado por ela.','Não causa dano','Pessoal','—','1d4+1 turnos extras','1d4+1',{kind:'pool'}),
  'Ressurreição Verdadeira':S('Restaura à vida criatura morta há até 200 anos sob condições especiais; recupera PV por completo.','Não causa dano','Toque','—','Ressurreição plena','',{time:'1 hora'}),
  'Palavra de Poder Matar':S('Mata criatura que possa ver se ela tiver 100 PV atuais ou menos; se tiver mais, não produz efeito.','Morte instantânea se alvo ≤100 PV','18 m','Sem resistência inicial','Não rola dados de dano','')
 };
 const weaponDetails={
  'Adaga': ['1d4 perfurante','Corpo a corpo 1,5 m; arremesso 6/18 m','Acuidade, leve, arremesso. Escolha FOR ou DES para ataque e dano.'],
  'Espada curta':['1d6 perfurante','Corpo a corpo 1,5 m','Acuidade e leve; pode usar FOR ou DES.'],
  'Espada longa':['1d8 cortante (1d10 com duas mãos)','Corpo a corpo 1,5 m','Versátil. Usa FOR; com duas mãos aumenta o dado para 1d10.'],
  'Espada grande':['2d6 cortante','Corpo a corpo 1,5 m','Pesada, duas mãos; usa FOR.'],
  'Machado de batalha':['1d8 cortante (1d10 com duas mãos)','Corpo a corpo 1,5 m','Versátil; usa FOR.'],
  'Machado grande':['1d12 cortante','Corpo a corpo 1,5 m','Pesado e duas mãos; usa FOR.'],
  'Maça':['1d6 concussão','Corpo a corpo 1,5 m','Arma simples corpo a corpo; usa FOR.'],
  'Clava':['1d4 concussão','Corpo a corpo 1,5 m','Leve; usa FOR.'],
  'Cajado':['1d6 concussão (1d8 com duas mãos)','Corpo a corpo 1,5 m','Versátil; usa FOR.'],
  'Lança':['1d6 perfurante (1d8 com duas mãos)','Corpo a corpo 1,5 m; arremesso 6/18 m','Versátil e arremesso; usa FOR.'],
  'Arco curto':['1d6 perfurante','Distância 24/96 m','Munição, duas mãos; usa DES.'],
  'Arco longo':['1d8 perfurante','Distância 45/180 m','Munição, pesado, duas mãos; usa DES.'],
  'Besta leve':['1d8 perfurante','Distância 24/96 m','Munição, recarga, duas mãos; usa DES.'],
  'Martelo de guerra':['1d8 concussão (1d10 com duas mãos)','Corpo a corpo 1,5 m','Versátil; usa FOR.']
 };
 const armors={
  'Sem armadura':['CA 10 + DES','Sem armadura equipada. Outras habilidades podem substituir essa fórmula.'],
  'Acolchoada':['CA 11 + DES','Armadura leve, impõe desvantagem em Furtividade.'],
  'Couro':['CA 11 + DES','Armadura leve.'],
  'Couro batido':['CA 12 + DES','Armadura leve.'],
  'Peles':['CA 12 + DES (máx. +2)','Armadura média.'],
  'Camisão de malha':['CA 13 + DES (máx. +2)','Armadura média.'],
  'Brunea':['CA 14 + DES (máx. +2)','Armadura média; desvantagem em Furtividade.'],
  'Peitoral':['CA 14 + DES (máx. +2)','Armadura média.'],
  'Meia armadura':['CA 15 + DES (máx. +2)','Armadura média; desvantagem em Furtividade.'],
  'Cota de anéis':['CA 14','Armadura pesada; desvantagem em Furtividade.'],
  'Cota de malha':['CA 16','Armadura pesada; exige FOR 13 para evitar redução do deslocamento; desvantagem em Furtividade.'],
  'Cota de talas':['CA 17','Armadura pesada; exige FOR 15 para evitar redução do deslocamento; desvantagem em Furtividade.'],
  'Armadura de placas':['CA 18','Armadura pesada; exige FOR 15 para evitar redução do deslocamento; desvantagem em Furtividade.'],
  'Escudo':['+2 CA','Exige empunhar o escudo em uma mão.']
 };
 const otherGear={
  'Mochila':['Transporte','Armazena equipamentos durante uma viagem. Confira a carga transportada.'],
  'Corda de cânhamo (15 m)':['Exploração','Permite escalar, prender ou improvisar amarrações. Testes dependem da situação.'],
  'Tocha':['Iluminação','Luz intensa num raio de 6 m, penumbra por mais 6 m; dura aproximadamente 1 hora.'],
  'Rações (1 dia)':['Suprimentos','Alimento para aproximadamente um dia de viagem.'],
  'Poção de cura':['2d4+2 PV recuperados','Consumir para recuperar pontos de vida; não ultrapassa o máximo.'],
  'Kit de aventureiro':['Exploração','Conjunto de itens de uso cotidiano, cordas, tochas e suprimentos; confira itens incluídos.']
 };
 const diceSpec=expression=>{
   const match=/^(\d+)d(\d+)([+-]\d+)?$/.exec(expression||'');
   return match?{count:Number(match[1]),faces:Number(match[2]),bonus:Number(match[3]||0)}:null;
 };
 const levelFactor=l=>l>=17?4:l>=11?3:l>=5?2:1;
 function formulaFor(name,characterLevel,slotLevel){
   const sp=spells[name];if(!sp||!sp.roll)return null;
   const base=diceSpec(sp.roll);if(!base)return null;
   const spellLevel=(window.DNDV5?.SPELLS||[]).find(x=>x[0]===name)?.[1]??0;
   const slot=Math.max(spellLevel,Math.min(9,Number(slotLevel)||spellLevel));
   const step=diceSpec(sp.upcast),factor=levelFactor(Math.max(1,Number(characterLevel)||1));
   const dice={...base};
   if(sp.scale==='cantrip')dice.count*=factor;
   if(step&&slot>spellLevel&&spellLevel>0&&step.faces===dice.faces){dice.count+=(slot-spellLevel)*step.count;}
   const multiple=sp.scale==='beams'?factor:Math.max(1,(sp.multi||1)+(slot-spellLevel)*(sp.multiUpcast||0));
   return {count:dice.count,faces:dice.faces,bonus:dice.bonus,multiple,addMod:!!sp.addMod,kind:sp.kind||'dano',
    label:multiple>1?multiple+' × ('+dice.count+'d'+dice.faces+(dice.bonus>0?'+':'')+(dice.bonus||'')+(sp.addMod?' + mod. conjuração':'')+')':dice.count+'d'+dice.faces+(dice.bonus?String(dice.bonus>=0?'+':'')+dice.bonus:'')+(sp.addMod?' + mod. conjuração':'')};
 }
 function roll(expression,modifier=0,critical=false){
  const value=diceSpec(expression);if(!value)return null;
  const rolled=[];for(let i=0;i<value.count*(critical?2:1);i++){
   let n;const rng=new Uint32Array(1);
   if(typeof crypto!=='undefined'&&crypto.getRandomValues){crypto.getRandomValues(rng);n=1+(rng[0]%value.faces);}else n=1+Math.floor(Math.random()*value.faces);
   rolled.push(n);
  }
  return {dice:rolled,base:rolled.reduce((a,b)=>a+b,0),total:rolled.reduce((a,b)=>a+b,0)+value.bonus+modifier};
 }
 function rollSpell(name,characterLevel,slotLevel,casterMod=0){
  const f=formulaFor(name,characterLevel,slotLevel);if(!f)return null;
  const outputs=[];for(let i=0;i<f.multiple;i++){
    const result=roll(f.count+'d'+f.faces+(f.bonus>=0?'+':'')+f.bonus,f.addMod?casterMod:0);outputs.push(result);
  }
  return {name,formula:f.label,results:outputs,total:outputs.reduce((sum,r)=>sum+r.total,0),kind:f.kind};
 }
 function gearDetail(gear){
   const [name,type,weight,base,stat,damageType,price]=gear;
   if(type==='arma'){
     const raw=weaponDetails[name]||[(base||'—')+' '+damageType,'Consulte as propriedades da arma','Arma registrada no inventário e nos ataques.'];
     return {damage:raw[0],range:raw[1],effect:raw[2],weight,price,type};
   }
   const raw=armors[name]||otherGear[name]||['Sem dano direto','Equipamento comum de exploração.'];
   return {damage:raw[0],range:'—',effect:raw[1],weight,price,type};
 }
 const allSpells=()=>Object.keys(spells);
 window.DNDSpellDetails={get:name=>spells[name]||null,allSpells,formulaFor,rollSpell,gearDetail,roll,weaponDetails};
})();