# ADR 010 — Identidade visual Planengen

**Status** Aceito em 2026-11-11.

## Contexto

O manual da Planengen Consultoria e Construção apresenta a paleta digital na página 8,
as referências tipográficas na página 9, as assinaturas nas páginas 10 a 12 e o padrão
geométrico nas páginas 13 e 14. O nome aprovado para o produto é Workfy - Diário de Obra.

## Decisão

Usar Planengen como assinatura do produto. A assinatura horizontal e o símbolo do prédio
derivam do original da página 10. O padrão do acesso repete esse símbolo na disposição do
manual. A assinatura sobre azul-marinho combina o símbolo azul com lettering branco.

Os tokens de marca usam os valores hexadecimais do manual. Controles com texto branco usam
o azul `#006BC6`, que oferece contraste de 5,36:1. O azul do manual `#0084F4` aparece
nos destaques. A interface usa Manrope nos pesos 400, 600, 700 e 800, com arquivos locais do
pacote `@expo-google-fonts/manrope` sob SIL Open Font License. A assinatura preserva seu lettering.

O modelo de papelaria do manual orienta o PDF de RDO. Todas as páginas recebem a assinatura
horizontal da Planengen, o nome Workfy e um rodapé com a paginação.

## Consequências

As imagens da marca são distribuídas com o aplicativo e funcionam durante o acesso offline
à interface. A troca de tema e de elementos visuais reutiliza o layout responsivo, os
componentes e os fluxos de dados do aplicativo.
