# Estado do projeto

## Visão atual
Projeto da disciplina de Programação Mobile (UNDB): aplicação híbrida em React Native + Expo.
O `app-mobile/` possui cadastro local de clientes, login e tela de boas-vindas do Diário de Obra
Mobile, com autenticação simulada para dono/empresa, responsável e cliente.

## Pendências
- [ ] Registrar os 5 integrantes do grupo (P-002)
- [ ] Testar no aparelho: `npx expo start` e ler o QR com o Expo Go (não dá para validar daqui)
- [ ] Escolher biblioteca de navegação quando surgirem áreas reais além do fluxo de autenticação

## Decisões importantes
- **`expo-cli` global não foi instalado**, apesar de o material da disciplina mandar rodar
  `npm install -g expo-cli`. Esse pacote está descontinuado; o Expo atual usa CLI local via `npx`.
  Todos os comandos do projeto usam `npx` e o resultado é o mesmo. Não "consertar" instalando o global.
- **O repositório Git agora fica na raiz `mobileUNDB/`**, incluindo código, especificações e
  documentação no mesmo controle de versão.
- **Recuo do topo do Header ainda é fixo**, não safe-area de verdade:
  `react-native-safe-area-context` não vem no template `blank`. Trocar quando entrar navegação.
- Nome do projeto passado como argumento no `create-expo-app` para evitar o prompt interativo.

## Última sessão (2026-09-16, Codex)

- Adaptei o login ao documento de requisitos do Diário de Obra Mobile.
- Três credenciais fictícias identificam dono/empresa, responsável e cliente no frontend.
- A tela de boas-vindas foi restaurada e exibe uma mensagem diferente para cada perfil.
- A ação `Sair` volta ao login sem persistir a sessão.
- Novos cadastros recebem o perfil Cliente e permanecem somente no `useState` da execução atual.
- Falta somente conferir a aparência e o teclado em um aparelho real com Expo Go.

## Última sessão (2026-08-26, Claude)
- Reorganizei `undb/`: documentos foram para `docs/papers/` (o .docx e o .pdf do 1º check de IHC),
  e o código da disciplina passa a viver em `programacao-mobile/`.
- Criei o projeto Expo `app-mobile` (SDK 57, RN 0.86.3, JS puro) e a pasta `components/` na convenção
  exigida — `components/Header/` com `index.js` e `styles.js` separados, já renderizado pelo `App.js`.
- Verifiquei de fato: bundle Android compilou (582 módulos, exit 0) e `npx expo start` ficou pronto
  em `localhost:8081`. Falta só o teste no aparelho com Expo Go.
