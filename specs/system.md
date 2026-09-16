# Sistema implementado

**Última verificação:** 2026-09-16
**Referência:** `working-tree`

## Finalidade e unidade executável

Aplicação híbrida mobile (Android/iOS) da disciplina de Programação Mobile. Roda no Expo Go durante
o desenvolvimento; não há build nativo neste repositório.

## Stack e entrypoints

- Node 22.23.2 / npm 10.9.8 na máquina de desenvolvimento;
- Expo SDK `~57.0.23`, React Native `0.86.3`, React `19.2.3`, `expo-status-bar ~57.0.1`;
- JavaScript puro (template `blank`), sem TypeScript;
- `app-mobile/index.js`: entrada real, chama `registerRootComponent(App)`;
- `app-mobile/App.js`: componente raiz, mantém usuários locais e alterna entre cadastro, login e boas-vindas;
- `app-mobile/app.json`: configuração do Expo;
- `app-mobile/components/`: componentes da UI;
- `app-mobile/theme/tokens.js`: cores, espaçamento e raios compartilhados;
- `app-mobile/services/auth.js`: validação e autenticação simulada;
- `app-mobile/services/registration.js`: validação e criação local de clientes;
- `app-mobile/data/mockUsers.js`: credenciais fictícias dos três perfis da atividade.

O `package.json` declara `"main": "index.js"` — o entrypoint não é o `App.js` diretamente.

## Fronteiras e fluxo

`index.js` registra `App`. `App` alterna entre `LoginScreen`, `RegisterScreen` e `WelcomeScreen`.
O cadastro adiciona um Cliente à lista mantida em `useState` e volta ao login. A autenticação usa
essa lista; `Sair` limpa o usuário autenticado e volta ao formulário. Cada componente importa seu
`styles.js`. Não há biblioteca de navegação nem estado global.

## Estado, persistência e integrações

Formulários, sessão e novos clientes existem somente em memória durante a execução. O app não
persiste dados e não chama API. A lista inicial fica em `data/mockUsers.js`; recarregar ou fechar o
aplicativo descarta os cadastros adicionais.

## Restrições e lacunas

- Sem biblioteca de navegação instalada porque a troca entre cadastro, login e boas-vindas usa
  apenas estado local. Escolher uma biblioteca quando forem implementadas áreas maiores.
- Sem `react-native-safe-area-context`; o cabeçalho reserva espaço superior fixo e deve migrar para
  safe area real quando houver navegação.
- `expo-cli` global não foi instalado (pacote legado). Todo comando roda via `npx`.
- `npm install` reportou 10 vulnerabilidades moderadas herdadas do template; nenhuma correção foi
  aplicada para não divergir do template distribuído pela disciplina.
- A autenticação é somente um mock frontend e não deve receber credenciais reais.
