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

Backend Node 22 utiliza módulos nativos HTTP/HTTPS, crypto e fs, sem dependências ou banco.
API: health, register, login, logout, state, guide, consent, operators, works, photos, reports,
edição e assinatura. CORS possui lista explícita. Sessões opacas com expiração de 8h e revogação;
hash scrypt nas senhas e SHA-256 nos tokens. Login limitado a 20 tentativas por IP/minuto.
JSON limitado a 12MB; fotos JPEG/PNG/WebP até 8MB, acessadas apenas por endpoint autenticado.

Store salva JSON via cópia transacional/fsync/rename; fotos privadas no disco. Dados iniciais somente
quando inexiste data.json. Um processo por diretório; backups manuais. Cadastro público sempre Cliente;
dono cria responsáveis. Relatórios únicos por obra/data. Revisão usa versão esperada para evitar perda
de atualização concorrente. Snapshots, autoria e timestamps preservados; assinatura gera hash do conteúdo
e fotos e bloqueia PATCH. Sem endpoint de exclusão de histórico.

HTTP apenas desenvolvimento. TLS_KEY/TLS_CERT habilitam HTTPS; deploy, certificado válido, proteção
administrativa de arquivos, assinatura certificada, carga/4G e validação física ainda não entregues.
Ver ADR 002, capabilities e testing.md. A implementação não garante imutabilidade forte do disco.
