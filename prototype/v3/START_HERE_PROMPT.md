# PROMPT DE CONTINUAÇÃO — ACERVO PVCA | SITE PESSOAL DE CINEMA

Você está continuando uma conversa já avançada sobre a evolução do **Acervo PVCA** de uma planilha para um site pessoal de cinema.

Antes de propor mudanças, leia os arquivos anexos relevantes, principalmente:

1. `site_prototypes/acervo_pvca_noah_dark_concept_v3.html` — **referência visual mais atual e mais próxima da direção aprovada**.
2. `site_prototypes/acervo_pvca_site_personal_v2.html` — iteração anterior, mais pessoal que a v1, mas ainda não tão próxima da direção atual.
3. `site_prototypes/acervo_pvca_site_prototype_v1.html` — primeira tentativa; útil principalmente como registro do que NÃO queremos: ficou corporativa/institucional demais.
4. `sources/Acervo_PVCA_CATALOGO_CANONICO_v6_1.json` — fonte canônica de dados do acervo.
5. `sources/ACERVO_PVCA_WORKFLOW.md` — autoridade operacional/semântica para o workflow do acervo.
6. `sources/Acervo_PVCA_INDEPENDENT_AUDIT_REPORT.md` e `sources/independent_audit_evidence.json` — invariantes e números verificados.
7. `references/acervo_pvca_referencia_visual_v1.html` e `references/sheet_mockups/` — referências históricas da fase Google Sheets; não devem ditar o design atual.
8. `CONVERSATION_TRANSCRIPT.md` — registro condensado da conversa que levou à direção atual.

Não reinicie o processo de descoberta do zero. Continue a partir das decisões abaixo.

---

## 1. Objetivo do produto

O Acervo PVCA é, antes de tudo, **um acervo pessoal de cinema**.

O site deve ter duas faces sobre a mesma base de dados:

### Face pública
Um site pessoal, autoral e navegável onde outras pessoas possam:

- explorar os filmes do acervo;
- pesquisar por título, diretor, década, cinematografia e outros filtros úteis;
- ver quais filmes estão disponíveis publicamente;
- ver resolução principal;
- ver idiomas de áudio quando apropriado;
- ver quais legendas estão disponíveis;
- saber se existe legenda em português do Brasil;
- acessar o Internet Archive quando houver uma cópia pública verificada;
- navegar por seleções pessoais/curadorias;
- descobrir filmes por relações editoriais, e não apenas por filtros automáticos;
- ver algumas estatísticas gerais do acervo.

### Face privada
Um painel administrativo somente do proprietário, usado para:

- organizar os filmes;
- acompanhar LOCAL / DRIVE / ARCHIVE;
- controlar publicação;
- acompanhar pendências;
- acompanhar QA;
- consultar detalhes técnicos;
- editar metadados quando autorizado;
- manter seleções/curadorias;
- acompanhar armazenamento;
- revisar estados da coleção;
- ver histórico e próximas ações.

**Público e privado devem usar a mesma fonte de dados**, com uma projeção pública sanitizada. Não criar dois catálogos manuais independentes.

---

## 2. Identidade: isto NÃO é uma empresa, plataforma ou instituição

Esta decisão é central.

O usuário rejeitou explicitamente uma direção que parecia:

- SaaS;
- dashboard corporativo;
- museu institucional;
- “cinemateca digital” formal;
- plataforma de streaming;
- produto B2B;
- clone visual da Apple;
- clone do Letterboxd/MUBI/Netflix.

O site precisa continuar parecendo **o acervo pessoal de uma pessoa que gosta muito de cinema e abriu sua coleção para outras pessoas explorarem**.

A frase de orientação é:

> **“Parecer alguém que abriu sua estante pessoal de cinema para você explorar.”**

Evitar linguagem institucional como:

- “plataforma de preservação”;
- “cinemateca digital”;
- “ecossistema”;
- “solução”;
- “gestão de ativos”;
- “curadoria em destaque” quando uma expressão simples como “Uma seleção” funciona melhor.

Preferir linguagem pessoal e simples:

- “Meu acervo pessoal de cinema.”
- “Filmes que fui reunindo ao longo do tempo.”
- “Uma seleção.”
- “Recentemente.”
- “Sobre o acervo.”
- “No meu acervo.”
- “Nota do acervo.”
- “Seleções.”

---

## 3. Referência visual principal

A referência mais importante atualmente é:

**https://www.noahzender.com/ideas**

Se acesso à web estiver disponível e a tarefa for de design, inspecione essa página antes de redesenhar.

O que queremos absorver dela:

- sensação de site pessoal;
- estrutura de índice;
- navegação mínima;
- introdução curta;
- hierarquia tipográfica forte;
- conteúdo organizado por grupos;
- quase nenhum card;
- poucos componentes “de produto”;
- muito espaço negativo;
- listas simples;
- texto e conteúdo fazendo o trabalho visual;
- uma peça em destaque seguida por índices/listas;
- ritmo editorial informal, não institucional.

