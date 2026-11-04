# ADR 003 — Exportação do RDO no servidor

**Status:** aceito · **Data:** 2026-11-04.

Gerar o PDF na API com PDFKit e Sharp, sem substituir a persistência em JSON da ADR 002.
O servidor já tem o registro e as fotos e aplica a mesma autorização da consulta, evitando
URLs públicas, uploads para serviços terceiros e diferenças de impressão entre plataformas.
O arquivo é gerado sob demanda, sem armazenamento permanente no servidor. O navegador baixa
o arquivo; no celular, uma cópia em cache é entregue ao menu nativo de compartilhamento.

O PDF reflete a revisão atual. Se a versão esperada divergir, a API responde com 409; versões
históricas seguem disponíveis para consulta no app. Imagens indisponíveis são indicadas no
documento. O PDF é uma cópia para consulta, não uma assinatura certificada.
