# programacao-mobile

Projeto da disciplina de Programação Mobile (UNDB). Aplicação híbrida em React Native + Expo.
O código da aplicação fica em `app-mobile/`.

## Memória técnica

1. Leia `specs/README.md`.
2. Abra somente as capabilities relacionadas à tarefa.
3. Consulte `specs/system.md` para confirmar o implementado.
4. Consulte `specs/testing.md` antes de alterar cobertura.
5. Use `docs/state.md` somente para handoff local.

Mudança funcional atualiza a capability; decisão duradoura cria ou substitui ADR; alteração de
evidência atualiza `testing.md`; marco relevante atualiza `history.md`.

## Convenção obrigatória da disciplina

Todo componente mora em `app-mobile/components/<Nome>/` com dois arquivos:

- `index.js` — o componente;
- `styles.js` — os estilos, exportados como default via `StyleSheet.create`.

Estilo inline ou `StyleSheet` dentro do `index.js` viola a convenção pedida em aula.