Não copiar literalmente o site ou sua identidade. Adaptar a lógica ao Acervo PVCA.

### Dark mode

A versão do Acervo deve ser dark.

Base Flexoki Dark:

- fundo: `#100F0F`
- texto principal: `#CECDC3`
- texto secundário: `#878580`
- texto suave: `#B7B5AC`
- linhas/divisores: aproximadamente `#2D2B2A` a `#403E3C`
- verde funcional: `#879A39`
- amarelo funcional: `#D0A215`
- vermelho funcional: `#D14D41`
- azul funcional: `#4385BE`

Cor deve ser funcional, não decorativa.

---

## 4. Outras referências já discutidas

Estas são referências secundárias para estruturas específicas, não para copiar a estética inteira:

### Curadoria/editorial
- LaCinetek — curadoria humana e listas de cineastas.
- Harvard Film Archive — séries, retrospectivas e agrupamentos editoriais.
- Criterion — catálogo + editorial.
- Metrograph — ritmo de homepage editorial.
- MUBI — apresentação cinematográfica e descoberta, mas evitar linguagem de streaming.

### Acervo/preservação
- Eye Filmmuseum — coleção + números + contexto.
- Film Foundation / World Cinema Project — fichas de filme com contexto de preservação.

### Estrutura/código
- Musefully (GitHub) — coleção, busca e navegação por itens.
- Directory Starter (GitHub) — diretório pesquisável com Next.js/Supabase.
- Screenbox / `Lazhari/react-movies-finder` — componentes e lógica de filmes, não sua estética.
- `Kiranism/next-shadcn-dashboard-starter` — apenas como referência de implementação para o painel privado.

### Filosofia
- Dieter Rams: disciplina, clareza, “less, but better”.
- Apple: polimento de interação, hierarquia e responsividade. **Não usar Apple como identidade visual explícita e não transformar tudo em glassmorphism.**

A referência visual dominante no momento continua sendo **Noah Zender / Ideas + Flexoki Dark + caráter pessoal**.

---

## 5. Direção atual da interface pública

A navegação pública deve ser muito simples. A versão atual trabalha com:

- Início
- Filmes
- Seleções
- Sobre

O Admin **não deve aparecer como uma seção normal da navegação pública**.

Pode existir um link discreto no rodapé ou uma rota separada como `/admin`, mas a implementação final deve usar autenticação real se houver dados/ações privadas.

### Home

A Home deve parecer um site pessoal, não um dashboard.

Estrutura aprovada como ponto de partida:

1. Introdução pessoal:
   - “Meu acervo pessoal de cinema.”
   - “Filmes que fui reunindo, preservando, legendando e organizando ao longo do tempo.”
2. Um filme ou pequena seleção em destaque.
3. “Recentemente” — adições/revisões recentes em formato de índice/lista.
4. “Seleções” — agrupamentos pessoais.
5. “O acervo” — números apresentados de forma discreta/editorial.
6. Rodapé simples.

Não abrir com uma grade de KPIs.

### Filmes

O catálogo completo deve priorizar **lista limpa**, não uma parede de cards.

Exemplo de estrutura:

`Título | Diretor | Ano | disponibilidade/indicador curto`

Filtros podem existir, mas devem ser discretos.

Pode haver um modo de grade posteriormente, porém a lista é uma direção forte porque combina melhor com a referência Noah Zender.

### Seleções

“Seleções” é o nome preferido no site público.

Uma seleção pode ser:

- manual/editorial;
- ordenada manualmente;
- ter título;
- ter texto curto;
- ter uma capa/imagem opcional;
- agrupar filmes por um raciocínio pessoal.

Exemplos discutidos:

- Japão depois da guerra
- Sidney Lumet
- Noir americano
- Com legendas em português
- Restaurações em 4K

Nem toda seleção deve ser um simples filtro SQL. Algumas precisam representar escolha humana.

### Sobre

A página deve explicar que:

- é um acervo pessoal;
- começou como forma de organizar os próprios filmes;
- foi ganhando cópias, legendas, metadados e workflow;
- o site abre parte dessa coleção para outras pessoas;
- não pretende fingir ser uma instituição ou serviço de streaming.

---

## 6. Informações do antigo Dashboard

O usuário quer manter as informações valiosas do Dashboard, mas não quer que o site público pareça um dashboard.

No público, os dados devem aparecer como **contexto da coleção**.

Exemplos:

- quantidade de filmes;
- distribuição por décadas;
- cinematografias;
- quantidade disponível no Archive;
- quantidade com pt-BR;
- quantidade em 2160p;
- eventualmente diretores mais presentes.

Evitar:

