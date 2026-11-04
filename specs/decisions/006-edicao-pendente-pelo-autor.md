# ADR 006 — Edição do RDO pendente pelo autor

**Status:** aceito · **Data:** 2026-11-04 · complementa a ADR 005.

O Responsável autor, se ainda vinculado à obra, pode ajustar o próprio RDO pendente sem
intervenção do Dono. O PATCH preserva ID, obra, data e autoria, exige a versão esperada e
grava nova versão mais avisos ao Dono e aos Clientes vinculados. Uma assinatura com versão
antiga é rejeitada. RDO devolvido usa reenvio; assinado continua bloqueado. As permissões
existentes do Dono e do Cliente são mantidas.
