---
id: core
contract_status: implemented
implementation_status: implemented
last_verified: 2026-11-06
last_verified_ref: working-tree
---

# Estrutura e navegação mobile

React Native + Expo, entrypoint index.js; componentes em `components/<Nome>/index.js` e
`styles.js` default StyleSheet.create, sem estilos inline. Safe area real, scroll, keyboard avoidance,
layout responsivo e alvos de toque com mínimo de 44 pontos para controles principais. Login/cadastro, welcome por perfil,
guia inicial persistente por conta, dashboard, histórico/calendário, formulário/detalhe, obras e Conta/FAQ.
Guia pode ser reaberto e fechado na Conta. A pilha por aba e o layout web largo estão descritos em navigation.md. Permissão de câmera somente quando escolhida; galeria múltipla no ImagePicker.

Evidências atuais em testing.md, incluindo bundles por plataforma, fluxos de navegador e a
validação física ainda pendente.
Relacionados: authentication, registration, works-reports e ADR002.
