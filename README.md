# Workfy - Diário de Obra

Aplicação da disciplina de Programação Mobile da UNDB: React Native + Expo, com API Node e
persistência em JSON. Interface pensada para celular; também funciona no navegador do PC.

## Funcionalidades

- Login e boas-vindas para Dono/Empresa, Responsável e Cliente; guia inicial por perfil e FAQ.
- Cadastro público sempre Cliente, com consentimento; contas persistentes e senhas com hash.
- Dono cadastra obras/contratos, responsáveis e vínculos com clientes.
- Responsável tem uma aba **RDO** para preencher o relatório de uma obra vinculada ou abrir o já enviado no dia.
- O texto de novos RDOs do Responsável é salvo automaticamente no dispositivo. Abra **RDO → Retomar rascunho** para continuar. Fotos não são guardadas no rascunho.
- A aba **Revisão** do Dono reúne os RDOs por obra, data e situação. É possível abrir o detalhe, editar ou assinar pelo fluxo existente.
- O Dono pode **Pedir correção** com motivo antes de assinar. O autor vinculado corrige e reenvia o mesmo RDO; data, autoria e histórico são preservados.
- O Responsável também pode **Editar RDO** no próprio relatório pendente, sem esperar uma devolução. A data não muda e o histórico guarda a nova versão.
- A aba **Avisos** mostra novos RDOs, solicitações de correção, atualizações e assinaturas conforme o perfil. Ao abrir um aviso, ele é marcado como lido.
- O RDO guarda atividades, avanço, equipe, tempo, materiais, ocorrências e fotos.
- Galeria com múltiplas fotos e câmera no celular; até 10 fotos de 8 MB por relatório.
- Calendário e histórico por obra; atualização automática a cada 5 segundos.
- Dono revisa/edita e confirma assinatura, com autoria, horário e identificador do conteúdo.
- Edição bloqueada após assinatura; versões anteriores continuam disponíveis.
- Cliente consulta somente obras, registros e fotos dos contratos aos quais está vinculado.
- Abra um RDO e toque em **Exportar PDF**: no PC, baixa o arquivo; no celular, abre o compartilhamento.
  A exportação inclui a versão atual, fotos, autoria e a confirmação eletrônica acadêmica quando registrada.

## Como executar no PC

Requer Node.js 22 ou posterior. Abra **dois terminais**, ambos inicialmente na raiz `mobileUNDB`.

**Terminal 1 — backend (deixe aberto):**

```powershell
cd backend
npm.cmd install
npm.cmd start
```

O backend continua sem banco de dados. O primeiro `npm.cmd install` instala as dependências que
geram o PDF e tratam as fotos.

**Terminal 2 — aplicativo:**

```powershell
cd app-mobile
npm.cmd install
npm.cmd run web
```

