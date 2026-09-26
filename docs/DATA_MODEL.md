# Modelo de dados público

A fonte operacional contém mais informação do que o site deve publicar. O site consome uma projeção pública sanitizada.

## Regra

Nenhum campo deve ser publicado apenas porque existe na base privada. A projeção pública é uma lista positiva de campos permitidos.

A ausência de um dado não autoriza inferência, preenchimento fictício ou publicação de um marcador como se fosse um valor real.

## Filme / obra

Campos públicos permitidos, quando houver evidência suficiente:

- `slug`;
- título público;
- título original;
- romanização do título original;
- direção;
- ano;
- país ou países;
- duração;
- gênero ou gêneros;
- sinopse;
- pôster público e texto alternativo correspondente.

Esses campos descrevem a obra cinematográfica.

## Cópias / variantes

Um filme pode possuir uma ou mais cópias/variantes públicas.

Cada cópia pode conter:

- identificador estável dentro do filme;
- rótulo editorial, somente quando necessário para distinguir duas ou mais cópias;
- resolução;
- tamanho arredondado em GiB;
- idioma ou idiomas de áudio;
- idioma ou idiomas de legenda;
- versão, edição ou restauração.

Resolução, tamanho, áudio, legendas e versão pertencem à cópia/variante, não ao filme abstratamente.

O tamanho exato em bytes pode permanecer na fonte privada. A projeção pública publica apenas o valor editorial arredondado em GiB.

## Cópia representativa do catálogo

`catalogCopyId` seleciona explicitamente qual cópia representa o filme em `/filmes/`.

Não inferir essa escolha pela resolução, tamanho, provedor externo ou posição no array.

Na projeção pública final, a cópia escolhida para o catálogo deve possuir resolução e tamanho comprovados.

## Links externos

Links para Internet Archive, Google Drive ou outro destino são dados de navegação, não estados editoriais do filme.

Cada link pode conter:

- provedor;
- URL deliberadamente compartilhada;
- referência opcional à cópia correspondente.

Google Drive só entra nessa projeção quando existir uma URL deliberadamente compartilhada para os visitantes. Localização privada, IDs internos e URLs privadas não são publicados.

Na interface:

- não mostrar filtros, selos ou mensagens de disponibilidade externa em `/filmes/`;
- não renderizar seção vazia para links na ficha individual;
- quando houver URL, mostrar somente o botão do provedor junto aos dados de `No acervo`;
- um provedor sem URL não gera texto, botão ou estado vazio.

## Contrato do catálogo visual

Cada card publicado em `/filmes/` segue a mesma hierarquia:

1. pôster;
2. título;
3. direção e ano;
4. resolução e tamanho da cópia selecionada;
5. `pt-BR` como informação adicional quando a cópia selecionada tiver legenda em Português (Brasil).

A grade e a lista são duas apresentações da mesma projeção e devem usar a mesma `catalogCopyId`.

A prévia de desenvolvimento pode mostrar `—` para dados ainda não importados, exclusivamente para avaliação visual. A projeção pública final não deve publicar um card sem pôster, resolução ou tamanho comprovados.

## Ficha individual

Quando houver uma única cópia, seus campos aparecem diretamente em `No acervo`; não mostrar o rótulo redundante `Cópia principal`.

Quando houver duas ou mais cópias, exibir rótulos editoriais apenas quando realmente distinguirem as variantes.

Links externos, quando existentes, aparecem como botões discretos abaixo dos dados do acervo.

Também podem ser publicados:

- nota editorial do acervo;
- seleções públicas às quais o filme pertence.

## Dados que permanecem privados

Continuam fora da projeção pública:

- caminhos locais;
- nomes de mounts;
- hashes e evidências operacionais;
- tamanho exato em bytes quando mantido como evidência técnica;
- inventário e localização privada no Google Drive;
- IDs privados de arquivos remotos;
- filas;
- logs;
- estados detalhados de QA;
- dados internos de publicação;
- credenciais e material de autenticação;
- arquivos canônicos privados completos.
