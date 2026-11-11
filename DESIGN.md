# Design System

## Overview

O Workfy - Diário de Obra usa a identidade visual da Planengen Consultoria e Construção. O azul-marinho
estrutura a entrada e a navegação, com superfícies claras nos formulários e nas áreas de consulta.
O login prioriza poucos passos e boa leitura em telas de celular sob luz intensa.

## Color

| Papel | Cor | Uso |
|---|---|---|
| Brand | `#010028` | Entrada, navegação e cabeçalhos no celular |
| Accent | `#0084F4` | Símbolo, seleção e indicadores sobre azul-marinho |
| Action | `#006BC6` | Ação primária com texto branco e foco sobre superfícies claras |
| Canvas | `#EEF0F2` | Fundo claro da aplicação |
| Surface | `#FFFFFF` | Campos e cartões |
| Ink | `#202020` | Títulos e texto principal |
| Muted | `#4F5D70` | Texto de apoio |
| Error | `#B42318` | Erros de validação e autenticação |
| Success | `#15803D` | Confirmação de acesso |

## Typography

O lettering original da Planengen faz parte do arquivo da assinatura. A interface usa Manrope
nos pesos Regular, SemiBold, Bold e ExtraBold. Corpo e campos usam 16 pontos, com textos de apoio
de 14 pontos. O aplicativo distribui os quatro arquivos de fonte com licença SIL Open Font License.

## Relatórios exportados

O timbrado da Planengen orienta o PDF do RDO. O cabeçalho mostra a assinatura da Planengen à
esquerda e o nome Workfy à direita, com uma linha azul-marinho abaixo. O rodapé repete a indicação
de cópia para consulta e o número da página em todas as folhas.

## Spacing and Shape

- Escala de espaçamento: 4, 8, 12, 16, 24, 32 e 48 pontos.
- Raios: 8, 12 e 16 pontos.
- Alvos interativos: no mínimo 44 por 44 pontos.
- Campos e botões principais: 56 pontos de altura.

## Components

- `Header` exibe a assinatura Planengen, o padrão geométrico e o nome Workfy - Diário de Obra.
- `AuthLayout` organiza login, cadastro e boas-vindas em uma coluna no celular e duas a partir de 900 px na web.
- `LoginScreen`: formulário responsivo com estados de foco, erro e carregamento.
- `RegisterScreen`: cadastro de Cliente com nome, e-mail, senha e confirmação de senha.
- `WelcomeScreen`: confirmação do acesso, perfil identificado, mensagem contextual e ação de sair.
- `Workspace` e `ScreenHeader` usam o símbolo no cabeçalho mobile e a assinatura na navegação lateral da web.
- `Toast`, `ErrorState` e `EmptyState`: confirmação, recuperação de falhas e orientação em telas vazias.
- `StatusBadge` e `Icon`: situação do RDO com cor, ícone e texto.
- `Calendar`: grade mensal com indicadores e filtro de data.
- `ReportEditor`/`ReportDetail`: registro, fotos, leitura, assinatura e versões.
- `WorkEditor`: contrato e vínculos. `FormField`, `Choice`, `ActionButton`: controles compartilhados.
- `AppFrame`: safe area, canvas de até 480 px em telas estreitas e layout de até 1.280 px em telas web largas.

## Interaction

Validar o formulário ao tocar em `Entrar`; apenas focar e sair de um campo vazio não deve apresentar
erro. Mensagens aparecem junto ao problema e são anunciadas por leitores de tela. A senha pode ser
mostrada ou ocultada, e o teclado avança do e-mail para a senha. No primeiro acesso, a tela de boas-vindas
informa o perfil associado à credencial e oferece uma ação clara para sair.

Login e cadastro apresentam links textuais recíprocos abaixo da ação principal. O cadastro informa
antes do formulário que a nova conta será Cliente e só apresenta erros depois da tentativa de envio.
