# Ficha D&D 5e — V5 · Construtor de Heróis (Livro do Jogador 2014)

## Iniciar

Abra **`site.html`** no Chrome, Edge ou Firefox. É o arquivo independente e offline; nenhuma instalação, chave de API ou cadastro é necessária.

Para editar o código, use `src/index.html`, `src/style.css`, `src/rules2014.js`, `src/app.js` e `src/v5.js` em um servidor estático (ou diretamente no navegador se permitir recursos locais). `index.html` na raiz é outra cópia offline.

## Compatibilidade

A ficha original da V4 foi preservada, incluindo suas três páginas, rolagens, atributo/CA/PV, espaços, histórico, histórico de personagem, importação/exportação JSON e salvamento local. A V5 adiciona a aba **V · Construtor V5**. Os novos dados são armazenados dentro de `state.v5` no mesmo JSON do personagem, sem apagar o legado. Fichas antigas continuam disponíveis quando o mesmo navegador conserva seu `localStorage` (`dnd-v3-library`). Recomenda-se exportar JSON antes de substituir a V4.

## Dez funcionalidades da V5

1. Criação guiada: etapas para identidade, raça/classe, atributos, perícias, equipamento e revisão.
2. Evolução de nível: nível 1–20, escolha de classe, aumento de atributo e seleção de talento em avanços pertinentes (multiclasse até duas classes).
3. Subclasses: opções das doze classes do Livro do Jogador 2014; apresentação de requisitos e recursos relevantes, inclusive Cavaleiro Arcano e Trapaceiro Arcano.
4. Grimório pesquisável: índice curado de magias dos níveis 0–9, busca por nome/escola, filtro de classe/nível/concentração, preparação na ficha e cadastro de magia personalizada. **Não é uma transcrição integral das magias do livro**; resumos são autorais e não substituem a descrição completa.
5. Validador de personagem: campos ausentes, multiclasse sem pré-requisitos, subclassificação pendente, perícias, gastos de espaços e excesso de talentos.
6. Equipamentos automáticos: catálogo inicial de armas, armaduras, escudos e alguns itens; ajuste de CA, ataque e peso ao equipar. Alterações manuais continuam possíveis.
7. Talentos: catálogo inicial com seleção, efeitos diretos seguros como Alerta, Robusto, Observador e Resiliente; efeitos situacionais exigem avaliação do Mestre.
8. Multiclasse: duas classes, pré-requisitos, Dados de Vida de classes distintas, progressão combinada de espaços, pacto separado e progressões de 1/3 conjugadas quando aplicável. Consulte o livro para particularidades de proficiência e características específicas.
9. Recursos de classe: contadores para recursos selecionados, recuperação em descansos e indicação de recursos passivos por nível.
10. Exportação PDF: guia para impressão via navegador (Ctrl+P → Salvar como PDF), com estilos A4 das três folhas básicas; exportação JSON continua sendo backup editável.

## O que não fica 100% automatizado

A V5 **não implementa automaticamente todos os textos e efeitos** de cada subclasse, de todas as magias, talentos e equipamentos do Livro do Jogador. Concentração, resistências especiais, rolagens passadas de PV, componentes materiais, proficiências específicas de multiclasse e escolhas de jogador/Mestre podem exigir revisão. O grimório vem com uma biblioteca inicial extensível, não com todos os encantamentos do livro. Regras da edição 2024 e variantes da campanha não são aplicadas automaticamente.

**Licenciamento de conteúdo:** nomes, tabelas necessárias e metadados resumidos são usados como referência para a ferramenta; nenhuma descrição integral de magia do livro comercial foi copiada.

## Rodar testes

`pip install playwright pymupdf` e execute `python test_v5.py` e `python test_extended_v5.py` na pasta raiz. Necessário Chromium disponível no sistema. Para validar sintaxe: `node --check src/app.js` e `node --check src/v5.js`.

Os testes usam navegador headless, injetando scripts como texto porque ambientes isolados podem bloquear navegação local. A exportação PDF foi verificada em três páginas A4.

## Origem das regras

Livro do Jogador de D&D 5e (2014), PDF disponibilizado pelo solicitante. Ver `AUDITORIA_V5.md` para referências e limites.