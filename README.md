# Ficha D&D 5e 2014 — revisão das regras e calculadora V4

Aplicação **offline**, em português, baseada no **Livro do Jogador de D&D 5e (2014)** enviado como referência. Os campos desenhados nas três páginas finais da ficha são representados por áreas específicas do site. Os dados anotados a lápis no PDF não foram usados como valores iniciais.

## Abrir o site

- **Mais fácil:** abra `site.html` no Chrome, Firefox ou Edge. É um arquivo único, com CSS e JavaScript embutidos, sem internet.
- **Para editar:** mantenha `src/index.html`, `src/style.css`, `src/rules2014.js` e `src/app.js` na mesma pasta e abra `src/index.html` num servidor estático. `index.html` na raiz também funciona offline.
- **Backup:** exporte JSON e guarde-o antes de limpar os dados do navegador ou mudar de aparelho. O armazenamento depende do navegador.

## Sistemas calculados

- Bônus de proficiência por nível, valores e modificadores dos seis atributos, bônus raciais base e de sub-raças, além das duas escolhas de bônus racial do meio-elfo (ou humano variante).
- Resistências, todas as 18 perícias, proficiência, especialização, testes d20 e percepção/investigação/intuição passivas.
- Criação de atributos por 4d6 descartando o menor, matriz 15/14/13/12/10/8 e compra de 27 pontos.
- Distribuição automática sugerida de perícias por classe e antecedentes, permitindo revisão manual.
- CA pela armadura, Destreza, escudo, defesa sem armadura, Armadura Arcana e Linhagem Dracônica; iniciativa (incluindo bônus extra) e deslocamento racial.
- Vida máxima/atual: Dado de Vida da classe, nível, Constituição, ganho por média fixa ou rolagens persistidas, tenacidade do Anão da Colina, talento **Robusto** e Linhagem Dracônica do Feiticeiro. Inclui PV temporários, ferimentos, cura, Dados de Vida e descansos.
- Espaços de magia, truques conhecidos, magias conhecidas ou preparadas conforme classe quando pertinente. Magias em níveis 0–9, ataque mágico e CD.
- Testes de morte (incluindo 1 e 20 naturais) e concentração (CD 10 ou metade do dano, a maior).
- Inventário por peso e quantidade, moedas com conversão para ouro, capacidade de carga, condições e exaustão.
- Recursos típicos de classe como número de fúrias, dados de Inspiração de Bardo, Ki, Cura pelas Mãos, Ataque Furtivo, Canalizar Divindade e Recuperação Arcana — exibidos em guia de referência por nível.
- Progressão de experiência, botão para ajustar o nível pelos pontos de XP, armazenamento local, importação/exportação JSON e impressão.

## Limites importantes

D&D 5e **não é inteiramente calculável só com classe, raça e nível**. A ficha permite registrar opções do jogador e do mestre, mas não tenta escolher automaticamente subclasse, talentos, magias de um grimório, efeitos de todas as magias, decisões de equipamento, resistências circunstanciais, multiclasse ou todas as exceções de cada característica. Esses itens continuam editáveis e devem seguir a regra específica adotada na campanha. Em especial, **mana** e **defesa ativa** são controles opcionais, não regras gerais do Livro do Jogador 2014.

Para fichas importadas das versões anteriores, os bônus raciais automáticos **começam desligados** para não duplicar valores que tenham sido somados à mão; marque a opção se os atributos importados forem valores base.

Veja `AUDITORIA_LIVRO_2014.md` para o mapeamento de sistemas e páginas consultadas.

## Testar

O projeto inclui `test_v4.py` (requer Python, `playwright` e Chromium). Testa cálculos de PV com raças, classe e nível, salvamento de alterações na ficha, CA, perícias, magias e navegação móvel. Sintaxe: `node --check src/app.js` e `node --check src/rules2014.js`.