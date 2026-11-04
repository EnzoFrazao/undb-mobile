# Sistema implementado

**Última verificação:** 2026-10-07 · **Referência:** working-tree.

React Native 0.86.3 / React 19.2.3 / Expo SDK 57, JavaScript puro. Entrada:
`app-mobile/index.js` registra `App.js`. `SafeAreaProvider` e `AppFrame` respeitam as áreas seguras;
canvas web centralizado com largura máxima de 480px. Estilos ficam sempre em `components/<Nome>/styles.js`.
`expo-image-picker` permite galeria/câmera; não solicita microfone. Navegação usa estado React,
sem biblioteca adicional. Formulários autenticados ficam em uma ScrollView com barra inferior fixa.

App chama API por `services/api.js`, com token apenas em memória, timeout de 20s e logout em 401.
Endereço padrão web: hostname:3001/api; nativo: hostUri do Expo:3001/api; override EXPO_PUBLIC_API_URL.
Workspace consulta `/state` a cada 5s. Backend filtra dados e valida permissões independentemente da UI.
O rascunho de novo RDO usa AsyncStorage (ADR004), sem token ou foto, com operações em ordem por
chave local. A fila de revisão filtra os relatórios já recebidos em `/state`.
A aba Avisos mostra os 60 eventos mais recentes autorizados de cada conta, também via `/state`.
`POST /api/notices/:id/read` registra a leitura do próprio aviso após validar o vínculo atual.

Backend Node 22 utiliza módulos nativos HTTP/HTTPS, crypto e fs, sem banco.
API: health, register, login, logout, state, guide, consent, operators, works, photos, reports,
edição e assinatura. CORS possui lista explícita. Sessões opacas com expiração de 8h e revogação;
hash scrypt nas senhas e SHA-256 nos tokens. Login limitado a 20 tentativas por IP/minuto.
JSON limitado a 12MB; fotos JPEG/PNG/WebP até 8MB, acessadas apenas por endpoint autenticado.

`POST /api/reports/:id/return` devolve um RDO pendente a seu autor e
`POST /api/reports/:id/resubmit` retorna à revisão, com controle da versão esperada.
`PATCH /api/reports/:id` também permite ao Responsável vinculado editar o próprio RDO pendente,
sem alterar a data. A edição gera nova versão e avisa o Dono e os Clientes vinculados.
Motivos internos são omitidos da API de leitura para outros perfis e do PDF.

`GET /api/reports/:id/pdf` aplica a autorização do relatório e aceita `?version=` para detectar
alteração da revisão. PDFKit gera o documento e Sharp redimensiona/normaliza fotos localmente,
sem serviço externo. O app baixa bytes autenticados; web usa Blob, mobile usa cache e Expo Sharing.

Store salva JSON via cópia transacional/fsync/rename; fotos privadas no disco. Dados iniciais somente
quando inexiste data.json. Um processo por diretório; backups manuais. Cadastro público sempre Cliente;
dono cria responsáveis. Relatórios únicos por obra/data. Revisão usa versão esperada para evitar perda
de atualização concorrente. Snapshots, autoria e timestamps preservados; assinatura gera hash do conteúdo
e fotos e bloqueia PATCH. Sem endpoint de exclusão de histórico.

HTTP apenas desenvolvimento. TLS_KEY/TLS_CERT habilitam HTTPS; deploy, certificado válido, proteção
administrativa de arquivos, assinatura certificada, carga/4G e validação física ainda não entregues.
Ver ADR 002, capabilities e testing.md. A implementação não garante imutabilidade forte do disco.
