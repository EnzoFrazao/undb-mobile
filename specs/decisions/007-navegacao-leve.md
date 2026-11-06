# ADR 007 — Pilhas independentes de navegação

**Estado:** aceita em 2026-11-06.

O workspace usa um reducer puro com uma pilha de rotas por aba. Rotas guardam identificadores e
filtros, e o conteúdo continua vindo da API. O cabeçalho, o BackHandler do Android e o histórico
do navegador operam sobre o mesmo estado. O adaptador web fica em arquivo por plataforma.

O aplicativo possui poucas telas e depende de uma pilha simples, então a integração reaproveita
React Native e evita incorporar uma biblioteca de navegação. A implementação mantém em código
próprio a responsabilidade pela sincronização com o histórico, o foco e as guardas de saída.
Os fluxos de empilhar, trocar aba, retornar e substituir após salvar têm testes unitários.
