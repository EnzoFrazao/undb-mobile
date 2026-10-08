# Diário de Obra Mobile

Aplicação da disciplina de Programação Mobile da UNDB: React Native + Expo, com API Node e
persistência em JSON. Interface pensada para celular; também funciona no navegador do PC.

## Funcionalidades

- Login e boas-vindas para Dono/Empresa, Responsável e Cliente; guia inicial por perfil e FAQ.
- Cadastro público sempre Cliente, com consentimento; contas persistentes e senhas com hash.
- Dono cadastra obras/contratos, responsáveis e vínculos com clientes.
- Responsável envia diário com atividades, avanço, equipe, tempo, materiais, ocorrências e fotos.
- Galeria com múltiplas fotos e câmera no celular; até 10 fotos de 8 MB por relatório.
- Calendário e histórico por obra; atualização automática a cada 5 segundos.
- Dono revisa/edita e confirma assinatura, com autoria, horário e identificador do conteúdo.
- Edição bloqueada após assinatura; versões anteriores continuam disponíveis.
- Cliente consulta somente obras, registros e fotos dos contratos aos quais está vinculado.

## Como executar no PC

Requer Node.js 22 ou posterior. Abra **dois terminais**, ambos inicialmente na raiz `mobileUNDB`.

**Terminal 1 — backend (deixe aberto):**

```powershell
cd backend
npm.cmd start
```

O backend não possui dependências externas: não precisa de `npm install` nem de banco de dados.

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
seus próprios dados. Reiniciar não apaga cadastros/relatórios. Recarregar o navegador encerra a sessão
local e exige novo login, mas os dados continuam no servidor. Faça backup da pasta inteira com a API
parada; não edite o JSON com a API aberta e não rode duas APIs no mesmo diretório.

## Organização

- `app-mobile/App.js`: sessão e alternância login/cadastro/área autenticada.
- `app-mobile/components/<Nome>/index.js` e `styles.js`: componente e estilos separados.
- `app-mobile/services/`: cliente HTTP, validações, datas e mensagens por perfil.
- `backend/server.js`: rotas, permissões, sessão, uploads, revisão e assinatura.
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
