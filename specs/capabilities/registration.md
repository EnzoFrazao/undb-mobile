---
id: registration
contract_status: implemented
implementation_status: implemented
last_verified: 2026-09-16
last_verified_ref: working-tree
---

# Cadastro local de clientes

## Finalidade e limites

Permitir a demonstração frontend de criação de uma conta Cliente, sem backend, banco de dados ou
persistência. O cadastro existe somente na memória enquanto o aplicativo permanece aberto.

## Atores, entradas e resultados

Uma pessoa sem conta informa nome, e-mail, senha e confirmação da senha. O sistema valida os dados,
impede e-mail duplicado e cria automaticamente um usuário com o perfil Cliente. Após o cadastro, o
usuário volta ao login com uma confirmação de sucesso.

## Contrato comportamental e critérios de aceite

- O link `Cadastre-se` abre a `RegisterScreen` a partir do login.
- O link `Fazer login` volta ao formulário de acesso sem criar uma conta.
- Nome, e-mail, senha e confirmação são obrigatórios.
- A senha deve possuir pelo menos 6 caracteres e coincidir com a confirmação.
- Um e-mail já presente na lista em memória não pode ser cadastrado novamente.
- Todo novo usuário recebe `role: client` e `roleLabel: Cliente`.
- O novo usuário pode autenticar enquanto o aplicativo permanece aberto.
- Recarregar ou fechar o aplicativo remove os usuários cadastrados durante a execução.
- Erros aparecem somente depois de tocar em `Criar conta` e desaparecem ao corrigir o campo.

## Invariantes e regras de negócio

- O formulário não oferece escolha de perfil.
- Não usar dados pessoais ou senhas reais neste mock.
- Manter estilos em `styles.js`, conforme a convenção da disciplina.

## Evidências de implementação e teste

- UI: `app-mobile/components/RegisterScreen/`.
- Regra: `app-mobile/services/registration.js`.
- Estado em memória: `app-mobile/App.js`.
- Testes: `app-mobile/tests/registration.test.cjs` e `app-mobile/tests/auth.test.cjs`.

## Relações

- Login: `authentication.md`.
- Estrutura base: `core.md`.
- Evidências: `../testing.md`.
- Decisão: `../decisions/001-client-registration-in-memory.md`.
