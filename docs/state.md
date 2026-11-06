# Handoff local — 2026-11-06

A implementação da melhoria de UX está no working tree. Consulte specs/README.md,
specs/capabilities/navigation.md e specs/testing.md para contrato e evidências.

Foram aprovados 22 testes do app, duas integrações da API e a exportação Web/Android/iOS.
A regressão no Chrome usou backend com DATA_DIR temporário e três perfis fictícios. O diretório
de dados normal fica em backend/storage. Para iniciar o app localmente, siga o README.

Pendências da mudança: validação em aparelho físico, confirmação da professora sobre o tema
escuro e política de retenção de fotos sem RDO. As decisões técnicas sobre navegação, sessão e
rascunhos estão nos ADRs 007 a 009. A pasta .idea/ já existia no workspace.
