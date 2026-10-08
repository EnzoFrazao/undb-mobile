# Estratégia e evidências de testes

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
