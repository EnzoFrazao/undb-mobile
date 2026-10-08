---
id: core
contract_status: implemented
implementation_status: implemented
last_verified: 2026-10-07
last_verified_ref: working-tree
---

# Estrutura e navegação mobile

React Native + Expo, entrypoint index.js; componentes em `components/<Nome>/index.js` e
`styles.js` default StyleSheet.create, sem estilos inline. Safe area real, scroll, keyboard avoidance,
largura web máxima480px; controles principais com mínimo44px. Login/cadastro, welcome por perfil,
guia inicial persistente por conta, dashboard, histórico/calendário, formulário/detalhe, obras e Conta/FAQ.
Guia pode ser reaberto. Permissão de câmera somente quando escolhida; galeria múltipla no ImagePicker.

Critérios: bundles web/Android e Expo Doctor aprovados; fluxos UI testados no navegador com viewport
390x844 e320x740. Não confundir bundle Android com teste em aparelho. Ver testing.md.
Relacionados: authentication, registration, works-reports e ADR002.