- cards enormes de KPI;
- seis caixas iguais no topo;
- gráficos com aparência de BI/SaaS;
- painéis cheios de bordas.

Preferir:

- texto;
- números integrados à narrativa;
- micrográficos;
- barras simples;
- listas ordenadas;
- pequenos indicadores.

No painel privado, entretanto, a informação pode ser mais densa e operacional.

---

## 7. Painel privado

O painel privado deve manter a mesma linguagem visual básica, mas pode ser mais funcional/denso.

Áreas esperadas:

- Visão geral
- Filmes
- Pendências
- Seleções
- Publicação
- QA
- Importação
- Histórico

Dados importantes no Admin:

- total de filmes;
- Archive;
- Drive;
- Local;
- Aguardando;
- Revisar;
- armazenamento;
- pendências;
- próxima ação;
- estado das cópias;
- informação técnica;
- histórico.

Não expor isso automaticamente no público.

O Admin deve parecer **uma ferramenta pessoal bem organizada**, não um SaaS para equipes.

---

## 8. Arquitetura de dados e privacidade

A fonte factual canônica é o JSON v6.1 anexado.

### Invariantes centrais

- 424 filmes ativos.
- IDs ativos entre `PVCA-000001` e `PVCA-000425`.
- `PVCA-000338` é intencionalmente ausente/reservado.
- Nunca renumerar para preencher a lacuna.
- Modelo conceitual:
  `WORK → COPY → MEDIA TECHNICAL STATE → TRACKS`
- Chaves estáveis:
  - `PVCA_ID`
  - `COPY_KEY = PVCA_ID|SERVICE`
  - `MEDIA_KEY`
- Nunca depender do título ou da posição da linha quando existir uma chave estável.
- Propriedades técnicas são **copy-scoped**.
- A mídia preferida representa uma cópia concreta; não misturar propriedades de cópias diferentes.

### Estados por serviço no JSON canônico

Resumo conhecido:

- LOCAL:
  - AVAILABLE: 9
  - ABSENT: 415
- DRIVE:
  - AVAILABLE: 139
  - ABSENT: 285
- ARCHIVE:
  - AVAILABLE: 310
  - PENDING: 9
  - ABSENT: 104
  - ABSENT_MEDIA_COPY: 1

### Regra pública de Archive

Somente uma cópia realmente disponível/verificada deve virar disponibilidade pública/link.

`PENDING` não significa “já disponível”.

LOCAL nunca deve virar link público de armazenamento.

### pt-BR

A classificação pública deve respeitar evidência:

- **Sim**: pelo menos uma cópia AVAILABLE inspecionada prova pt-BR.
- **Não**: somente quando há evidência suficiente de ausência.
- **Desconhecido**: evidência insuficiente.
- Não inferir por nome de arquivo.
- Não confundir pt-PT com pt-BR.
- Cópia não inspecionada não equivale a zero legendas.

### Privacidade

Não publicar automaticamente:

- caminhos locais;
- hashes;
- identificadores técnicos internos desnecessários;
- evidence methods;
- estados internos de QA;
- problemas da pipeline;
- dados privados de Drive;
- informações administrativas não destinadas ao visitante.

O público deve receber uma projeção sanitizada dos dados canônicos.

---

## 9. Números operacionais conhecidos

Alguns números independentes já foram verificados no processo anterior:

### Armazenamento
- Drive: `3,909,439,217,620` bytes
- Archive: `5,482,107,478,556` bytes
- Drive + Archive: `9,391,546,696,176` bytes
- Local: `167,660,690,808` bytes

### Situação operacional
- Arquivado: 292
- Aguardando: 9
- Revisar: 26
- Na fila: 97

### pt-BR
- Sim: 81
- Não: 325
- Desconhecido: 18

### Pendências
Baseline anterior:
- 141 ações
- Alta: 26
- Normal: 113
- Baixa: 2

Use o JSON/auditoria como fonte antes de afirmar números na implementação real.

**Atenção:** alguns números de cinematografias mostrados nos protótipos HTML são ilustrativos. Não os trate como fatos canônicos sem derivá-los/validá-los.

---

## 10. `CINEMA_PRINCIPAL`

O projeto já definiu que “cinema/cinematografia” não deve ser inferido de forma simplista por:

- nacionalidade do diretor;
- idioma;
- primeiro país de produção.

`CINEMA_PRINCIPAL` é uma classificação curada/editorial.

Se essa camada for usada no site final, deve manter:

- `CINEMA_PRINCIPAL`
- fonte
- observação quando necessário

Em casos realmente transnacionais, usar classificação apropriada, sem forçar uma nacionalidade única.

---

## 11. Hospedagem e stack

Foi discutido inicialmente GitHub Pages.

Conclusão importante:

