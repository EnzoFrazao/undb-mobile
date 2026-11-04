# Estratégia e evidências de testes

## Verificação de 2026-11-04: edição pelo autor

- 14 testes do app e duas integrações da API aprovados. O Responsável vinculado edita o próprio
  pendente mantendo data e histórico; outro Responsável, Cliente, autor desvinculado e RDO
  assinado não podem usar essa ação. RDO devolvido continua exigindo reenvio.
- Teste confirma aviso de edição para o Dono e rejeição de assinatura de versão desatualizada.

## Verificação de 2026-11-04: devolução, reenvio e avisos

- 14 testes do app e duas integrações da API aprovados; bundles Web, Android e iOS gerados.
- A integração cobre motivo obrigatório, versão desatualizada, autoria, obra vinculada, reenvio
  com mesma data e ID, correção pelo Dono e bloqueio de assinatura durante a correção.
- O teste confirma leitura persistente, isolamento de avisos e remoção do acesso após desvínculo.
  O motivo não aparece para Cliente ou outro Responsável no relatório, no histórico ou no painel.
- O PDF de teste em estado de correção foi reaberto e renderizado com o novo status e sem o motivo.
- Não houve novo teste de interface em navegador ou em aparelho físico nesta revisão.

## Verificação de 2026-11-04: rascunhos e revisão

- Testes do app: 13 casos aprovados. A suíte de rascunhos usa armazenamento simulado para
  verificar recuperação sem rede, separação de chaves, ordenação de gravações e limpeza.
- A suíte de revisão verifica busca por obra/contrato, data válida, situação, ordenação e
  transição de pendente para assinado. A integração da API permaneceu aprovada.
- Bundles Web, Android e iOS gerados; Expo Doctor 21/21.
- Câmera, persistência nativa e compartilhamento em aparelho real ainda exigem teste manual.
  O roteiro com interrupção de rede está no README.

## Verificação de 2026-11-04: RDO, login e PDF

- Testes: 7 unitários do app e 1 integração da API aprovados.
- PDF: autenticação obrigatória, isolamento por obra para Cliente e Responsável, conflito de versão,
  resposta binária sem cache e foto incorporada antes e após assinatura.
- Uma exportação assinada foi reaberta e renderizada: duas páginas A4, com autoria, contrato, versão,
  confirmação acadêmica, foto e paginação. As imagens do teste são fictícias.
- Expo export gerou bundles Web, Android e iOS. Expo Doctor passou em 21/21 verificações após
  alinhar as versões de patch do SDK 57. API de teste e página web responderam HTTP 200.
- Auditoria do backend sem vulnerabilidades reportadas. O npm ainda apontou alertas na árvore
  de dependências do aplicativo; não foi aplicada atualização forçada para outro SDK.
- A automação local de navegador estava desativada; não houve novo teste de interação visual,
  download pelo botão no navegador ou compartilhamento em aparelho físico nesta revisão.

## Linha de base anterior

**Última verificação:** 2026-10-07 · working-tree.

| Verificação executada | Resultado |
|---|---|
| `app-mobile: npm.cmd test` | 7 testes unitários aprovados, exit0 |
| `backend: npm.cmd test` | 1 integração completa, dezenas de assertivas HTTP/persistência, aprovada, exit0 |
| `npx.cmd expo export --platform all --output-dir .verify-bundle-product` | Web251, Android624, iOS627 módulos; exit0 |
| `npx.cmd expo-doctor` | 21/21 checks aprovados |
| `git diff --check` | Sem erro de whitespace; apenas avisos LF/CRLF do Windows |
| API `/api/health` e Metro8081 | status ok e HTTP200 após reiniciar backend |
| Navegador localhost8081,390x844 e320x740 | Inspeção visual mobile e interação real, sem corte horizontal observado |

## Mapa por capacidade

- Authentication: validação frontend, normalização e welcome unitárias. API testa logins dos perfis,
  senha incorreta, acesso sem sessão, ausência de passwordHash nas respostas e logout/revogação.
- Registration: campos/confirmar senha e normalização no app; API força Cliente apesar de payload
  owner, recusa e-mail duplicado e falta de consentimento e mantém cadastro após restart.
- Works/reports: criação de responsável e obra, vínculo de novo Cliente, tipos de vínculo inválidos,
  permissões de escrita, isolamento de obra/foto, upload PNG, data inválida, avanço inválido,
  foto de outro contrato, unicidade por dia, versão desatualizada, revisão com snapshot anterior,
  assinatura exclusiva do dono, bloqueio posterior e preservação do hash após restart da API.
- Arquivo persistido: testes confirmam hashes de senhas/sessões, ausência de plaintext e encadeamento
  previousHash. Armazenamento de teste usa mkdtemp isolado; não modifica backend/storage real.

## Evidência manual no navegador

Fluxo percorrido: Responsável login→welcome→guia→obra→novo diário→galeria/upload→envio;
Dono login→revisão/edição→assinatura→controle de edição removido→consulta versão1 preservada;
Cliente login→somente1obra→calendário/filtro. Cadastro pela interface→login→guia→estado vazio sem obra.
Login após reload não mostra erro apenas por foco/blur. Backend reiniciado e dados mantidos.
Uma imagem de teste do próprio projeto foi anexada ao diário de demonstração de07/10/2026;
não representa fotografia real da obra. Foi criada a conta fictícia teste.interface@example.com.
Aviso web `style.resizeMode` foi corrigido removendo a propriedade do estilo; props.resizeMode usado.

## Dependências e limites

`npm audit fix` sem force atualizou dependências compatíveis e removeu4 avisos, incluindo o crítico
shell-quote. Auditoria posterior:22 vulnerabilidades (7moderadas,15altas), herdadas da cadeia Expo/Metro,
braces, node-forge e uuid/xcode. Correção automática restante propõe Expo44, incompatível com SDK57;
não aplicada. Não afirmar que o projeto está pronto para produção. Backend tem zero dependências externas.

Não há suite automatizada de interação React Native, teste real de câmera/Expo Go, certificado TLS
implantado, avaliação jurídica de assinatura/LGPD, testes de carga ou medições em4G. Export Android/iOS
valida bundle, não execução física. Hash encadeado não equivale a disco imutável contra administrador.
Polling5s demonstra atualização entre perfis, não garante latência instantânea de RF07.

Artefatos `.verify-bundle*`/`.verify-web*` são ignorados pelo Git. Não remover tests: eles ajudam
a validar futuras alterações; não são necessários para executar a interface.
