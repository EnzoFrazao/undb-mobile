# Design System

## Overview

O Diário de Obra Mobile usa uma linguagem objetiva, confiável e adequada ao uso em campo. O login
prioriza poucos passos, familiaridade e boa leitura em telas de celular sob luz intensa.

## Color

| Papel | Cor | Uso |
|---|---|---|
| Brand | `#0B3B91` | Cabeçalho e identidade principal |
| Action | `#2563EB` | Ação primária e foco |
| Canvas | `#F6F8FC` | Fundo claro da aplicação |
| Surface | `#FFFFFF` | Campos e superfícies elevadas |
| Ink | `#0F2747` | Títulos e texto principal |
| Muted | `#52647C` | Texto de apoio |
| Error | `#B42318` | Erros de validação e autenticação |
| Success | `#15803D` | Confirmação de acesso |

## Typography

Usar a fonte nativa do sistema. Títulos recebem pesos 700 ou 800; corpo e campos usam tamanho
mínimo de 16 pontos; textos auxiliares usam 14 pontos somente quando não são essenciais para a
leitura principal.

## Spacing and Shape

- Escala de espaçamento: 4, 8, 12, 16, 24, 32 e 48 pontos.
- Raios: 8, 12 e 16 pontos.
- Alvos interativos: no mínimo 44 por 44 pontos.
- Campos e botões principais: 56 pontos de altura.

## Components

- `Header`: superfície azul com marca geométrica, nome, título e descrição.
- `LoginScreen`: formulário responsivo com estados de foco, erro e carregamento.
- `RegisterScreen`: cadastro de Cliente com nome, e-mail, senha e confirmação de senha.
- `WelcomeScreen`: confirmação do acesso, perfil identificado, mensagem contextual e ação de sair.

## Interaction

Validar o formulário ao tocar em `Entrar`; apenas focar e sair de um campo vazio não deve apresentar
erro. Mensagens aparecem junto ao problema e são anunciadas por leitores de tela. A senha pode ser
mostrada ou ocultada, e o teclado avança do e-mail para a senha. Após o login, a tela de boas-vindas
informa o perfil associado à credencial e oferece uma ação clara para sair.

Login e cadastro apresentam links textuais recíprocos abaixo da ação principal. O cadastro informa
antes do formulário que a nova conta será Cliente e só apresenta erros depois da tentativa de envio.