`npm.cmd install` é necessário somente no primeiro uso, após mudanças nas dependências ou se
`node_modules` for apagada. Nas próximas execuções, basta iniciar o backend e usar `npm.cmd run web`.
Abra [o aplicativo](http://localhost:8081). Use a porta 8081; se escolher outra, configure a origem
permitida no backend em `CORS_ORIGINS`. `Ctrl+C` encerra cada terminal.
Em Linux/macOS, use `npm` e `npx` sem `.cmd`.

## Testar no celular com Expo Go

Mantenha o backend ligado. No terminal de `app-mobile`, em vez de `run web`:

```powershell
npm.cmd start
```

Computador e celular devem estar na mesma rede. Leia o QR Code com uma versão do Expo Go compatível
com o SDK 57. O app tenta identificar o IP do Metro automaticamente para acessar a API na porta 3001.
Se necessário, configure o IP LAN do seu computador antes de iniciar o Expo:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://192.168.0.7:3001/api"
npm.cmd start
```

Substitua o IP pelo mostrado no seu computador (`ipconfig`). Autorize Node nas redes privadas do
firewall, se necessário. O túnel do Expo não publica a API: para testar fora da rede local, a API
também precisa de endereço acessível, preferencialmente HTTPS. A câmera exige permissão do celular;
no navegador do PC, use Galeria. Aparelho físico ainda precisa de validação manual.

### Roteiro de validação no aparelho

1. Entre como Responsável com uma das contas fictícias abaixo. Em **RDO**, abra uma obra sem registro no dia e escreva as atividades.
2. Com o formulário aberto, desligue a rede, altere o texto e aguarde **Rascunho salvo neste dispositivo**. Volte sem enviar e reabra o rascunho. Para testar após fechar o app, reconecte para entrar na mesma conta e abrir o mesmo servidor.
3. Com a rede ligada, anexe uma foto de teste pela câmera e envie. Confirme que o rascunho foi limpo e o detalhe abriu.
4. Entre como Dono, ache o RDO em **Revisão → Pendentes**, filtre pela obra ou data e assine. Volte para conferir que saiu de Pendentes e aparece em Assinados.
5. No detalhe, toque em **Exportar PDF** e confira se o menu do celular recebe o arquivo com a foto e o registro de assinatura.

Para testar a devolução, no passo 4 escolha **Pedir correção** e escreva o motivo. Como Responsável,
abra o aviso, toque em **Corrigir RDO** e reenvie. Como Dono, confira o novo aviso e assine após revisar.
O Cliente vinculado recebe avisos de envio, atualização e assinatura, mas não vê o motivo interno.

## Contas fictícias iniciais

| Perfil | E-mail | Senha |
|---|---|---|
| Dono/Empresa | `dono@diariodeobra.com.br` | `123456` |
| Responsável | `responsavel@diariodeobra.com.br` | `123456` |
| Cliente — Residência Jardins | `cliente@diariodeobra.com.br` | `123456` |
| Cliente — outro contrato | `outro.cliente@diariodeobra.com.br` | `123456` |

Essas contas e duas obras fictícias são criadas somente se ainda não existir armazenamento.
Novos clientes cadastram-se pela tela de login; o dono precisa vinculá-los à obra para liberar
consulta. O dono cria responsáveis em Cadastrar obra ou Gerenciar pessoas da obra.

## Onde ficam os dados

`backend/storage/data.json` guarda usuários, contratos, relatórios, versões e sessões;
`backend/storage/photos/` guarda imagens. A pasta é ignorada pelo Git: cada computador começa com
seus próprios dados. Reiniciar preserva cadastros e relatórios. Recarregar o navegador retoma a sessão
válida na raiz da aba atual. O servidor expira sessões após oito horas. Faça backup da pasta inteira com a API
parada; não edite o JSON com a API aberta e não rode duas APIs no mesmo diretório.

## Organização

- `app-mobile/App.js`: sessão e alternância login/cadastro/área autenticada.
- `app-mobile/components/<Nome>/index.js` e `styles.js`: componente e estilos separados.
- `app-mobile/services/`: cliente HTTP, validações, datas e mensagens por perfil.
- `backend/server.js`: rotas, permissões, sessão, uploads, revisão, assinatura e exportação.
- `backend/report-pdf.js`: gera o PDF da versão atual sem gravar uma cópia permanente no servidor.
- `backend/store.js`: hashes, dados iniciais, snapshots e gravação JSON.
- `*/tests/`: testes automatizados; não são necessários para abrir a interface.
- `specs/`: requisitos implementados, arquitetura, decisões e evidências.

## Testes

Execute em cada pasta:

```powershell
cd backend
npm.cmd test
```

```powershell
cd app-mobile
npm.cmd test
npx.cmd expo-doctor
```

O teste da API usa armazenamento temporário isolado e não altera seus dados do aplicativo.
Veja `specs/testing.md` para os testes e limites da verificação.

## Limites importantes da entrega acadêmica

A assinatura é uma confirmação eletrônica acadêmica, não certificada ICP-Brasil. O bloqueio e os
hashes protegem o fluxo da aplicação, mas não tornam o disco imutável contra administradores.
Não há alegação de conformidade jurídica/LGPD integral ou de metas de desempenho medidas em 4G.
Atualização é por polling de 5 segundos, não streaming instantâneo. Exportação PDF e clima automático
ficam como evolução futura. A API local usa HTTP; HTTPS exige certificado (`TLS_KEY`, `TLS_CERT`)
ou proxy e `EXPO_PUBLIC_API_URL` correspondente. `DATA_DIR`, `PORT`, `HOST` e `CORS_ORIGINS` são
configurações opcionais do servidor. Fotos e dados reais não devem ser usados nesta demonstração.
Os avisos de dependências Expo restantes estão registrados em `specs/testing.md`; não aplique
`npm audit fix --force`, pois a sugestão atual rebaixa o Expo para uma versão incompatível.
