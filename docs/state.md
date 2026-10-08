# Handoff local — 2026-10-07

Fonte de verdade: specs/README.md, capabilities, system.md e testing.md.

Produto acadêmico agora integrado à API Node com JSON por autorização do usuário. UI mobile
inclui login/cadastro, welcome, onboarding, obras/vínculos, diário/fotos, calendário, revisão/assinatura
e consulta restrita de Cliente. ADR002 substitui estado useState para dados persistentes.

Backend e Metro foram iniciados para visualizar no PC em localhost3001 e localhost8081.
Reiniciar conforme README usando dois terminais. Fotos e JSON privados ignorados no Git;
`.idea/` é arquivo preexistente do usuário e foi preservado. Publicação na branch main solicitada
pelo usuário; consulte o histórico Git para o commit e a confirmação de sincronização remota.

Verificados testes unitários/API, bundles web/Android/iOS e Doctor21/21. Inspeção browser390x844/320x740.
Pendências externas:5integrantes(P-002), aparelho real/Expo Go/câmera, HTTPS publicado,
garantias jurídicas/imutabilidade forte e medidas de desempenho/carga.22 avisos de dependências
Expo/Metro restantes; não fazer downgrade com audit fix --force. Não publicar com contas seed.
