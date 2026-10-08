---
id: registration
contract_status: implemented
implementation_status: implemented
last_verified: 2026-10-07
last_verified_ref: working-tree
---

# Cadastro persistente de Cliente

Links Cadastre-se/Fazer login recíprocos. Nome, e-mail, senha, confirmação e consentimento obrigatórios.
Senha6–128 caracteres; duplicidade verificada na API. Backend força role client mesmo se payload tentar
outro perfil. Salva hash, não senha. Sucesso volta ao login; conta persiste após reload/restart.
Sem obras até o dono vincular. Responsáveis são criados somente pelo dono na gestão de pessoas/obra.
Consentimento, guia visto e vínculos persistem. Dados fictícios para atividade; não alegar LGPD integral.

UI RegisterScreen, validators registration.js, persistência backend/server.js/store.js.
Testes unitários validam campos; integração cobre perfil forçado, duplicidade, consentimento e restart.
Decisão ADR002 substitui cadastro useState do ADR001. Ver testing.md.
