# Ficha de Personagem D&D 5e · Versão 3

Ficha digital em português inspirada na ficha das páginas finais do *Livro do Jogador* de 2014. Funciona offline, sem login ou servidores.

## Como usar

**Opção mais simples:** baixe `site.html`, dê dois cliques e abra em um navegador moderno.

**Para editar código:** use `index.html`, `style.css` e `app.js` no mesmo diretório. `site.html` é a versão compilada em um arquivo só.

## Cinco funções novas

1. **Compra de atributos por 27 pontos:** seleção de valores 8–15, custo oficial e validação antes de aplicar.
2. **Biblioteca de personagens:** várias fichas, duplicação, troca e exclusão local.
3. **Descansos curtos e longos:** consumo de Dados de Vida, recuperação de PV e de espaços de magia.
4. **Condições de combate:** controle de condições e nível de exaustão.
5. **Inventário e moedas:** itens, quantidade, peso, capacidade de carga e conversão de moedas para PO.

## Correções e recursos mantidos

- Modificadores, salvaguardas, proficiências, especialização, testes d20 e percepção passiva.
- Rolagem de atributos (4d6, descarte do menor), conjunto padrão e distribuição automática por classe.
- Classe de Armadura por armadura, Destreza, escudo, exceções de Bárbaro/Monge e CA manual.
- Ataque contra CA fixa (regra normal) ou defesa ativa **opcional** (regra da mesa).
- PV máximos e atuais, dado de vida por classe, média fixa ou rolagens persistidas por nível, bônus extras, dano, cura e PV temporários.
- Espaços de magia de níveis 1–9 para conjuradores completos, meio conjuradores e bruxos. Modos manuais para exceções e subclasses.
- Descanso curto restaura espaços de Pacto do Bruxo; descanso longo restaura espaços e até metade dos Dados de Vida gastos (mínimo 1).
- Salvamento automático em `localStorage`, exportação e importação JSON, incluindo dados antigos em formato v2 quando possível.
- Três páginas organizadas para impressão e interface adaptável para celular.
- Ferramentas de mestre: gerador de NPC e estimativa simples de encontro.

## Regras e limitações

Esta ficha usa a 5ª edição de **2014** como padrão. Características especiais, raças com aumento de PV, talentos, multiclasse, listas de magias, ajustes de características, escudos e técnicas alternativas exigem revisão ou preenchimento manual. Para talentos que dão PV extras por nível, use **Extra por nível** no painel de PV. A progressão por Dados de Vida rolados não permite determinar retroativamente quais dados um personagem já havia rolado; revise os resultados se importar personagens de campanhas antigas.

**A CA não é rolada nas regras padrão do D&D.** O botão de defesa ativa é uma *regra da casa*. Mana também é opcional.

Os dados ficam no navegador em que a ficha foi aberta. Use **Exportar JSON** para backup antes de limpar dados do navegador. Não envie nomes reais ou informações privadas se compartilhar JSONs.

## Testes

- Sintaxe JS: `node --check app.js`.
- Testes Chromium/Playwright em conteúdo isolado: `python test_site.py` e `python test_extended.py` (Playwright e Chromium instalados no ambiente de teste).
- Principais casos cobertos: Mago nível 5 CON 14 (32 PV), preservação de ferimentos ao subir de nível, cálculo de CA, distribuição de perícias sem perda de opções, compra de atributos por 27 pontos, descanso curto do Bruxo, espaços de magia, condições, inventário, salvamento e compatibilidade de importação.