/* Índice de magias do Bruxo — Livro do Jogador 2014, cap. 11, p. 210 da edição enviada.
   Magias expandidas dos patronos: Arquifada, Corruptor e Grande Antigo, cap. 3.
   Nomes, níveis, vínculos e dados mecânicos reorganizados. Explicações originais e concisas:
   não substituem o texto dos livros. Modo 2024 NÃO é automático. */
(function(){
 'use strict';
 if(!window.DNDV5||!window.DNDSpellDetails)return;
 const v5=window.DNDV5, details=window.DNDSpellDetails;
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const base={
  0:'Amizade|Ataque Certeiro|Ilusão Menor|Mãos Mágicas|Prestidigitação|Proteção contra Lâminas|Rajada de Veneno|Rajada Mística|Toque Arrepiante',
  1:'Armadura de Agathys|Braços de Hadar|Bruxaria|Compreender Idiomas|Enfeitiçar Pessoa|Escrita Ilusória|Proteção contra o Bem e Mal|Raio de Bruxa|Recuo Acelerado|Repreensão Infernal|Servo Invisível',
  2:'Cativar|Coroa da Loucura|Despedaçar|Escuridão|Imobilizar Pessoa|Invisibilidade|Nuvem de Adagas|Passo Nebuloso|Patas de Aranha|Raio do Enfraquecimento|Reflexos|Sugestão',
  3:'Círculo Mágico|Contramágica|Dissipar Magia|Fome de Hadar|Forma Gasosa|Idiomas|Imagem Maior|Remover Maldição|Medo|Padrão Hipnótico|Toque Vampírico|Voo',
  4:'Banimento|Porta Dimensional|Malogro|Terreno Alucinógeno',
  5:'Contato Extraplanar|Imobilizar Monstro|Sonho|Vidência',
  6:'Ataque Visual|Círculo da Morte|Conjurar Fada|Criar Mortos-Vivos|Carne para Pedra|Portal Arcano|Sugestão em Massa|Visão da Verdade',
  7:'Dedo da Morte|Forma Etérea|Prisão de Energia|Viagem Planar',
  8:'Dominar Monstro|Enfraquecer o Intelecto|Loquacidade|Palavra de Poder Atordoar|Semiplano',
  9:'Aprisionamento|Metamorfose Verdadeira|Palavra de Poder Matar|Projeção Astral|Sexto Sentido'
 };
 const patrons={
  Arquifada:{1:'Fogo das Fadas|Sono',2:'Acalmar Emoções|Força Fantasmagórica',3:'Piscar|Ampliar Plantas',4:'Dominar Besta|Invisibilidade Maior',5:'Dominar Pessoa|Similaridade'},
  Corruptor:{1:'Mãos Flamejantes|Comando',2:'Cegueira/Surdez|Raio Ardente',3:'Bola de Fogo|Névoa Fétida',4:'Escudo de Fogo|Muralha de Fogo',5:'Coluna de Chamas|Consagrar'},
  'Grande Antigo':{1:'Sussurros Dissonantes|Riso Histérico de Tasha',2:'Detectar Pensamentos|Força Fantasmagórica',3:'Clarividência|Enviar Mensagem',4:'Dominar Besta|Tentáculos Negros de Evard',5:'Dominar Pessoa|Telecinese'}
 };
 const spec={};
 // Registrar: nome, descrição do efeito, dano/cura, alcance, salvaguarda/ataque, dados para rolagem,
 // escalonamento; propriedades num objeto no último argumento (tempo, duração, concentração, etc.).
 const A=(name,effect,damage='Não causa dano direto',range='Consulte o Livro do Jogador',save='—',roll='',scaling='',more={})=>{
  spec[name]={effect,damage,range,save,roll,scaling,time:more.time||'1 ação',duration:more.duration||'Instantânea',
   upcast:more.upcast,scale:more.scale,kind:more.kind,multi:more.multi,multiUpcast:more.multiUpcast,
   addMod:more.addMod,bonus:more.bonus,school:more.school||'Arcana',concentration:!!more.concentration,ritual:!!more.ritual};
 };
 A('Amizade','Concede vantagem em testes de Carisma direcionados a uma criatura; depois ela percebe a influência mágica.','Não causa dano','Pessoal','—','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Ataque Certeiro','Proporciona vantagem no primeiro ataque contra o alvo no próximo turno, mantendo concentração (2014).','Não causa dano','9 m','—','','',{duration:'Concentração, até 1 rodada',concentration:true});
 A('Ilusão Menor','Cria um som ou imagem estática ilusória; criaturas podem investigar e descobrir a ilusão.','Não causa dano','9 m','Investigação contra CD','','',{duration:'1 minuto'});
 A('Proteção contra Lâminas','Concede resistência a dano concussão, cortante e perfurante de ataques armados até o fim do próximo turno.','Reduz dano recebido','Pessoal','—','','',{duration:'1 rodada'});
 A('Rajada de Veneno','Névoa tóxica atinge uma criatura próxima; resistência de Constituição anula o dano.','1d12 veneno','3 m','Resistência CON','1d12','2d12/3d12/4d12 nos níveis 5/11/17',{scale:'cantrip'});
 A('Toque Arrepiante','Ataque mágico à distância que impede recuperar PV até o próximo turno; mortos-vivos têm desvantagem ao atacar você.','1d8 necrótico','36 m','Ataque mágico','1d8','2d8/3d8/4d8 nos níveis 5/11/17',{scale:'cantrip'});
 A('Braços de Hadar','Tentáculos sombrios atacam criaturas em raio de 3 m; falha na resistência impede reações.','2d6 necrótico','Pessoal: 3 m','Resistência FOR','2d6','+1d6 por nível de espaço acima do 1º',{upcast:'1d6'});
 A('Bruxaria','Amaldiçoa alvo; causa 1d6 necrótico EXTRA cada vez que você o acerta com um ataque e impõe desvantagem nos testes de habilidade de atributo escolhido.','+1d6 necrótico por acerto','27 m','Sem resistência inicial','1d6','Espaços superiores aumentam a duração, não os dados',{duration:'Concentração, até 1 hora (ou mais)',time:'1 ação bônus',concentration:true});
 A('Enfeitiçar Pessoa','Humanoide faz resistência de Sabedoria ou fica enfeitiçado; percebe o encanto ao término.','Não causa dano','9 m','Resistência SAB','','+1 alvo por nível de espaço acima do 1º',{duration:'1 hora'});
 A('Escrita Ilusória','Esconde mensagens por ilusão em um texto, revelando conteúdo diferente a leitores selecionados.','Não causa dano','Toque','—','','',{time:'1 minuto',duration:'10 dias',ritual:true});
 A('Raio de Bruxa','Ataque mágico à distância; acertando, cria vínculo elétrico que pode causar dano adicional em turnos seguintes enquanto concentrado.','1d12 elétrico (inicial)','9 m','Ataque mágico','1d12','Dano do acerto inicial +1d12 por nível acima do 1º; dano repetido continua 1d12',{upcast:'1d12',concentration:true,duration:'Concentração, até 1 minuto'});
 A('Recuo Acelerado','Permite usar Disparada como ação bônus a cada turno enquanto durar.','Não causa dano','Pessoal','—','','',{time:'1 ação bônus',duration:'Concentração, até 10 minutos',concentration:true});
 A('Repreensão Infernal','Reação quando sofre dano de criatura visível próxima: chamas a atingem; sucesso na resistência reduz dano à metade.','2d10 fogo','18 m','Resistência DES','2d10','+1d10 por nível de espaço acima do 1º',{upcast:'1d10',time:'1 reação'});
 A('Cativar','Distrai criaturas com palavras; concede desvantagem em Percepção para notar outros indivíduos.','Não causa dano','18 m','Resistência SAB','','',{duration:'1 minuto'});
 A('Coroa da Loucura','Enfeitiça humanoide e pode forçá-lo a atacar criatura escolhida; manutenção exige ação do conjurador.','Ataque forçado pelo alvo','36 m','Resistência SAB','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Despedaçar','Explosão sonora em esfera de 3 m; resistência de Constituição reduz dano pela metade.','3d8 trovejante','18 m','Resistência CON','3d8','+1d8 por nível de espaço acima do 2º',{upcast:'1d8'});
 A('Escuridão','Gera esfera de escuridão mágica que bloqueia visão normal; Visão Diabólica pode atravessá-la.','Não causa dano','18 m','—','','',{duration:'Concentração, até 10 minutos',concentration:true});
 A('Imobilizar Pessoa','Humanoide falha resistência de Sabedoria e fica paralisado; pode repetir a resistência nos turnos.','Não causa dano direto','18 m','Resistência SAB','','+1 humanoide por nível de espaço acima do 2º',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Nuvem de Adagas','Área de cubo de 1,5 m preenchida por lâminas; criaturas que entrarem ou começarem turno na área sofrem dano.','4d4 cortante','18 m','Sem resistência no efeito básico','4d4','+2d4 por nível de espaço acima do 2º',{upcast:'2d4',duration:'Concentração, até 1 minuto',concentration:true});
 A('Patas de Aranha','Permite subir paredes e tetos com as mãos livres, sem testes de escalada normais.','Não causa dano','Toque','—','','',{duration:'Concentração, até 1 hora',concentration:true});
 A('Raio do Enfraquecimento','Ataque mágico que reduz pela metade o dano de ataques de arma baseados em FOR; alvo tenta resistência CON a cada turno.','Reduz dano de armas do alvo','18 m','Ataque mágico; resistência CON','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Reflexos','Cria três duplicatas ilusórias que podem absorver ataques destinados ao conjurador.','Não causa dano','Pessoal','Rolagem para redirecionar ataques','','',{duration:'1 minuto'});
 A('Sugestão','Propõe uma atividade razoável a uma criatura; resistência de Sabedoria impede a influência.','Não causa dano','9 m','Resistência SAB','','',{duration:'Concentração, até 8 horas',concentration:true});
 A('Círculo Mágico','Cria proteção circular contra criaturas extraplanares de certos tipos; pode conter alvos ou impedir aproximação.','Não causa dano','3 m','—','','+1 hora por nível de espaço acima do 3º',{time:'1 minuto',duration:'1 hora'});
 A('Fome de Hadar','Esfera de 6 m: escuridão e tentáculos. Dano de frio ao iniciar turno e ácido ao terminar em falha na resistência.','2d6 frio + 2d6 ácido (gatilhos distintos)','45 m','Resistência DES no dano ácido','2d6','2d6 por tipo; não aumenta dano ao usar espaço maior',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Forma Gasosa','Transforma uma criatura em névoa; pode flutuar e infiltrar-se em espaços estreitos, com limitações.','Não causa dano','Toque','—','','',{duration:'Concentração, até 1 hora',concentration:true});
 A('Idiomas','Permite a uma criatura entender e ser entendida em idiomas falados.','Não causa dano','Toque','—','','',{duration:'1 hora'});
 A('Imagem Maior','Cria ilusão visual/auditiva/térmica realista; criaturas podem investigar e descobrir a ilusão.','Não causa dano','36 m','Investigação contra CD','','Em espaços de 6º ou maior pode permanecer até dissipar',{duration:'Concentração, até 10 minutos',concentration:true});
 A('Remover Maldição','Remove uma maldição de uma criatura ou objeto, com condições específicas para itens amaldiçoados.','Não causa dano','Toque','—');
 A('Medo','Cone de 9 m; alvos que falham resistência SAB ficam amedrontados e podem fugir.','Não causa dano','Pessoal: cone de 9 m','Resistência SAB','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Toque Vampírico','Ataque mágico corpo a corpo; causa dano necrótico e recupera PV iguais à metade do dano causado.','3d6 necrótico + cura de metade do dano','Pessoal: toque','Ataque mágico','3d6','+1d6 por nível de espaço acima do 3º',{upcast:'1d6',duration:'Concentração, até 1 minuto',concentration:true});
 A('Voo','Concede deslocamento de voo; encerrar efeito em altura causa queda.','Não causa dano','Toque','—','','+1 criatura por nível de espaço acima do 3º',{duration:'Concentração, até 10 minutos',concentration:true});
 A('Malogro','Criatura faz resistência CON; falha recebe alto dano necrótico, sucesso recebe metade.','8d8 necrótico','9 m','Resistência CON','8d8','+1d8 por nível de espaço acima do 4º',{upcast:'1d8'});
 A('Terreno Alucinógeno','Altera a aparência de um grande terreno; criaturas podem perceber inconsistências e resistir à ilusão.','Não causa dano','90 m','Investigação contra CD','','',{time:'10 minutos',duration:'24 horas'});
 A('Contato Extraplanar','Consulta entidade de outro plano com perguntas de respostas curtas; falha em resistência INT pode causar insanidade temporária.','Não causa dano','Pessoal','Resistência INT','','',{time:'1 minuto',ritual:true});
 A('Imobilizar Monstro','Paralisa criatura em falha na resistência SAB; pode repetir ao fim de cada turno.','Não causa dano','27 m','Resistência SAB','','+1 criatura por nível de espaço acima do 5º',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Sonho','Envia mensageiro onírico a criatura adormecida; opção hostil pode causar dano psíquico e impedir descanso.','3d6 psíquico (versão hostil)','Especial','Resistência SAB (versão hostil)','3d6','Não aumenta com espaço superior',{time:'1 minuto',duration:'8 horas'});
 A('Vidência','Observa criatura à distância por sensor mágico; ela pode resistir com Sabedoria.','Não causa dano','Pessoal','Resistência SAB','','',{time:'10 minutos',duration:'Concentração, até 10 minutos',concentration:true});
 A('Ataque Visual','Olhar terrível produz efeitos escolhidos de doença, sono ou pânico em criatura que falhar resistência SAB.','Não causa dano direto','Pessoal: 18 m','Resistência SAB','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Círculo da Morte','Esfera enorme de energia necrótica atinge criaturas; sucesso na resistência CON reduz à metade.','8d6 necrótico','45 m','Resistência CON','8d6','+2d6 por nível de espaço acima do 6º',{upcast:'2d6'});
 A('Conjurar Fada','Invoca criatura feérica mediante ritual prolongado; estatísticas e ações dependem do ND e da criatura.','Depende da fada conjurada','27 m','—','','',{time:'1 minuto',duration:'Concentração, até 1 hora',concentration:true});
 A('Criar Mortos-Vivos','Anima cadáveres como servos mortos-vivos; criaturas criadas dependem do nível da magia e do corpo disponível.','Depende dos mortos-vivos','3 m','—','','',{time:'1 minuto',duration:'Instantânea'});
 A('Carne para Pedra','Transforma alvo em pedra após sucessivas resistências CON; petrificação pode tornar-se permanente.','Não causa dano','18 m','Resistência CON','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Portal Arcano','Abre dois portais de passagem conectados em pontos visíveis.','Não causa dano','150 m','—','','',{duration:'Concentração, até 10 minutos',concentration:true});
 A('Sugestão em Massa','Influencia até doze criaturas que falharem resistência SAB a seguir atividade possível.','Não causa dano','18 m','Resistência SAB','','',{duration:'24 horas'});
 A('Visão da Verdade','Permite enxergar invisíveis, ilusões e transformações na área da visão verdadeira.','Não causa dano','Toque','—','','',{duration:'1 hora'});
 A('Dedo da Morte','Raio de energia necrótica; sucesso na resistência CON reduz dano à metade; humanoide morto pode erguer-se como zumbi.','7d8+30 necrótico','18 m','Resistência CON','7d8+30','Não escala por nível de espaço',{});
 A('Forma Etérea','Transita para Plano Etéreo e pode mover-se através de obstáculos no plano material.','Não causa dano','Pessoal','—','','',{duration:'Até 8 horas'});
 A('Prisão de Energia','Cria esfera ou jaula invisível de força; criaturas presas não atravessam barreiras normalmente.','Não causa dano','30 m','Resistência CAR para teletransporte','','',{duration:'1 hora'});
 A('Dominar Monstro','Controle mental de criatura em falha na resistência SAB; dano sofrido dá nova oportunidade de resistir.','Dano depende da criatura','18 m','Resistência SAB','','',{duration:'Concentração, até 1 hora',concentration:true});
 A('Enfraquecer o Intelecto','Explosão psíquica danifica a mente; resistência INT determina efeitos severos sobre INT e CAR.','4d6 psíquico','45 m','Resistência INT','4d6','Resistência pode impedir redução de INT/CAR');
 A('Loquacidade','Faz testes de Carisma para falar valerem pelo menos 15 no d20 e ajuda a disfarçar mentira magicamente.','Não causa dano','Pessoal','—','','',{duration:'1 hora'});
 A('Semiplano','Cria porta para sala extradimensional que pode servir de refúgio ou armazenamento.','Não causa dano','18 m','—','','',{duration:'1 hora'});
 A('Aprisionamento','Restringe uma criatura com ritual de aprisionamento escolhido; exige componente valioso e condições rigorosas.','Não causa dano','9 m','Resistência SAB','','',{time:'1 minuto',duration:'Até ser libertado'});
 A('Projeção Astral','Projeta formas astrais de viajantes para outros planos enquanto corpos ficam vulneráveis.','Não causa dano','3 m','—','','',{time:'1 hora',duration:'Especial'});
 A('Sexto Sentido','Concede percepção premonitória, vantagem em testes e inimigos desvantagem contra você.','Não causa dano','Toque','—','','',{duration:'8 horas'});
 // Magias expandidas: são OPÇÕES ADICIONAIS de aprender (não são automaticamente conhecidas em 2014).
 A('Fogo das Fadas','Criaturas em área fazem resistência DES ou ficam destacadas; ataques contra elas ganham vantagem e invisibilidade é suprimida.','Não causa dano','18 m','Resistência DES','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Acalmar Emoções','Pode suprimir medo ou encanto ou tornar criaturas temporariamente indiferentes.','Não causa dano','18 m','Resistência CAR','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Força Fantasmagórica','Ilusão em mente de criatura; falha na resistência INT pode fazê-la sofrer dano psíquico por turno.','1d6 psíquico/turno quando plausível','18 m','Resistência INT','1d6','Não escala por nível de espaço',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Piscar','Ao fim de cada turno pode desaparecer para o Plano Etéreo até o turno seguinte.','Não causa dano','Pessoal','Rolagem d20','','',{duration:'1 minuto'});
 A('Ampliar Plantas','Acelera crescimento vegetal para tornar área densamente difícil de atravessar.','Não causa dano','45 m','—','','',{time:'1 ação ou 8 horas',duration:'Instantânea'});
 A('Dominar Besta','Encanta e controla uma besta em falha na resistência SAB; sofrer dano permite nova resistência.','Dano depende da besta','18 m','Resistência SAB','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Dominar Pessoa','Encanta e controla humanoide em falha na resistência SAB.','Dano depende do alvo controlado','18 m','Resistência SAB','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Similaridade','Altera aparência de várias criaturas dentro do alcance.','Não causa dano','9 m','Resistência CAR para alvo resistente','','',{duration:'8 horas'});
 A('Mãos Flamejantes','Cone de chamas: sucesso na resistência DES reduz o dano à metade.','3d6 fogo','Pessoal: cone de 4,5 m','Resistência DES','3d6','+1d6 por nível acima do 1º',{upcast:'1d6'});
 A('Comando','Obriga alvo que falhar resistência SAB a executar comando simples e seguro.','Não causa dano','18 m','Resistência SAB','','+1 alvo por nível de espaço acima do 1º');
 A('Cegueira/Surdez','Pode cegar ou ensurdecer alvo que falhe resistência CON.','Não causa dano','9 m','Resistência CON','','+1 alvo por nível de espaço acima do 2º',{duration:'1 minuto'});
 A('Névoa Fétida','Nuvem venenosa fortemente obscurecida força resistências CON, podendo fazer criaturas perderem ação vomitando.','Não causa dano','27 m','Resistência CON','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Muralha de Fogo','Parede em chamas causa dano por proximidade/atravessamento; sucesso na resistência inicial reduz à metade.','5d8 fogo','36 m','Resistência DES','5d8','+1d8 por nível de espaço acima do 4º',{upcast:'1d8',duration:'Concentração, até 1 minuto',concentration:true});
 A('Coluna de Chamas','Coluna de energia flamejante e sagrada; resistência DES reduz dano pela metade.','4d6 fogo + 4d6 radiante','18 m','Resistência DES','8d6','+1d6 fogo ou radiante por nível de espaço acima do 5º',{upcast:'1d6'});
 A('Consagrar','Santifica terreno, impedindo certos seres e impondo efeitos especiais escolhidos na área.','Não causa dano','Toque','Resistência CAR situacional','','',{time:'24 horas',duration:'Até ser dissipado'});
 A('Sussurros Dissonantes','Sussurros perturbadores ferem mente em falha SAB e forçam alvo a fugir usando reação.','3d6 psíquico','18 m','Resistência SAB','3d6','+1d6 por nível de espaço acima do 1º',{upcast:'1d6'});
 A('Riso Histérico de Tasha','Deixa alvo caído e incapacitado por riso em falha SAB; novas resistências permitem encerrar.','Não causa dano','9 m','Resistência SAB','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Detectar Pensamentos','Lê pensamentos superficiais de criaturas; sondagens profundas exigem resistência SAB.','Não causa dano','Pessoal: raio de 9 m','Resistência SAB para sondagem','','',{duration:'Concentração, até 1 minuto',concentration:true});
 A('Clarividência','Invoca sensor remoto de visão ou audição num local escolhido.','Não causa dano','1,5 km','—','','',{time:'10 minutos',duration:'Concentração, até 10 minutos',concentration:true});
 A('Enviar Mensagem','Envia mensagem telepática curta a criatura familiar, com resposta possível.','Não causa dano','Ilimitado, com restrições planares','—');
 A('Tentáculos Negros de Evard','Área de tentáculos cria terreno difícil; criaturas podem ficar impedidas e sofrem dano de concussão.','3d6 concussão por turno afetado','27 m','Resistência DES','3d6','Não escala por nível de espaço',{duration:'Concentração, até 1 minuto',concentration:true});
 const aliases={
  'Proteção contra o Bem e Mal':'Proteção Contra o Bem e o Mal',
  'Enfraquecer o Intelecto':'Enfraquecer Intelecto',
  'Metamorfose Verdadeira':'Metamorfose Verdadeira',
  'Coluna de Chamas':'Coluna de Chamas',
  'Oração Curativa':'Oração Curativa'
 };
 const known=new Map(v5.SPELLS.map(x=>[normalize(x[0]),x]));
 const allBaseline=new Set(), patronByName=new Map(), patronByKey=new Map();
 const expand=(text)=>text.split('|').map(x=>x.trim()).filter(Boolean);
 function ensure(name,level,patron){
  const alias=aliases[name]||name;
  const old=known.get(normalize(alias))||known.get(normalize(name));
  const md=spec[name]||spec[alias],row=old||[name,Number(level),md?.school||'Variada','',md?.concentration?1:0,md?.ritual?1:0,'V,S',md?.effect||'Consulte o Livro do Jogador 2014 para os efeitos e condições.'];
  if(!old){v5.SPELLS.push(row);known.set(normalize(name),row);}
  if(!patron){
   allBaseline.add(row[0]);row[3]=[...new Set([...row[3].split(',').filter(Boolean),'Bruxo'])].join(',');
  }else{
   const group=patronByName.get(row[0])||[];
   if(!group.includes(patron))group.push(patron);
   patronByName.set(row[0],group);
  }
  if(md){
   const data={...md,source:'Livro do Jogador 2014',patrons:patronByName.get(row[0])||[],isMysticArcanum:!patron&&Number(level)>=6};
   const prior=window.DNDSpellDetails.get(row[0]);
   // Mantém os efeitos e dados de magias já registradas quando estavam completos.
   const completed=prior&&prior.damage&&prior.damage!=='Não informado'&&prior.effect?.length>24;
   info.set(row[0],completed?{...data,...prior,patrons:patronByName.get(row[0])||[],isMysticArcanum:Number(level)>=6}:data);
   if(!old){row[4]=data.concentration?1:0;row[5]=data.ritual?1:0;}
  }
  return row;
 }
 const info=new Map();
 Object.entries(base).forEach(([lvl,names])=>expand(names).forEach(name=>ensure(name,lvl,'')));
 Object.entries(patrons).forEach(([patron,groups])=>Object.entries(groups).forEach(([lvl,names])=>expand(names).forEach(name=>ensure(name,lvl,patron))));
 const prevGet=details.get.bind(details),prevFormula=details.formulaFor.bind(details),prevRoll=details.rollSpell.bind(details);
 details.get=name=>info.get(name)||prevGet(name);
 const levelFactor=l=>l>=17?4:l>=11?3:l>=5?2:1;
 function computed(name,characterLevel,slotLevel){
  const data=info.get(name);if(!data?.roll)return null;
  const rx=/^(\d+)d(\d+)([+-]\d+)?$/;const parts=rx.exec(data.roll);if(!parts)return null;
  const rec=v5.SPELLS.find(x=>x[0]===name);const lv=rec?.[1]||0;
  const slot=lv<=5?Math.max(lv,Math.min(9,Number(slotLevel)||lv)):lv;
  let dice=Number(parts[1]),faces=Number(parts[2]),bonus=Number(parts[3]||0);
  if(data.scale==='cantrip')dice*=levelFactor(Math.max(1,Number(characterLevel)||1));
  const extra=/^(\d+)d(\d+)$/.exec(data.upcast||'');
  if(extra&&extra[2]==String(faces)&&lv>0&&slot>lv)dice+=Number(extra[1])*(slot-lv);
  const multiple=data.multi?data.multi+(slot-lv)*(data.multiUpcast||0):1;
  return {count:dice,faces,bonus,multiple,addMod:!!data.addMod,kind:data.kind||'dano',label:(multiple>1?multiple+' × (':'')+dice+'d'+faces+(bonus?((bonus>0?'+':'')+bonus):'')+(data.addMod?' + mod. conjuração':'')+(multiple>1?')':'')};
 }
 details.formulaFor=(name,l,slot)=>info.has(name)?computed(name,l,slot):prevFormula(name,l,slot);
 details.rollSpell=(name,l,slot,casterMod=0)=>{
  if(!info.has(name))return prevRoll(name,l,slot,casterMod);
  const f=computed(name,l,slot);if(!f)return null;
  const results=Array.from({length:f.multiple},()=>details.roll(f.count+'d'+f.faces+(f.bonus>0?'+':'')+f.bonus,f.addMod?casterMod:0));
  return {name,formula:f.label,results,total:results.reduce((s,r)=>s+r.total,0),kind:f.kind};
 };
 details.allSpells=()=>[...new Set([...v5.SPELLS.map(x=>x[0])])];
 const needed={6:11,7:13,8:15,9:17};
 window.DNDPHB2014={
  baseNames:()=>[...allBaseline],
  baselineByLevel:l=>expand(base[l]||''),
  patrons:()=>Object.keys(patrons),
  expandedNames:patron=>Object.values(patrons[patron]||{}).flatMap(expand),
  forPatron:(name,patron)=>allBaseline.has(name)||(patronByName.get(name)||[]).includes(patron),
  isExpanded:(name,patron)=>!allBaseline.has(name)&&(patronByName.get(name)||[]).includes(patron),
  requiredWarlockLevel:spellLevel=>needed[spellLevel]||null,
  get:name=>info.get(name)||details.get(name),
  stats:()=>({baseline:allBaseline.size,patron:Array.from(patronByName.keys()).length,all:v5.SPELLS.length})
 };
})();