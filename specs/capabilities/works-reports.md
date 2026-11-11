---
id: works-reports
contract_status: implemented
implementation_status: implemented-with-limitations
last_verified: 2026-11-11
last_verified_ref: working-tree
---

# Obras, relatórios, consulta e assinatura

| PDF | Implementação |
|---|---|
| RF02 | Responsável envia diário de obra vinculada, atividades obrigatórias e campos adicionais |
| RF03 | Múltiplas fotos galeria/câmera; endpoint privado, limites e autorização de imagem |
| RF04 | Calendário mensal com dias marcados e filtro exato da data |
| RF05 | Dono consulta todos os contratos, cria obras e administra vínculos |
| RF06 | Dono edita antes da assinatura e confirma assinatura eletrônica acadêmica |
| RF07 | Cliente acompanha registros com polling5s; não é streaming instantâneo |
| RF08 | API restringe cliente e responsável às obras vinculadas, inclusive fotos e versões |
| RF09 | Autor, data/hora, ações, assinatura e hashes registrados pelo servidor |
| RF10 | Após assinatura edição bloqueada na API; snapshots preservados e consultáveis |

Um diário por obra/data. Avanço de 0 a 100 aceita decimais, inclusive vírgula no app. Os campos de
data mostram dia/mês/ano e oferecem seleção no calendário. A API continua recebendo ISO.
Fotos são verificadas antes do upload e falhas recuperáveis podem ser reenviadas por item.
O detalhe abre fotos em tela cheia, com navegação entre imagens e zoom.
O Responsável tem aba RDO e atalho no painel. Seleciona a obra vinculada e abre o formulário com
a data de hoje preenchida ou consulta o registro existente do dia. Após envio, abre o detalhe salvo.
Campos de novos RDOs do Responsável são salvos localmente por servidor, conta e obra, mesmo sem
rede depois de abrir o formulário. A aba RDO oferece retomada. Após confirmação do servidor,
o rascunho é limpo; também pode ser descartado com confirmação. Não guarda fotos nem envia offline.
Clientes nunca escrevem relatórios/fotos. O Responsável vinculado pode editar o RDO pendente
que ele mesmo enviou, sem esperar devolução. Se o RDO foi devolvido, usa corrigir e reenviar.
A data não muda em nenhum dos dois casos e RDO assinado continua bloqueado.
Dono revisa com optimistic version para impedir sobrescrita/assinatura de conteúdo desatualizado.
A aba Revisão do Dono mostra pendentes por padrão e filtra por obra/contrato, data e situação.
Obras oferece busca por nome, endereço ou contrato. Histórico filtra por situação e data. As listas
de Obras, Histórico, Revisão e Avisos são virtualizadas.
O retorno do detalhe mantém filtros. A fila usa dados autorizados existentes, sem mudar permissões.
RDO devolvido fica em **Em correção** e não pode ser assinado nesse estado. Reenvio preserva ID,
obra, data e autoria e cria uma nova versão. O Dono pode resolver diretamente sem apagar o histórico.
O motivo fica restrito ao Dono e ao autor vinculado, inclusive nas versões históricas.
Avisos internos persistem leitura por destinatário e respeitam os vínculos atuais da obra.
A interface permite buscar avisos e marcar todos como lidos usando as rotas individuais da API.
O Cliente recebe avisos de envio, atualização e assinatura, sem motivo interno de correção.
Não existe seleção pública de dono/responsável. Dono cria responsáveis dentro de obra e vincula
clientes cadastrados. Novos clientes sem vínculo veem estado vazio e orientação.

Guia inicial por perfil, consentimento e FAQ implementados. Atualização5s e refresh manual.
Assinatura não certificada ICP-Brasil; imutabilidade apenas no fluxo da aplicação, não contra quem
controla disco. HTTPS suportado, não publicado; arquivo JSON exige instância única/backup.
Exportação da versão atual via API autenticada, para os mesmos usuários que podem consultar o RDO.
Inclui obra/contrato, campos técnicos, autoria, fotos disponíveis e confirmação eletrônica acadêmica,
quando existente. A versão esperada evita exportar um conteúdo mais recente sem aviso. Navegador
baixa o arquivo; Android/iOS compartilham uma cópia em cache. Não assina digitalmente o arquivo PDF.
Todas as páginas do PDF recebem o cabeçalho da Planengen e do Workfy, com indicação de cópia
para consulta e paginação no rodapé. Ver ADR 010.
Metas de velocidade4G, carga, avaliação jurídica e aparelho real não verificadas. Clima automático
continua futuro. Evidências em testing.md; decisões em ADR002 e ADR003.
