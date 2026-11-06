# ADR 008 — Sessão persistida na demonstração

**Estado:** aceita em 2026-11-06 para a entrega acadêmica.

A sessão opaca e o perfil público são guardados no AsyncStorage por URL da API. A senha fica
fora do armazenamento. Na web o AsyncStorage usa armazenamento local do navegador. Após abrir,
a API revalida o token ao carregar o estado. A validade de oito horas e a revogação pertencem
ao servidor. Resposta 401 da sessão corrente remove o acesso local.

Sair remove o acesso neste aparelho mesmo se a rede falhar. A revogação é tentada com o token
corrente. Se falhar, o usuário é informado de que a sessão do servidor pode durar até expirar.

A demonstração aceita o custo de manter um token legível no armazenamento da aplicação para
evitar novo login a cada recarga. Uma revisão de produção pode avaliar armazenamento protegido
no nativo e uma estratégia de sessão web com cookies HttpOnly.
