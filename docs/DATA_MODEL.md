# Modelo de dados público

A fonte operacional contém mais informação do que o site deve publicar. O site consome uma projeção pública sanitizada.

## Regra

Nenhum campo deve ser publicado apenas porque existe na base privada. A projeção pública é uma lista positiva de campos permitidos.

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

Esses campos descrevem a obra cinematográfica. Ausência de dado não deve gerar conteúdo inventado ou uma linha vazia na interface.

## Cópias / variantes públicas

A ficha pode publicar uma ou mais cópias ou variantes quando a distinção for útil. Cada cópia pública deve ter identidade própria e pode conter:

- rótulo editorial, como `Cópia principal`;
- resolução;
- tamanho arredondado em GiB;
- idioma ou idiomas de áudio;
- idioma ou idiomas de legenda;
- versão, edição ou restauração.

O tamanho público é deliberadamente arredondado. O tamanho exato em bytes pode permanecer na fonte privada e ser transformado durante a geração da projeção pública.

Resolução, tamanho, áudio, legendas e versão pertencem à cópia/variante, não ao filme abstratamente.

## Acesso público

Acesso é uma camada separada da cópia e da localização interna de armazenamento.

Campos públicos permitidos:

- provedor público;
- URL deliberadamente pública;
- referência opcional à cópia pública correspondente.

O Internet Archive pode ser apresentado como acesso público quando houver evidência e vínculo deliberado.

Google Drive só deve aparecer quando existir um link deliberadamente público para visitantes. O fato de um arquivo estar armazenado em um Drive privado não autoriza publicar o provedor, caminho, identificador ou URL.

Quando nenhuma forma de acesso público estiver vinculada, a interface pode informar `Somente no acervo`.

## Editorial

Também podem ser publicados:

- nota editorial do acervo;
- seleções públicas às quais o filme pertence.

## Dados que permanecem privados

Continuam fora da projeção pública:

- caminhos locais;
- nomes de mounts;
- hashes e evidências operacionais;
- tamanho exato em bytes quando mantido apenas como evidência técnica;
- inventário e localização privada no Google Drive;
- IDs privados de arquivos remotos;
- filas;
- logs;
- estados detalhados de QA;
- dados internos de publicação;
- credenciais e material de autenticação;
- arquivos canônicos privados completos.

## Regra de apresentação

A taxonomia interna de cópias não deve criar rótulos redundantes na interface pública.

- quando houver uma única cópia, mostrar seus campos diretamente em `No acervo`, sem o subtítulo `Cópia principal`;
- quando houver duas ou mais cópias, mostrar rótulos editoriais que realmente as distingam;
- em `Acesso`, provedores com URL pública deliberada podem aparecer como controles de link com aparência de botão;
- não renderizar um botão para um provedor sem URL pública;
- quando não houver URL pública, usar apenas a mensagem `Não há acesso público.`;
- se houver várias cópias e um acesso estiver ligado a uma cópia específica, o controle pode mostrar o rótulo dessa cópia como texto secundário.
