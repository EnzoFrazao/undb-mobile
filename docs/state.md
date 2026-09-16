# Estado do projeto

## Visão atual
Projeto da disciplina de Programação Mobile (UNDB): aplicação híbrida em React Native + Expo.
Scaffold pronto e rodando em `app-mobile/`; nenhuma funcionalidade de produto definida ainda.

## Pendências
- [ ] Definir tema e funcionalidades do app com o grupo — bloqueia qualquer capability real (`specs/open-decisions.md`, P-001)
- [ ] Registrar os 5 integrantes do grupo (P-002)
- [ ] Testar no aparelho: `npx expo start` e ler o QR com o Expo Go (não dá para validar daqui)
- [ ] Escolher biblioteca de navegação quando existirem telas — o Notion pede navegação vertical e atalhos para home/seção anterior
- [ ] Substituir ou adaptar `components/Header` quando o escopo chegar; hoje ele só demonstra a convenção

## Decisões importantes
- **`expo-cli` global não foi instalado**, apesar de o material da disciplina mandar rodar
  `npm install -g expo-cli`. Esse pacote está descontinuado; o Expo atual usa CLI local via `npx`.
  Todos os comandos do projeto usam `npx` e o resultado é o mesmo. Não "consertar" instalando o global.
- **O repositório Git fica em `app-mobile/`**, criado pelo próprio `create-expo-app`.
  `programacao-mobile/` não é repositório — `AGENTS.md`, `specs/` e `docs/` deste nível estão
  fora de controle de versão até alguém decidir mover o `.git` para cima.
- **Recuo do topo do Header é `paddingTop: 56` fixo**, não safe-area de verdade:
  `react-native-safe-area-context` não vem no template `blank`. Trocar quando entrar navegação.
- Nome do projeto passado como argumento no `create-expo-app` para evitar o prompt interativo.

## Última sessão (2026-08-26, Claude)
- Reorganizei `undb/`: documentos foram para `docs/papers/` (o .docx e o .pdf do 1º check de IHC),
  e o código da disciplina passa a viver em `programacao-mobile/`.
- Criei o projeto Expo `app-mobile` (SDK 57, RN 0.86.3, JS puro) e a pasta `components/` na convenção
  exigida — `components/Header/` com `index.js` e `styles.js` separados, já renderizado pelo `App.js`.
- Verifiquei de fato: bundle Android compilou (582 módulos, exit 0) e `npx expo start` ficou pronto
  em `localhost:8081`. Falta só o teste no aparelho com Expo Go.
