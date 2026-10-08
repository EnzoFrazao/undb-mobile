---
id: works-reports
contract_status: implemented
implementation_status: implemented-with-limitations
last_verified: 2026-10-07
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

Um diário por obra/data. Progress0–100, data civil válida, foto não pode migrar entre obras.
Clientes nunca escrevem relatórios/fotos; responsáveis não alteram registros já enviados.
Dono revisa com optimistic version para impedir sobrescrita/assinatura de conteúdo desatualizado.
Não existe seleção pública de dono/responsável. Dono cria responsáveis dentro de obra e vincula
clientes cadastrados. Novos clientes sem vínculo veem estado vazio e orientação.

Guia inicial por perfil, consentimento e FAQ implementados. Atualização5s e refresh manual.
Assinatura não certificada ICP-Brasil; imutabilidade apenas no fluxo da aplicação, não contra quem
controla disco. HTTPS suportado, não publicado; arquivo JSON exige instância única/backup.
Metas de velocidade4G, carga, avaliação jurídica e aparelho real não verificadas. PDF/clima automático
são futuro. Evidências em testing.md; decisão em ADR002.
