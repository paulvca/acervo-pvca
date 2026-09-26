# Acervo PVCA

Site pessoal de cinema e catálogo público do Acervo PVCA.

O projeto parte de uma base canônica privada e publica apenas uma projeção sanitizada dos dados. A direção visual é editorial, pessoal e minimalista, com Flexoki Dark, muito espaço negativo, listas e tipografia como elementos principais de composição.

## Estrutura

- `docs/` — produto, arquitetura, design, dados, privacidade e roadmap.
- `prototype/` — protótipos aprovados antes da implementação final.
- `src/` — aplicação/site quando a stack for definida.
- `public/` — assets públicos.
- `data/public/` — projeções sanitizadas para o frontend.
- `data/schema/` — contratos dos dados públicos.
- `references/` — referências técnicas derivadas e auditadas.
- `scripts/` — ferramentas de geração e validação.

## Princípio de dados

O frontend nunca deve consumir diretamente inventários operacionais, caminhos locais, hashes, estados privados de QA ou dados internos do Google Drive.

## Próximo marco

**Public Site v0.1**: consolidar o protótipo v3, separar tokens/estilos, implementar Home, catálogo, ficha de filme, seleções e Sobre, gerar catálogo público sanitizado e validar desktop/mobile.

A licença do código ainda não foi definida.
