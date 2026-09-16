---
id: core
contract_status: partial
implementation_status: partial
last_verified: 2026-08-26
last_verified_ref: working-tree
---

# Estrutura base do aplicativo

## Finalidade e limites

Garantir que o app inicie no Expo Go e que a UI seja montada a partir de componentes isolados na
convenção exigida pela disciplina. Funcionalidade de produto não pertence a esta capability e ainda
não foi definida — ver `P-001` em `../open-decisions.md`.

## Atores, permissões, entradas e resultados

O desenvolvedor roda o projeto e vê a tela inicial no aparelho ou emulador. Não há autenticação,
entrada de usuário nem permissões de sistema.

## Contrato comportamental e critérios de aceite

- `npx expo start` sobe o dev server e o app abre no Expo Go sem erro de bundle.
- Todo componente reside em `components/<Nome>/` com `index.js` e `styles.js` separados.
- `styles.js` exporta como default o objeto de `StyleSheet.create`.
- `App.js` compõe componentes; não concentra estilos de componente.

## Invariantes e regras de negócio

- Nenhum estilo inline em componentes.
- O entrypoint permanece `index.js` com `registerRootComponent`.

## Estado atual e lacunas

Implementado: scaffold Expo, `components/Header/` como referência da convenção, e `App.js`
renderizando `<Header />`.

Lacuna: nenhum componente de produto existe, porque o tema do app não foi definido. `Header` é
demonstração e deve ser substituído ou adaptado quando o escopo chegar.

## Evidências de implementação e teste

- Implementação: `app-mobile/App.js`, `app-mobile/components/Header/index.js`,
  `app-mobile/components/Header/styles.js`.
- Evidência de bundle: ver `../testing.md`.

## Relações

- Decisão aberta: `P-001` e `P-002`, em `../open-decisions.md`.
- ADR relacionado: nenhum na última verificação.
