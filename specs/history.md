# Marcos do projeto

## 2026-11-06 — Navegação, proteção de alterações e interface

- Pilhas por aba, retorno no cabeçalho e no sistema, sessão local e confirmações de saída.
- Feedback das operações, datas em português, listas virtualizadas, busca e visualização de fotos.
- Contraste testado em tokens e navegação lateral com painel de obras em telas web largas.

## 2026-11-04 — Edição pelo autor antes da assinatura

- Responsável vinculado ajusta o próprio RDO pendente diretamente, com data fixa, histórico e aviso de edição.

## 2026-11-04 — Correções e avisos internos

- Devolução com motivo privado, reenvio do mesmo RDO e histórico versionado.
- Aba Avisos com leitura persistente e isolamento por destinatário e obra.

## 2026-11-04 — Rascunhos e fila de revisão

- Rascunho local dos campos de novo RDO, separado por servidor, conta e obra, com retomada pela aba RDO.
- Fila de revisão do Dono com filtros e retorno do detalhe sem perda da seleção.

## 2026-11-04 — Fluxo de RDO e exportação

- Atalho e aba RDO exclusivos do Responsável, com consulta do registro de hoje e confirmação de envio.
- Login mais compacto e foco no primeiro campo inválido, mantendo a identificação de perfil pela conta.
- Exportação PDF autenticada para download web e compartilhamento nativo; persistência continua em JSON.

## 2026-10-07 — aplicação com API e JSON

- Escopo ampliado pelo usuário para sistema do PDF; backend JSON escolhido explicitamente.
- Cadastro persistente, sessão revogável e senhas com scrypt substituem autenticação mock no app.
- Obras, vínculos, fotos, relatórios/calendário, revisão, assinatura acadêmica e histórico implementados.
- Welcome preservada; guia inicial por perfil, privacidade, FAQ e UI mobile com safe area.
- ADR002 registra persistência, operação de instância única e limites de assinatura/imutabilidade.
- Conta/pasta `.idea` do usuário preservadas; armazenamento local e fotos não entram no Git.

## 2026-09-16 — cadastro local de clientes

- `RegisterScreen` adicionada com nome, e-mail, senha e confirmação de senha.
- Novos usuários recebem automaticamente o perfil Cliente e ficam somente em memória.
- Login e cadastro ganharam links recíprocos; o novo cliente pode entrar durante a mesma execução.
- Validações impedem senha curta, confirmação divergente e e-mail duplicado.

## 2026-09-16 — boas-vindas por perfil restaurada

- `WelcomeScreen` restaurada após o login, sem adicionar biblioteca de navegação.
- Mensagens específicas criadas para dono/empresa, responsável e cliente.
- A ação de sair retorna ao formulário e limpa a sessão mantida em memória.

## 2026-09-16 — login alinhado ao Diário de Obra Mobile

- Documento de requisitos recebido e usado como fonte do domínio do produto.
- Nome, textos e contexto da tela alterados para Diário de Obra Mobile.
- Login diferenciado por credencial para dono/empresa, responsável e cliente.
- Escopo reduzido estritamente à tela de login, com confirmação inline e sem tela posterior.

## 2026-09-16 — login frontend implementado

- Nome e primeira capacidade do produto definidos como UNDB Mobile e autenticação simulada.
- Tela de login criada com validação, exibição de senha, erros, carregamento e acessibilidade.
- Tela de confirmação e saída adicionada sem biblioteca de navegação.
- Credencial fictícia isolada em `data/mockUsers.js`; nenhuma API ou persistência foi introduzida.
- Quatro testes unitários aprovados e bundle Android gerado com sucesso (589 módulos).
- Paleta, princípios de produto e sistema visual registrados em `PRODUCT.md` e `DESIGN.md`.

## 2026-08-26 — projeto iniciado e memória técnica criada

- Projeto Expo em branco criado com `npx create-expo-app@latest app-mobile --template blank`
  (Expo SDK 57, React Native 0.86.3).
- Convenção de componentes da disciplina (`components/<Nome>/index.js` + `styles.js`) estabelecida e
  demonstrada com `Header`.
- `specs/` e `docs/state.md` criados; a referência verificada é `working-tree`.
- Git preserva o histórico granular. O repositório Git vive em `app-mobile/`, criado pelo próprio
  `create-expo-app`; a pasta `programacao-mobile/` não é um repositório.
