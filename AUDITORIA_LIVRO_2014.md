# Auditoria da calculadora com o Livro do Jogador de D&D 5e (2014)

**Fonte:** PDF de 315 páginas anexado pelo usuário. Foram extraídas sequencialmente as 315 páginas (aproximadamente 18.329 linhas de texto reconhecido) e examinadas as regras relevantes; a ficha final é composta por páginas em imagem. Isso não equivale a uma verificação humana exaustiva de cada exemplo narrativo, magia, monstro ou efeito condicional do livro.

| Parte do livro | Capítulos / páginas impressas aproximadas | O que o site faz |
|---|---|---|
| Criação do personagem | Cap. 1, 11–16 | Seis atributos, modificadores, proficiência, XP, classe, PV e CA |
| Raças e sub-raças | Cap. 2, 17–44 | Bônus de habilidades, sub-raças principais, deslocamento e PV especial do anão da colina |
| Classes | Cap. 3, 45–122 | Dado de Vida, salvaguardas, opções de perícias, conjuração e principais recursos numéricos por nível |
| Antecedentes | Cap. 4, 123–144 | Perícias comuns do antecedente e campos narrativos; outras proficiências podem exigir seleção manual |
| Equipamento | Cap. 5, 145–164 | Armaduras, escudos, carga, inventário e conversão monetária |
| Multiclasse e talentos | Cap. 6, 165–172 | Talento Robusto; outras escolhas e multiclasse requerem configuração manual |
| Utilizando habilidades | Cap. 7, 175–182 | Testes, perícias, salvaguardas, proficiência e especialização |
| Aventurando-se | Cap. 8, 183–190 | Descansos, Dados de Vida, deslocamento e carga |
| Combate | Cap. 9, 191–200 | Ataques, CA fixa, cura, PV temporários e morte |
| Conjuração | Cap. 10, 203–208 | Espaços, CD, bônus mágico e concentração |
| Magias | Cap. 11, 209–290 | Campos de magia de nível 0 a 9; efeitos individuais escritos de cada magia não foram convertidos em motor automático |
| Ficha original | Três páginas finais | Atributos, combate, narrativa e magias organizados em seções equivalentes |

## Fórmulas-base verificadas

- Modificador de habilidade: `floor((valor final - 10) / 2)`.
- Bônus de proficiência: `2 + floor((nível - 1) / 4)`.
- CA básica: `10 + modificador de Destreza`, substituída por método de armadura ou uma defesa alternativa aplicável; escudo normalmente soma `+2`.
- PV no nível 1: máximo do Dado de Vida da classe + CON, com mínimo de 1. A partir do 2º nível: valor fixo indicado pela classe ou dado rolado + CON, mínimo de 1 PV ganho por nível.
- CD de magia: `8 + proficiência + modificador conjurador`. Ataque mágico: `proficiência + modificador conjurador`.
- Perícia: `modificador associado + proficiência`, dobrando apenas o bônus de proficiência com especialização.
- Concentração por dano: resistência de Constituição contra CD igual ao maior entre `10` e metade do dano sofrido.
- Carga padrão: `7,5 kg × valor de Força` (sem aplicar variantes opcionais de tamanho e sobrecarga).
- Compra de atributos: 27 pontos, pontuações iniciais entre 8 e 15.

## Regras que exigem decisão do jogador / Mestre

- Escolhas de subclasse e talentos, seleções raciais flexíveis, equipamento inicial e escolhas de proficiência não determinadas automaticamente.
- Seleção, preparo e efeitos de cada magia, seus componentes materiais, componentes consumidos, reações, alcance, condições e concentração simultânea.
- Multiclasse: dados de vida mistos e progressão de espaços somados não são calculados automaticamente pela ficha.
- Armaduras sem proficiência, condição de sobrecarga opcional, formas selvagens e pontos de vida temporários provenientes de efeitos específicos.
- Concentração em circunstâncias além de dano, resistências/vulnerabilidades/imunidades, modificadores condicionais e regras da casa.

**Critério:** o site calcula apenas o que pode ser inferido sem escolher pelo jogador. Entradas condicionais permanecem manuais; uma exceção específica prevalece sobre a regra geral, como estabelece o livro.