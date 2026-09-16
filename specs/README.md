# Memória técnica do projeto

Este diretório contém o contrato necessário para compreender e modificar o software.

## Ordem de leitura

1. Leia este índice.
2. Abra somente a capability relacionada.
3. Consulte `system.md` para confirmar o implementado.
4. Consulte `testing.md` antes de alterar cobertura.
5. Leia ADRs e decisões abertas citados.
6. Consulte `docs/state.md` para o handoff local.

## Autoridade

| Documento | Autoridade |
|---|---|
| `capabilities/*.md` | Contrato e estado de entrega |
| `system.md` | Arquitetura realmente implementada |
| `testing.md` | Estratégia e mapa de evidências |
| `open-decisions.md` | Questões que não podem ser inventadas |
| `history.md` | Marcos; Git preserva o detalhe |

`decisions/` nasce com o primeiro ADR real. `changes/` nasce com a primeira mudança complexa.

## Roteamento por tarefa

| Tema | Ler |
|---|---|
| Estrutura do app e componentes | `capabilities/core.md` |
| Stack, entrypoints, execução | `system.md` |
| Testes e evidências | `testing.md` |
| Tema/escopo do produto ainda indefinido | `open-decisions.md` |

## Manutenção

- Mudança funcional atualiza a capability.
- Mudança de evidência atualiza `testing.md`.
- Decisão duradoura cria ou substitui ADR.
- Marco relevante atualiza `history.md`.
