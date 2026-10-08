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
The final public catalog starts empty, preserving the existing development preview.

The [field guide](docs/CAMPOS_DO_ACERVO.md) explains the supported information.
Use `npm run admin` for the private local editor; see the
[panel guide](docs/PAINEL_LOCAL.md) and [technical setup](docs/LOCAL_ADMIN.md).
The [intake workflow](docs/DATA_INTAKE.md) documents validation and local imports.
The [architecture guide](docs/ARCHITECTURE.md) describes bilingual routes,
normalized local storage, import previews, editorial protection and TMDB enrichment.
The environment does not require a spreadsheet. Later, compare the real catalog
with the supported fields and review the result locally before any publication.
Use `npm run catalog:test`, `npm run data:test`, `npm run admin:test` and
`npm run tmdb:test` to verify the ingestion and local administration workflows.

A licença do código ainda não foi definida.
