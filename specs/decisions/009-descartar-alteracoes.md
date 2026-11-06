# ADR 009 — Confirmação de saída e rascunho do RDO

**Estado:** aceita em 2026-11-06.

O texto do novo RDO do Responsável mantém o rascunho local do ADR 004. A navegação pode
continuar assim que a gravação termina. Fotos anexadas ou texto cuja gravação falhou exigem
confirmação de saída. A confirmação também protege a edição de RDO, o cadastro de obras,
os vínculos e o motivo de devolução ainda não enviado.

Isso preserva a recuperação offline do fluxo de campo e evita restaurar mudanças antigas
sobre um relatório já versionado ou sobre vínculos atualizados no servidor. A versão enviada
ao salvar uma edição é a que o editor recebeu quando abriu. Remover uma foto pede confirmação.
O cadastro de Responsável continua imediato e a interface informa isso antes da criação.
