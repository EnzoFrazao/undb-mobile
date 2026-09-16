# ADR 001 — cadastro de Cliente mantido em memória

**Status:** aceito
**Data:** 2026-09-16

## Contexto

A atividade continua exclusivamente no frontend, mas precisa demonstrar o cadastro de uma nova
conta e permitir que essa conta entre no aplicativo. O sistema possui perfis com permissões
diferentes e ainda não dispõe de backend, banco de dados ou armazenamento local.

## Decisão

- Todo cadastro feito pela interface recebe automaticamente o perfil Cliente.
- Dono/Empresa e Responsável não podem ser escolhidos no formulário público.
- `App.js` inicializa uma lista com `mockUsers` e adiciona novos clientes por `useState`.
- A autenticação consulta a lista recebida do `App.js`.
- Nenhum cadastro é persistido ao recarregar ou fechar o aplicativo.

## Consequências

- O fluxo pode ser demonstrado sem adicionar dependências ou infraestrutura.
- Um cliente recém-cadastrado consegue entrar durante a mesma execução.
- Os dados são descartáveis e não devem ser apresentados como cadastro seguro ou definitivo.
- Persistência futura exigirá armazenamento local ou backend e substituirá esta decisão.
