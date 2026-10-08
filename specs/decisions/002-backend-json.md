# ADR 002 — API Node e persistência em arquivos JSON

**Status:** aceito · **Data:** 2026-10-07 · substitui ADR 001.

O usuário ampliou o escopo para o sistema do PDF e escolheu backend com JSON, sem banco.
A API usa somente módulos nativos do Node 22; `backend/storage/data.json` persiste usuários,
contratos, vínculos, sessões e versões. Fotos ficam em arquivos privados na subpasta `photos`.
Gravações usam cópia transacional, fsync e rename do arquivo temporário. Rodar uma única instância
da API por diretório: não há coordenação entre processos ou replicação. Faça backup de toda a
pasta storage com a API parada. Arquivo inválido não é sobrescrito automaticamente.

Senhas usam scrypt com salt; tokens aleatórios de 256 bits são armazenados como hash SHA-256 no
servidor e em memória no app, com validade de 8 horas. Não usamos JWT porque a sessão opaca pode
ser revogada no logout. Cadastro público sempre Cliente; apenas o dono cria responsáveis e vínculos.

Versões são snapshots encadeados por hash. Assinar registra autor, horário e hash do conteúdo e
das fotos e bloqueia edição pela API. Não é assinatura ICP-Brasil nem armazenamento WORM: alguém
com acesso administrativo ao disco ainda pode alterar os arquivos. O requisito de imutabilidade
forte e validação jurídica exige infraestrutura e avaliação adicionais antes de uso real.

HTTP fica restrito à demonstração local/rede de desenvolvimento; HTTPS é suportado com TLS_KEY e
TLS_CERT ou proxy externo. Não foi realizado deploy. Nunca usar os usuários seed em produção.
