# Acervo PVCA

Site pessoal de cinema e catálogo público do Acervo PVCA.

O projeto parte de uma base canônica privada e publica apenas uma projeção sanitizada dos dados. A direção visual é editorial, pessoal e minimalista, com Flexoki Dark, muito espaço negativo, listas e tipografia como elementos principais de composição.

## Estrutura

- `docs/` — produto, arquitetura, design, dados, privacidade e roadmap.
- `prototype/` — protótipos aprovados antes da implementação final.
- `src/` — site estático em Astro, TypeScript e CSS próprio.
- `public/` — assets públicos.
- `data/public/` — projeções sanitizadas para o frontend.
- `data/schema/` — contratos dos dados públicos.
- `references/` — referências técnicas derivadas e auditadas.
- `scripts/` — ferramentas de geração e validação.

## Princípio de dados

O frontend nunca deve consumir diretamente inventários operacionais, caminhos locais, hashes, estados privados de QA ou dados internos do Google Drive.

## Local development and data intake

Use `npm run dev` for local development and `npm run build` for the static build.
The published baseline contains 526 validated works. `data/public/catalog.json`
is the public projection; an empty projection activates the development preview
only as an explicit fallback, not as the current publication state.

The [field guide](docs/CAMPOS_DO_ACERVO.md) explains the supported information.
Use `npm run admin` for the private local editor; see the
[panel guide](docs/PAINEL_LOCAL.md) and [technical setup](docs/LOCAL_ADMIN.md).
The [intake workflow](docs/DATA_INTAKE.md) documents validation and local imports.
The [architecture guide](docs/ARCHITECTURE.md) describes bilingual routes,
normalized local storage, import previews, editorial protection and TMDB enrichment.
The environment does not require a spreadsheet. Review intake previews and the
public projection locally before publishing changes.
Use `npm run catalog:test`, `npm run data:test`, `npm run admin:test` and
`npm run tmdb:test` to verify the ingestion and local administration workflows.

## Quality

Run `npm run quality`, build with the Pages site/base, then run `site_check.py`
and `npm run e2e`. See [quality and maintenance](docs/QUALITY.md). Browser tests
require `npx --no-install playwright install chromium` once locally.

A licença do código ainda não foi definida.
