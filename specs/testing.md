# Estratégia e mapa de testes

**Última verificação:** 2026-08-26

## Situação

Não há framework de testes instalado. O template `blank` do Expo não traz Jest, e nenhum foi
adicionado porque ainda não existe comportamento de produto a cobrir (ver `P-001` em
`open-decisions.md`). A evidência disponível hoje é de build, não de comportamento.

## Gates

| Comando | Evidência | Executado em 2026-08-26 |
|---|---|---|
| `npx expo export --platform android --output-dir .verify-bundle` | O bundle compila: imports, JSX e sintaxe de todos os módulos do app | Sim — `Android Bundled 86215ms index.js (582 modules)`, exit 0 |
| `npx expo start` | O dev server sobe e fica pronto para o Expo Go | Sim — `Waiting on http://localhost:8081`, sem erro |

O diretório `.verify-bundle` é artefato descartável; apagar depois de rodar.

## Responsabilidade por camada

| Comportamento | Local |
|---|---|
| Composição da tela raiz | `app-mobile/App.js` |
| Componente de UI e seus estilos | `app-mobile/components/<Nome>/` |

## Mapa por capacidade

| Capability | Arquivos ou globs | Situação |
|---|---|---|
| `core` | `app-mobile/App.js`, `app-mobile/components/**` | Implementada; coberta apenas por evidência de bundle |

## Lacunas

- Sem teste automatizado de comportamento. Quando o tema do app for definido e surgir lógica de
  verdade, instalar `jest-expo` + `@testing-library/react-native` e registrar o gate aqui.
- Sem verificação em aparelho real nesta sessão: abrir no Expo Go continua sendo passo manual.
