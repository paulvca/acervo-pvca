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
