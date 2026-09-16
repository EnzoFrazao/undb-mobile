# Sistema implementado

**Última verificação:** 2026-08-26
**Referência:** `working-tree`

## Finalidade e unidade executável

Aplicação híbrida mobile (Android/iOS) da disciplina de Programação Mobile. Roda no Expo Go durante
o desenvolvimento; não há build nativo neste repositório.

## Stack e entrypoints

- Node 22.23.2 / npm 10.9.8 na máquina de desenvolvimento;
- Expo SDK `~57.0.17`, React Native `0.86.3`, React `19.2.3`, `expo-status-bar ~57.0.1`;
- JavaScript puro (template `blank`), sem TypeScript;
- `app-mobile/index.js`: entrada real, chama `registerRootComponent(App)`;
- `app-mobile/App.js`: componente raiz, compõe os componentes de `components/`;
- `app-mobile/app.json`: configuração do Expo;
- `app-mobile/components/`: componentes da UI.

O `package.json` declara `"main": "index.js"` — o entrypoint não é o `App.js` diretamente.

## Fronteiras e fluxo

`index.js` registra `App`. `App` monta a árvore de componentes. Cada componente importa seu próprio
`styles.js`. Não há navegação, camada de dados nem estado global.

## Estado, persistência e integrações

Nenhuma. O app não persiste dados, não chama API e não tem dependência externa além do Expo.

## Restrições e lacunas

- Sem biblioteca de navegação instalada; o Notion pede navegação vertical entre páginas, o que vai
  exigir uma decisão de biblioteca quando as telas existirem.
- Sem `react-native-safe-area-context`; o recuo do topo em `components/Header/styles.js` é um
  `paddingTop` fixo de 56, suficiente para o scaffold e a ser trocado quando houver navegação.
- `expo-cli` global não foi instalado (pacote legado). Todo comando roda via `npx`.
- `npm install` reportou 10 vulnerabilidades moderadas herdadas do template; nenhuma correção foi
  aplicada para não divergir do template distribuído pela disciplina.
