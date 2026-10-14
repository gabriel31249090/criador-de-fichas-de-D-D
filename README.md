# D&D 5e — Mesa V6 (compatível com o Livro do Jogador 2014)

## Iniciar

Abra `site.html` para usar a ficha **totalmente offline** sem instalação. Para instalar como PWA e usar a sala online, execute um servidor HTTPS/localhost (por exemplo, `python -m http.server 8000` na pasta raiz) e abra `http://localhost:8000/index.html`. O serviço de cache só funciona sob HTTPS/localhost.

A versão V6 preserva as páginas e o armazenamento da V4/V5 (`dnd-v3-library`). **Antes de atualizar faça backup JSON dos personagens.** `site.html` contém os scripts e estilos embutidos. `src/` tem os mesmos módulos separados para desenvolvimento.

## 15 melhorias solicitadas

1. Motor de conjuração assistida (rolagens de dano/cura/ataque/resistência de um catálogo selecionado).
2. Gerenciador de combate, iniciativa por combatente, turnos e registros.
3. Companheiros e formas selvagens com fichas auxiliares e PV (limites por subclasse requerem Mestre).
4. Explicações e apoio a recursos de subclasses selecionados; não substitui todos os efeitos condicionais.
5. Condições com explicações; várias limitações situacionais ainda exigem confirmação de jogadas.
6. Imunidade, resistência e vulnerabilidade por tipo de dano, com cálculo correto de arredondamento.
7. Equipamentos +1/+2/+3, com ajuste numérico na CA e ataques quando equipados.
8. Economia/loja e conversão de moedas.
9. Sintonização com limite de três itens (sem classificar automaticamente os requisitos únicos de cada item).
10. Gerador de encontros pelo XP ajustado e multiplicadores 2014.
11. Painel de sala do Mestre (requer Supabase configurado separadamente).
12. Publicação de ficha e atualização em tempo real (opcional, requer servidor Supabase).
13. Seletor de regras 2014 / 2024 informativo: **a lógica 2024 NÃO está implementada** e não se misturam regras.
14. Explicações de cálculo de PV, CA, proficiência e conjuração.
15. PWA instalável e cache offline (somente quando servido em localhost ou HTTPS).

## Sala online com segurança

1. Crie um projeto **seu** no Supabase; não conecte banco de outros projetos.
2. Execute `supabase/campaign.sql` no SQL Editor.
3. Configure a URL pública do projeto e a chave **anon/publishable** na aba **Mesa V6 → Campanha online**. Nunca utilize uma chave de serviço (`service_role`/secret).
4. Habilite login por e-mail e SMTP adequados no Auth. Por padrão, acesso por link OTP é requerido antes de entrar em sala.
5. Após autenticação, o Mestre cria sala e compartilha **convite UUID**; jogadores entram pelo convite e publicam a ficha explicitamente.
6. As regras de row-level security impedem um jogador de consultar fichas de outro sem ser Mestre. Confirme o projeto e as políticas antes de uso real. Nenhum banco foi criado pelo arquivo offline.

A **chave pública** pode ser enviada pelo navegador; a chave secreta jamais. O estado do personagem compartilhado pode conter notas privadas — revise o JSON antes de publicar.

## Limitações e regras

O grimório interativo da V6 é um catálogo selecionado de magias, com resumos próprios; não transcreve todos os feitiços do PHB. Concentração e efeitos de classe são parcialmente automatizados. 2024/5.5 é marcado como informativo e não altera cálculos. Combates completos requerem adjudicação do Mestre. Higgsfield não foi conectado — o redesign foi feito localmente, sem fingir geração de ativos pela plataforma.

## Testar

`node --check src/{app,v5,v6,rules2014}.js` (individualmente) e `python tests/test_v6.py`. É necessário instalar Playwright e ter Chromium disponível. O teste imprime resultados e exporta PDF A4. Teste de banco com usuários reais é uma etapa separada, não executada.