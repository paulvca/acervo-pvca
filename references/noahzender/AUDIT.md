# Terceira auditoria independente — Noah Zender reference

## Veredito

A v2 passou neste terceiro pente-fino **sem perda estrutural detectável** em
relação ao ZIP original. Não encontrei novas falhas como as duas assinaturas
estruturais que haviam escapado da v1.

Para tornar a evidência mais auditável, gerei uma **v3** baseada na v2,
acrescentando inventários derivados de recursos externos, vocabulário HTML,
assets referenciados pelo CSS e hashes SHA-256 de todos os arquivos.

## Comparação exata com o original

- Rotas no original: **493**
- Rotas na v2/v3: **493**
- Rotas ausentes: **0**
- Rotas extras: **0**
- Rotas duplicadas no original: **0**
- Rotas duplicadas na v2: **0**
- Colisões de diretório/slug: **0**
- Arquivos estruturais ausentes: **0**
- Divergências de hash nos arquivos estruturais preservados: **0**
- Divergências no inventário semântico por rota: **0**
- CSS preservado byte a byte: **sim**

## Arquivos por rota verificados por hash

Para cada uma das 493 rotas, comparei contra o original:

- `raw.html`
- `rendered.html`
- `dom-structure.txt`
- `links.json`
- `desktop-layout.json`
- `mobile-layout.json`
- `responsive-diff.json`

As variantes mobile de `<head>` das 9 exceções também foram comparadas.

## Vocabulário HTML

Não houve perda de:

- tags: **34 tipos únicos**
- classes: **179 únicas**
- IDs: **14 únicos**
- atributos: **39 tipos únicos**

Diferenças detectadas entre original e v2/v3:

- tags ausentes: []
- classes ausentes: []
- IDs ausentes: []
- atributos ausentes: []

## Componentes especiais encontrados

{
  "blockquote": 1,
  "button": 986,
  "code": 6,
  "mark": 94,
  "pre": 1
}

Todos permanecem dentro dos HTMLs renderizados preservados.

## Recursos externos

A v3 inclui inventários explícitos de:

- `src`, `href`, `poster`, `data-src`, `srcset` e referências equivalentes;
- domínios externos usados;
- URLs/imports do CSS;
- `@font-face`;
- keyframes.

Essas informações já estavam implicitamente presentes no HTML/CSS da v2, mas
agora estão consolidadas em `audit/`, facilitando a reconstrução.

## Única redução que permanece

Não são mantidas screenshots das 493 rotas. São mantidas as 13 referências
visuais escolhidas por cobertura estrutural.

Isso **não elimina a estrutura, os estilos computados ou a responsividade**:
cada rota continua com HTML renderizado exato, `desktop-layout.json`,
`mobile-layout.json` e `responsive-diff.json`.

Para recriar o Acervo PVCA, isso é suficiente para estudar a arquitetura do
site. Se o objetivo mudasse para um arquivo visual histórico perfeito de cada
artigo do Noah, aí sim seria necessário manter todas as screenshots — mas isso
é diferente do nosso objetivo atual.

## SHA-256 do ZIP v3

`0c1dda4ebb51b054a749eb85c9abf666f0eb09ab8987d6aa52e7a198f2a23f8d`
