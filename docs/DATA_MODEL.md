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

## Cópia no acervo

Campos públicos permitidos, quando aprovados e comprovados:

- resolução ou descrição pública do vídeo;
- idioma ou idiomas de áudio;
- idioma ou idiomas de legenda;
- disponibilidade pública;
- URL pública do Internet Archive;
- nota editorial do acervo;
- seleções públicas às quais o filme pertence.

A ficha deve distinguir visualmente a obra cinematográfica da cópia mantida no Acervo PVCA.

## Dados que permanecem privados

Continuam fora da projeção pública:

- caminhos locais;
- nomes de mounts;
- hashes e evidências operacionais;
- inventário privado do Google Drive;
- filas;
- logs;
- estados detalhados de QA;
- dados internos de publicação;
- credenciais e material de autenticação;
- arquivos canônicos privados completos.
