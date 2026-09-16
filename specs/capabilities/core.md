---
id: core
contract_status: implemented
implementation_status: implemented
last_verified: 2026-09-16
last_verified_ref: working-tree
---

# Estrutura base do aplicativo

## Finalidade e limites

Garantir que o app inicie no Expo Go e que a UI seja montada a partir de componentes isolados na
convenção exigida pela disciplina. A primeira funcionalidade de produto está registrada em
`authentication.md`.

## Atores, permissões, entradas e resultados

O desenvolvedor roda o projeto e vê a tela de login no aparelho ou emulador. Pode abrir o cadastro
de Cliente, voltar ao login e, depois de autenticar, ver a tela de boas-vindas do perfil e sair. Não
há permissões de sistema, navegação por biblioteca ou integração externa.

## Contrato comportamental e critérios de aceite

- `npx expo start` sobe o dev server e o app abre no Expo Go sem erro de bundle.
- Todo componente reside em `components/<Nome>/` com `index.js` e `styles.js` separados.
- `styles.js` exporta como default o objeto de `StyleSheet.create`.
- `App.js` compõe componentes; não concentra estilos de componente.

## Invariantes e regras de negócio

- Nenhum estilo inline em componentes.
- O entrypoint permanece `index.js` com `registerRootComponent`.

## Estado atual e lacunas

Implementado: scaffold Expo, tokens visuais, `Header`, `LoginScreen`, `RegisterScreen`,
`WelcomeScreen` e `App.js` compondo o fluxo local de cadastro e autenticação simulada.

Lacuna: a execução em aparelho físico ainda depende de validação manual no Expo Go.

## Evidências de implementação e teste

- Implementação: `app-mobile/App.js`, `app-mobile/components/**`, `app-mobile/theme/tokens.js`.
- Evidência de bundle: ver `../testing.md`.

## Relações

- Capability relacionada: `authentication.md`.
- Capability relacionada: `registration.md`.
- Decisão aberta: `P-002`, em `../open-decisions.md`.
- ADR relacionado: nenhum na última verificação.
