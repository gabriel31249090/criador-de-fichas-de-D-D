# Auditoria técnica do Criador de Fichas D&D — 15/10/2026

**Repositório:** `gabriel31249090/criador-de-fichas-de-D-D`  
**Publicação:** https://criador-fichas-dnd-gabriel.vercel.app/  
**Branch de execução:** `audit/full-site-stability-20261015`

## Escopo auditado

Código e estrutura estática do site, ficha de personagem, cálculos de combate, recursos de Bruxo, descanso, seleção de magias/itens, espécies 2014/2024, ferramentas de Mestre, PWA/cache, arquivos HTML modular/standalone, testes no GitHub Actions e políticas SQL de campanha (revisão estática).

**Método:** leitura dos módulos do próprio repositório; testes estáticos de sintaxe, integridade de referências e sincronização; testes end-to-end Chromium em telas de computador e celular; verificação de deploy na Vercel. Não houve teste com usuários simultâneos conectados a um Supabase real. A presença de um botão não prova implementação integral de todas as regras D&D.

## Achados corrigidos nesta auditoria

| Prioridade | Achado | Correção |
|---|---|---|
| Alta | A Rajada Mística no motor V6 escalava os **dados por feixe** e, ao mesmo tempo, a **quantidade de feixes**: dano incorreto nos níveis 5/11/17. | Mantida a escalada apenas dos feixes (2/3/4), cada feixe com 1d10, preservando outros truques que escalam dados. |
| Alta | Descanso curto exigia gastar pelo menos um Dado de Vida, mesmo quando o jogador queria apenas recuperar os espaços de Magia de Pacto e recursos de descanso curto. | Adicionado suporte a **zero Dados de Vida** sem curar PV e sem exigir dados disponíveis. |
| Média | Entrada não finita na função de mitigação de dano podia retornar `NaN` e contaminar os totais. | Dano não numérico/infinito agora resulta em 0 na rotina de mitigação. |
| Média | Código duplicado em `index.html` e `site.html` podia se desalinhar dos módulos em `src/`. | Alterações sincronizadas e teste automático de paridade para detectar regressões. |
| Média | Verificação limitada de cache PWA, arquivos embutidos, recursos offline, salvamento e cálculos cruzados. | Adicionada suíte estática e suíte de navegador, integradas ao GitHub Actions. |

## Pontos verificados ou cobertos por testes

- Cálculo automático de PV, incluindo progressão de Guerreiro e antecedente 2024, já coberto pela bateria do compêndio.
- Catálogo e filtros: Bruxo 2014, três patronos, escolha de magias, Arcanos Místicos, descrições e dados; testes existentes foram mantidos.
- Inventário, ataque de arma, rolagem de poção, gerador de encontros por XP.
- Contagem de espaços de Magia de Pacto para Bruxo no nível 5; descanso curto com 0 Dados de Vida.
- Rolagem de Rajada Mística nos níveis 1/5/11/17 e escalonamento separado de outros truques.
- Imunidade, resistência e tratamento de dano inválido.
- Salvamento local após recarregar, carregamento do HTML standalone, navegação e possíveis excessos de largura em mobile.
- Integridade de módulos e arquivos referenciados pelo service worker/PWA.

**Execução:** `node tests/audit-static.cjs`, `node tests/compendium.spec.cjs`, `node tests/audit-regression.spec.cjs` (Chromium/Playwright). Os testes são executados na verificação de PR.

## Limitações ainda abertas

### Alta prioridade

1. **Modo 2024/5.5 parcial:** há espécies e atributos de antecedente 2024, mas o conjunto completo de classes, talentos, backgrounds, armas com maestria e magias 2024 não está implementado nem testado contra o Livro do Jogador 2024. Não tratar o seletor de edição como compatibilidade total.
2. **Conjuração avançada incompleta:** o compêndio registra cerca de 168 magias 2014 com descrição e prévia de rolagem, enquanto o **motor tático V6 inclui apenas 18** magias com resolução mecânica assistida; os efeitos situacionais e condições específicas exigem o Mestre.
3. **Outras classes, magias e bestiário:** a lista-base do Bruxo 2014 foi auditada, mas o restante das classes ainda exige comparação exaustiva com suas listas. O bestiário tático V6 possui somente seis entradas de criaturas simples. A integração integral do Manual dos Monstros ainda não foi realizada.
4. **Campanha online:** o SQL e as permissões RLS estão no repositório, mas autenticação, autorização entre jogadores/Mestre e Realtime **não foram validadas em um projeto Supabase real**. Não afirmar que o multiplayer está pronto para produção sem testes de dois usuários e um Mestre.

### Média prioridade

5. **Seleção de espécies 2024:** traços raciais especializados, escolhas de linhagem e suas automatizações têm suporte parcial. O sistema também permite combinar espécies 2024 com mecânicas de classe 2014, quando o Mestre autorizar.
6. **Magias e itens especiais:** seleção e prévias funcionam, mas aplicação automática de dano a alvos, concentração, imunidades condicionais e propriedades especiais de itens nem sempre estão conectadas ao motor V6.
7. **Interface de Mestre:** o Guia do Mestre 2014 tem ferramentas de dificuldade de encontros e sugestões, mas os geradores não cobrem integralmente tesouro, ND, NPCs, armadilhas e masmorras.
8. **Impressão/PDF:** há opções de impressão, mas não foi feita validação visual página a página em várias impressoras e formatos. Verificação de acessibilidade completa (WCAG) e auditoria Lighthouse também permanecem pendentes.
9. **Distribuição HTML:** há manutenção redundante de scripts embutidos em `site.html` e `index.html`; a paridade é agora protegida por testes, mas uma etapa futura pode unificar o empacotamento em um único build.
10. **RLS/Regras online:** a leitura estática de `supabase/campaign.sql` não substitui testes automatizados de isolamento de dados com dois usuários. Nenhuma credencial ou chave secreta deve ser enviada ao repositório.

## Próximos passos recomendados

1. Construir testes multiusuário Supabase com ambiente de integração e credenciais exclusivamente de teste.
2. Isolar o catálogo de regras de 2014 e 2024 e mapear progressão, preparação de magias, Arcanos Místicos e espaços de Pacto de maneira explicitamente versionada.
3. Completar o mecanismo de combate para as magias catalogadas antes de prometer dano/aplicação automática em todos os feitiços.
4. Expandir bestiário e ferramentas de Mestre, respeitando as licenças/limitações do material utilizado.
5. Validar UX por teclado/leitor de tela, impressão A4, acessibilidade contrastes e performance sob dados grandes.

## Limites das conclusões

As correções acima têm código e verificações no GitHub. Os itens pendentes **não foram apresentados como corrigidos**. Os testes de navegador são uma amostragem controlada e não garantem ausência de bugs em todas as combinações de raça, classe, equipamentos e regras opcionais.
