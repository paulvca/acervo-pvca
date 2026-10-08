# Scripts

Futuros scripts desta pasta devem ser pequenos e reproduzíveis, voltados a gerar a projeção pública, validar schemas, preparar assets públicos e executar checks de integridade.

Credenciais e dados operacionais privados não pertencem ao repositório.

## Local catalog tools

`npm run catalog:check` validates the final public source without changing it.
Pass a prepared JSON path after `--` to check a candidate instead.
`npm run catalog:import -- <path>` adds reviewed public film records;
`--replace` explicitly replaces matching complete records.
`npm run catalog:test` runs isolated validation, import and static build tests.

See [DATA_INTAKE.md](../docs/DATA_INTAKE.md) for the workflow and validation limits.

## Observed PVCA subset imports

`node scripts/prepare-observed.mjs <subset.json> <observations.json> <identities.json>` prepares a PVCA 6.2 subset using its copy-scoped remote audit and a reviewed identity manifest (`[{"pvca_id":"PVCA-…","tmdb_id":123}]`). It joins by archive ID, checks title/year/source/URL consistency, uses exact observed bytes and streams, and enriches each confirmed TMDB identity with both official locales and a local poster. Missing fields remain pending. Portuguese subtitle variants are distinguished only when the stream metadata identifies Brazil or Portugal.

Source files, identity review, evidence and preparation reports stay in the ignored `.local-admin/` directory. The tool defaults to sharing only Archive destinations; `--share-drive` explicitly includes the observed film-folder links when the owner authorizes sharing them. `--apply` imports the prepared records through the normalized database, preserving editorial locks, with a private backup and transaction journal. The tool never commits or deploys. Review the preparation report and resolve identity or enrichment errors before applying.
