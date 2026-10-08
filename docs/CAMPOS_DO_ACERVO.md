# Informações para incluir um filme

Você pode enviar sua planilha no formato em que ela já existe. Este guia descreve
as informações que o site consegue apresentar; não exige que sua planilha use
esses nomes ou essa ordem. A correspondência das colunas será feita quando os
dados chegarem, separando o que é público do que é privado.

## A obra

| Informação                    | Para que serve                                                      |
| ----------------------------- | ------------------------------------------------------------------- |
| Título, direção e ano         | Identificam o filme e permitem a busca. Necessários para cadastrar. |
| Pôster                        | Imagem real do filme, necessária para o catálogo visual.            |
| Título original e romanização | Complementam o título, quando conhecidos.                           |
| Países, duração e gêneros     | Ajudam a entender a obra.                                           |
| Idiomas originais             | Descrevem a obra, independentemente dos áudios da cópia.            |
| Sinopse                       | Apresenta o filme.                                                  |
| Seleções                      | Agrupamentos editoriais aos quais ele pertence.                     |
| Nota editorial                | Comentário pessoal destinado aos visitantes.                        |

O identificador estável e o endereço da ficha (`slug`) fazem parte da organização
do cadastro. Posso prepará-los a partir dos dados enviados, conferindo duplicações.
Eles não são caminhos de arquivos nem identificadores privados de serviços.

## Cada cópia preservada

| Informação                    | Para que serve                                                         |
| ----------------------------- | ---------------------------------------------------------------------- |
| Resolução                     | Descreve essa cópia; necessária para publicar.                         |
| Tamanho e unidade de origem   | Permitem mostrar o tamanho em GiB; necessários para publicar.          |
| Idiomas de áudio              | Informam quais áudios estão presentes nessa cópia.                     |
| Idiomas de legenda            | Informam quais legendas estão presentes, incluindo Português (Brasil). |
| Formato                       | Contêiner do arquivo, quando conhecido.                                |
| Edição, versão ou restauração | Identificam diferenças relevantes entre cópias.                        |
| Rótulo                        | Nome público para distinguir variantes, somente quando necessário.     |

Um filme pode ter várias cópias. É preciso escolher explicitamente qual delas
representa o filme na grade e na lista. A maior resolução não faz essa escolha.
Os idiomas e o indicador `pt-BR` do catálogo correspondem à cópia escolhida.

O tamanho é mostrado com uma casa decimal em GiB. Bytes podem ser convertidos
por `bytes / 1.073.741.824`; GB decimal e GiB são unidades diferentes. Quando a
unidade da planilha estiver ambígua, ela precisa ser esclarecida antes da conversão.
Não se reaproveitam números de mockups.

## Destinos compartilhados

Internet Archive e Google Drive são opcionais. Basta a URL que você decidiu
compartilhar, com referência à cópia quando houver mais de uma. O destino não
muda os campos necessários para cadastrar o filme. Sem URL, não aparece botão.
O fluxo do catálogo não faz uploads nem publica o site.

## Informações ainda desconhecidas

Dados opcionais desconhecidos permanecem ausentes. Uma lista vazia de idiomas
significa que nenhum idioma foi informado: não é prova de ausência de áudio ou
legendas. Ausência de pôster, resolução ou tamanho impede a entrada no catálogo
final; esses itens ficam pendentes, sem valores inventados.

Caminhos locais, hashes, filas, logs, estados de QA, credenciais, IDs privados e
notas internas não pertencem ao cadastro público. A validação bloqueia campos
fora do contrato, mas o conteúdo dos textos e a decisão de compartilhar URLs
também precisam ser conferidos antes de importar.

## Ambiente preparado

O catálogo real está vazio em `data/public/catalog.json`. Enquanto estiver vazio,
o site mantém a prévia de desenvolvimento existente, com suas lacunas explícitas.
O modelo em `data/templates/film.blank.json` também está vazio e serve somente
para organizar uma futura entrada. Não contém um filme pronto para publicar.

Quando você enviar os dados: conferir as colunas e unidades, identificar os filmes
e suas cópias, listar pendências, separar os campos públicos, validar a entrada e
revisar o resultado local. A operação técnica está documentada em
[DATA_INTAKE.md](DATA_INTAKE.md).
