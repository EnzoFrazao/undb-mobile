---
id: authentication
contract_status: implemented
implementation_status: implemented
last_verified: 2026-10-07
last_verified_ref: working-tree
---

# Autenticação na API — RF01

Login normaliza e-mail, mantém senha sensível a caixa e identifica dono/responsável/cliente sem
seletor de perfil. Erros obrigatórios apenas após Entrar; mostrar/ocultar senha, busy, falha de rede
e credencial inválida. API usa scrypt/salt, sessão aleatória256bits com expiração8h e hash no JSON.
Senha/hash nunca retornam. Logout revoga;401 retorna ao login. Recarregar exige login, sem apagar dados.
WelcomeScreen mantém mensagem por perfil e botão Continuar para workspace/guia.

Permissões e vínculos aplicados no servidor, não apenas escondidos no frontend. CORS explícito e limite
de tentativas de login. Backend depende de execução separada. Demonstração local HTTP; HTTPS e proteção
operacional necessários antes de uso real. Evidências: testes app/API, bundles e browser; testing.md.
