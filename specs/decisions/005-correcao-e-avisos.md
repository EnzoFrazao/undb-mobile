# ADR 005 — Devolução de RDO e avisos internos

**Status:** aceito · **Data:** 2026-11-04.

Um RDO pendente pode ser devolvido pelo Dono, com motivo obrigatório, se o autor for um
Responsável ainda vinculado à obra. Somente esse autor pode reenviar. A data e a obra ficam
fixas; cada etapa cria uma versão com autoria e hora. O Dono também pode resolver a correção,
inclusive após remoção do vínculo do autor. Só é possível assinar quando voltar à revisão.
RDO já assinado não muda.

Os avisos são gravados na mesma transação JSON da mudança de estado, sem serviço externo.
O autor recebe a devolução; os donos recebem envios e reenvios; clientes vinculados recebem
envios, atualizações e assinaturas. A consulta e a marcação como lido exigem destinatário e
vínculo atual. A aba exibe os 60 eventos mais recentes e atualiza junto com o painel, sem push.
O motivo não é incluído nos avisos, no PDF ou na leitura por usuários que não podem vê-lo.
Arquivos JSON existentes não precisam de migração: a coleção de avisos nasce no primeiro evento.