- GitHub pode hospedar o repositório e o site público estático.
- Porém **GitHub Pages puro não deve ser tratado como solução segura para um Admin privado com dados e ações sensíveis**.
- Esconder `/admin` ou colocar senha em JavaScript não é segurança.

Se o projeto avançar para Admin real, avaliar uma arquitetura simples com autenticação/backend, por exemplo:

- GitHub como repositório;
- Next.js/React ou solução equivalente para frontend;
- Vercel/Cloudflare para deploy;
- Supabase ou equivalente para Auth + banco.

Mas **não superarquitetar agora**.

A prioridade imediata é fechar:

1. identidade;
2. arquitetura da informação;
3. página inicial;
4. catálogo;
5. ficha;
6. seleções;
7. transição público ↔ privado.

Somente depois consolidar stack definitiva.

---

## 12. Prototipagem atual

### `acervo_pvca_site_prototype_v1.html`
Primeira tentativa.

Problema principal:
- corporativo demais;
- institucional;
- muito dashboard;
- muitos cards;
- parecia produto/SaaS.

Não voltar nessa direção.

### `acervo_pvca_site_personal_v2.html`
Melhorou:
- linguagem mais pessoal;
- “Seleções”;
- Home menos dashboard;
- Admin menos visível;
- mais espaço e menos caixas.

Ainda estava distante da referência desejada.

### `acervo_pvca_noah_dark_concept_v3.html`
É o baseline atual.

Características:
- mais próximo de `noahzender.com/ideas`;
- dark;
- índice/lista;
- poucos cards;
- Home pessoal;
- um destaque;
- recentes;
- seleções;
- números discretos;
- catálogo em lista;
- painel privado separado.

Use esta versão como ponto de partida para a próxima iteração, não como solução final imutável.

---

## 13. Regras visuais atuais

### Fazer
- tipografia forte;
- layout silencioso;
- bastante respiro;
- listas;
- divisores discretos;
- imagens/pôsteres usados com intenção;
- destaque editorial pontual;
- pequenas observações pessoais;
- microinterações discretas;
- dark mode contínuo;
- leitura confortável;
- excelente responsividade.

### Evitar
- card para tudo;
- border-radius excessivo;
- sombras fortes em toda parte;
- grid de dashboard;
- glassmorphism;
- badges em excesso;
- ícones decorativos;
- labels corporativos;
- hero de streaming;
- carrossel estilo Netflix;
- linguagem de produto;
- estatísticas dominando a Home;
- dezenas de cores;
- interface “premium SaaS”.

---

## 14. Tom editorial

O texto deve soar como o proprietário do acervo falando de sua coleção.

Tom:

- pessoal;
- simples;
- preciso;
- sem marketing;
- sem grandiloquência;
- sem fingir autoridade institucional.

Exemplo bom:

> “Filmes que fui reunindo, preservando, legendando e organizando ao longo do tempo.”

Exemplo ruim:

> “Uma plataforma digital dedicada à preservação, catalogação e democratização do patrimônio cinematográfico mundial.”

---

## 15. Como trabalhar nesta nova conversa

Ao receber este prompt e os arquivos:

1. Leia primeiro o HTML v3 e o transcript.
2. Consulte o JSON/workflow quando a tarefa envolver dados, arquitetura, disponibilidade, legendas ou Admin.
3. Não reabrir decisões já tomadas sem motivo.
4. Se o usuário pedir uma nova versão visual, criar diretamente o artefato solicitado.
5. Se uma decisão não estiver fechada, apresentar poucas alternativas relevantes, não uma lista genérica de possibilidades.
6. Não inventar dados do acervo.
7. Não apresentar números ilustrativos como canônicos.
8. Manter o caráter pessoal acima da estética corporativa.
9. Para qualquer interface pública, perguntar implicitamente: “isso parece uma pessoa mostrando sua coleção ou uma empresa vendendo um produto?”
10. Para qualquer interface privada, perguntar: “isso me ajuda a operar o acervo com rapidez sem transformar o painel em um SaaS genérico?”

---

## 16. Próximo estado desejado

A próxima iteração provavelmente deve aprofundar a v3, especialmente:

- homepage ainda mais refinada;
- uso real de pôsteres;
- tipografia;
- espaçamento;
- ficha de filme como página/overlay mais convincente;
- modo Lista x Grade no catálogo, se fizer sentido;
- página de seleção individual;
- como mostrar legendas e disponibilidade sem badges demais;
- como incorporar os dados do Dashboard de forma editorial;
- contraste entre site público e painel privado;
- comportamento mobile;
- preparação futura para dados reais.

Não assuma que tudo precisa ser feito de uma vez.

**Objetivo final:** um site pessoal de cinema, simples, elegante e autoral, que permita explorar o Acervo PVCA e, ao mesmo tempo, possua por baixo um painel privado robusto para organizar a coleção.
