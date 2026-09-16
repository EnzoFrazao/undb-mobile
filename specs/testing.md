# Estratégia e mapa de testes

**Última verificação:** 2026-09-16

## Situação

Os testes da regra de autenticação usam o runner nativo do Node, sem dependência adicional. A UI
ainda não possui teste automatizado de interação; sua evidência automatizada são os bundles Android
e web, complementados por uma inspeção manual no navegador local.

## Gates

| Comando | Evidência | Executado em 2026-09-16 |
|---|---|---|
| `npm test` | Autenticação, cadastro de Cliente, validações e mensagens de boas-vindas | Sim — 11 testes, 11 aprovados, exit 0 |
| `npx expo export --platform android --output-dir .verify-bundle-register-final-3` | Imports, JSX e sintaxe de todos os módulos do app | Sim — `Android Bundled ... index.js (593 modules)`, exit 0 |
| `npx expo export --platform web --output-dir .verify-web-register-final-3` | Compatibilidade do app com a execução local no navegador | Sim — `Web Bundled ... index.js (212 modules)`, exit 0 |
| `npx expo-doctor` | Compatibilidade entre configuração e dependências do Expo | Sim — 21 de 21 checks aprovados |
| `npx expo start --offline` | O dev server sobe e fica pronto para o Expo Go | Sim — QR Code e `exp://192.168.0.7:8081`, exit 0 após encerramento manual |
| Inspeção manual em `http://127.0.0.1:4173` | Cadastro, retorno ao login, acesso do novo Cliente e boas-vindas | Sim — fluxo completo, links recíprocos e console sem erros ou avisos |

Os diretórios `.verify-bundle*` e `.verify-web*` são artefatos descartáveis e ficam ignorados pelo Git.

## Responsabilidade por camada

| Comportamento | Local |
|---|---|
| Composição da tela raiz | `app-mobile/App.js` |
| Componente de UI e seus estilos | `app-mobile/components/<Nome>/` |
| Validação e comparação de credenciais | `app-mobile/services/auth.js` |
| Validação e criação de clientes | `app-mobile/services/registration.js` |
| Dados fictícios | `app-mobile/data/mockUsers.js` |

## Mapa por capacidade

| Capability | Arquivos ou globs | Situação |
|---|---|---|
| `core` | `app-mobile/App.js`, `app-mobile/components/**` | Implementada; coberta apenas por evidência de bundle |
| `authentication` | `app-mobile/services/auth.js`, `app-mobile/tests/auth.test.cjs` | Implementada; autenticação estática e em memória |
| `registration` | `app-mobile/services/registration.js`, `app-mobile/tests/registration.test.cjs` | Implementada; cadastro local de Cliente |

## Lacunas

- Sem teste automatizado de interação com os componentes. Adicionar `jest-expo` e
  `@testing-library/react-native` quando o projeto ganhar mais fluxos de UI.
- Sem verificação em aparelho real nesta sessão: abrir no Expo Go continua sendo passo manual.
