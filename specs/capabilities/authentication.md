---
id: authentication
contract_status: implemented
implementation_status: implemented
last_verified: 2026-09-16
last_verified_ref: working-tree
---

# Autenticação simulada no frontend

## Finalidade e limites

Entregar a tela de login do Diário de Obra Mobile sem backend, persistência ou segurança de
produção. As credenciais existem somente no código local.

## Atores, entradas e resultados

O dono/empresa, o responsável ou o cliente informa e-mail e senha. Campos vazios ou e-mail
malformado geram mensagens locais. A credencial correta identifica o perfil e abre a tela de
boas-vindas correspondente; dados incorretos mantêm o usuário no formulário com instrução para
tentar novamente.

## Contrato comportamental e critérios de aceite

- O mock reconhece credenciais distintas de dono/empresa, responsável e cliente.
- O login também reconhece clientes cadastrados na memória durante a execução atual.
- O perfil é derivado da credencial e não pode ser escolhido livremente no formulário.
- O e-mail ignora espaços nas extremidades e diferença entre maiúsculas e minúsculas.
- A senha permanece sensível a maiúsculas e minúsculas.
- O retorno autenticado não expõe a senha.
- Erros de campo obrigatório aparecem somente depois da tentativa de entrar.
- A senha pode ser mostrada ou ocultada.
- O botão fica desabilitado durante a simulação de envio.
- O sucesso abre a `WelcomeScreen`, cuja mensagem muda conforme o perfil identificado.
- A ação `Sair` encerra a sessão em memória e volta para o login.
- O formulário se ajusta ao teclado e pode rolar em telas pequenas.

## Invariantes e regras de negócio

- Não usar credenciais reais neste mecanismo.
- Não apresentar o mock como autenticação segura.
- Manter estilos em `styles.js`, conforme a convenção da disciplina.

## Evidências de implementação e teste

- UI: `app-mobile/components/LoginScreen/`.
- Confirmação: `app-mobile/components/WelcomeScreen/`.
- Dados: `app-mobile/data/mockUsers.js`.
- Regras: `app-mobile/services/auth.js` e `app-mobile/services/welcome.js`.
- Testes: `app-mobile/tests/*.test.cjs` e `npm test`.
- Bundle: `npx expo export --platform android --output-dir .verify-bundle`.

## Relações

- Estrutura base: `core.md`.
- Cadastro relacionado: `registration.md`.
- Evidências: `../testing.md`.
