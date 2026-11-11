---
id: navigation
contract_status: implemented
implementation_status: implemented-with-limitations
last_verified: 2026-11-11
last_verified_ref: working-tree
---

# Navegação e proteção de alterações

A área autenticada mantém uma pilha por aba disponível ao perfil. O cabeçalho mostra a tela
atual, a obra quando aplicável e a seta com o nome da tela anterior. Selecionar outra aba
preserva a pilha e os filtros. A posição de rolagem é lembrada por tela durante o uso. Selecionar a aba ativa volta à raiz.
RDO aberto pelo histórico, revisão ou aviso volta ao contexto de origem. Após enviar um RDO,
o detalhe ocupa o lugar do editor. A edição usa o ID do relatório e a versão aberta no início.

No Android, o botão ou gesto de sistema fecha o modal ativo e percorre a pilha. Da raiz de outra
aba, volta para Obras. Na raiz de Obras, dois toques em até dois segundos permitem sair do app.
Na web, o histórico do navegador acompanha as telas. Recarregar retoma a raiz da aba lembrada
para a conta. A sessão é restaurada pelo armazenamento local, sujeita à validação da API.

Ao sair de um formulário com alterações que ainda não estão salvas, o usuário pode continuar
editando ou descartar as mudanças. A regra cobre a seta, as abas e o voltar do sistema. Na web,
recarregar ou fechar a página usa a confirmação do próprio navegador. Durante gravações e
uploads, a navegação interna aguarda a conclusão.

O guia inicial continua obrigatório até ser concluído. O guia reaberto em Conta permite voltar.
Em telas web a partir de 900 px, a navegação passa para a lateral e a obra aberta pode ser
consultada ao lado da lista de obras. A navegação inferior e a lateral usam a cor principal
da Planengen. A lateral exibe a assinatura da marca com o nome Workfy - Diário de Obra.

Decisões nos ADRs 007, 008 e 009. Para evidência de navegador e limites da verificação nativa,
consulte testing.md.
