# Seu painel local

O painel é uma ferramenta separada do site dos visitantes. Ele funciona no seu
computador, sem conta online. Seu endereço é <http://127.0.0.1:4323/>.
Ele precisa estar iniciado para esse endereço funcionar.

## Início

Em **Filme em destaque**, escolha um filme e salve. Você pode trocar Napoléon por
outro, escolher nenhum destaque e escrever uma nota para a home. Se a nota ficar
vazia, aparece a nota editorial do filme, quando houver.

**Recentemente** acompanha as datas de entrada dos filmes no catálogo real.
Você escolhe quantos aparecem. Editar uma ficha não muda sua data de entrada.
Filmes sem data não aparecem como adições recentes. Enquanto o catálogo real
estiver vazio, a prévia mantém seus exemplos anteriores, sem atribuir datas a eles.

Você também escolhe as seleções exibidas na home e se os números do acervo
aparecem. Os números são calculados, não digitados manualmente.

## Filmes

**Novo filme** abre um formulário com dados da obra e das cópias. Diretores,
países e idiomas podem ser separados por ponto e vírgula. Para cada cópia, há
resolução, tamanho em GiB, formato, áudios, legendas e edição. Marque qual cópia
representa o filme no catálogo. Os botões de destino vêm das URLs compartilhadas.

**Salvar rascunho** guarda o formulário mesmo incompleto, sem colocá-lo no site.
**Aplicar ao catálogo** confere os dados obrigatórios e altera somente o catálogo
local. Para atualizar uma ficha, escolha o filme já cadastrado; suas outras cópias
e links continuam no formulário. O endereço da ficha fica preservado.

O seletor de pôster copia uma imagem escolhida para os assets públicos locais.
Aceita PNG, JPEG, WebP e AVIF de até 5 MiB. Um pôster escolhido ainda não usado
pode ficar nessa pasta; não há limpeza automática de arquivos.

Os exemplos incompletos da prévia não são registros reais editáveis. Eles podem
ser escolhidos para avaliar o destaque; filmes reais só entram quando você fornecer
os dados e aplicar o cadastro.

## Seleções

Você pode criar ou editar título e descrição, escolher filmes e remover seleções
sem apagar as obras. As seleções de legendas em Português (Brasil) e de 4K também
podem usar regras automáticas, sempre baseadas na cópia representativa.

## Conferir antes de publicar

Depois de salvar, **Gerar prévia** atualiza as páginas estáticas locais. **Abrir
prévia** abre o site para conferência. Esses botões não publicam o site, não fazem
push e não enviam arquivos para Archive ou Drive. A publicação continua sendo
uma etapa separada, mediante sua autorização.

As alterações dos dados públicos ficam disponíveis para revisão no Git. Rascunhos
e cópias de segurança automáticas ficam em `.local-admin/`, fora do Git e do site
gerado. O processo técnico está em [LOCAL_ADMIN.md](LOCAL_ADMIN.md).

## Idiomas e importação

O seletor PT / EN funciona também no painel. As fichas permitem editar título e
sinopse em português e inglês, além da nota editorial em inglês. A home e as
seleções também possuem campos de texto em inglês.

Na aba **Importar JSON**, escolha o arquivo, valide e confira o resumo. Só
**Confirmar importação** altera a base. A opção TMDB busca metadados para os
registros com `tmdb_id`; as informações técnicas da cópia continuam sendo suas.
Itens incompletos ficam como rascunhos. Importar o mesmo arquivo novamente não
cria filmes repetidos, e campos que você editou manualmente ficam protegidos.
