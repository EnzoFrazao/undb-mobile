---
id: authentication
contract_status: implemented
implementation_status: implemented
last_verified: 2026-11-06
last_verified_ref: working-tree
---

# Autenticação na API — RF01

Login normaliza e-mail, mantém senha sensível a caixa e identifica dono/responsável/cliente sem
seletor de perfil. Erros obrigatórios apenas após Entrar; mostrar/ocultar senha, busy, falha de rede
e credencial inválida. API usa scrypt/salt, sessão aleatória256bits com expiração8h e hash no JSON.
Senha/hash nunca retornam. A sessão fica no AsyncStorage por URL da API e é restaurada ao abrir o app. A API valida a sessão,
e o 401 da sessão corrente limpa o acesso local. Sair exige confirmação e limpa o acesso mesmo
sem rede. A revogação no servidor é tentada em paralelo. A primeira entrada exibe as boas-vindas
com o perfil e segue para o guia. Veja ADR 008.

Login compacto prioriza o formulário em telas pequenas. Depois de uma tentativa inválida, o foco
vai para o primeiro campo com erro. O cadastro de Cliente tem ação própria; perfis da equipe
continuam usando contas da empresa. Envios simultâneos do formulário são bloqueados.

Permissões e vínculos aplicados no servidor, não apenas escondidos no frontend. CORS explícito e limite
de tentativas de login. Backend depende de execução separada. Demonstração local HTTP; HTTPS e proteção
operacional necessários antes de uso real. Evidências: testes app/API, bundles e browser; testing.md.
