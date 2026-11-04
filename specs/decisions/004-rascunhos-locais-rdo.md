# ADR 004 — Rascunhos locais de RDO

**Status:** aceito · **Data:** 2026-11-04.

Salvar os campos do novo RDO do Responsável no AsyncStorage, com uma chave por servidor, conta
e obra. A data fica no conteúdo para permitir retomar o mesmo rascunho após a virada do dia ou
após alterar a data. Gravação, leitura e limpeza são serializadas por chave. A limpeza ocorre
após o servidor confirmar o envio ou mediante descarte explícito pelo usuário.

O rascunho é local e não criptografado, não é backup nem sincroniza entre dispositivos. Não contém
fotos, credenciais ou tokens. O app precisa de conexão para iniciar uma sessão e carregar vínculos;
uma vez aberto, o formulário consegue salvar texto sem rede. Envio, upload e permissões continuam
no servidor. Em dispositivo compartilhado, o usuário pode descartar o rascunho antes de sair.
