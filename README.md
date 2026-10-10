# Acervo PVCA

[English below](#english)

O Acervo PVCA é um catálogo público da minha coleção pessoal de cinema. Traz informações sobre os filmes e suas cópias preservadas, além de seleções que organizo por temas e afinidades.

[Acesse o catálogo](https://pv-ca.github.io/acervo-pvca/).

## O que você encontra no site

Cada filme tem uma ficha com direção, ano, país e duração. As cópias do acervo informam resolução, tamanho do arquivo, áudio e legendas. Quando há outras versões ou edições de uma obra, elas ficam na mesma página.

Os links nas fichas levam às cópias que escolhi compartilhar. O site tem versões em português e inglês.

## Sobre o repositório

Este repositório contém o código do site e os dados públicos do catálogo. O site é feito com Astro, TypeScript e CSS próprio.

No catálogo público entra apenas uma parte da base privada que uso para organizar a coleção. Caminhos locais, informações internas de armazenamento e registros de revisão ficam de fora.

## Desenvolvimento

Com as dependências instaladas, use `npm run dev` para iniciar o servidor local e `npm run build` para gerar o site estático. O comando `npm run quality` confere formatação, lint, tipos, testes e a validação do catálogo.

Mais detalhes na documentação:

- [Campos do acervo](docs/CAMPOS_DO_ACERVO.md)
- [Arquitetura do projeto](docs/ARCHITECTURE.md)
- [Importação de dados](docs/DATA_INTAKE.md)
- [Qualidade e manutenção](docs/QUALITY.md)

## Créditos e licença

Metadados e pôsteres vêm do [TMDB](https://www.themoviedb.org/), quando disponíveis. Este projeto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.

A licença do código ainda não foi definida.

## Outros perfis

- [Letterboxd](https://letterboxd.com/pvca/)
- [X](https://x.com/vaidadehumana)

---

## English

Acervo PVCA is a public catalog of my personal film collection. It includes information about the films and the copies I preserve, along with selections I put together around shared themes and interests.

[Browse the catalog](https://pv-ca.github.io/acervo-pvca/en/).

## What you can find on the website

Each film has a page with its director, year, country, and runtime. Copies in the collection also list resolution, file size, audio, and subtitles. When a film has other versions or editions in the collection, they appear on the same page.

Links on the film pages lead to the copies I have chosen to share. The website is available in Portuguese and English.

## About the repository

This repository contains the website's source code and the catalog's public data. The site is built with Astro, TypeScript, and custom CSS.

Only part of the private database I use to organize the collection is published here. Local paths, internal storage information, and review records stay out of the public catalog.

## Development

With dependencies installed, use `npm run dev` to start the local server and `npm run build` to generate the static site. `npm run quality` checks formatting, lint, types, tests, and catalog validation.

More details in the documentation:

- [Catalog fields](docs/CAMPOS_DO_ACERVO.md)
- [Project architecture](docs/ARCHITECTURE.md)
- [Data imports](docs/DATA_INTAKE.md)
- [Quality and maintenance](docs/QUALITY.md)

## Credits and license

Metadata and posters come from [TMDB](https://www.themoviedb.org/) when available. This product uses the TMDB API but is not endorsed or certified by TMDB.

A license for the code has not yet been chosen.

## Other profiles

- [Letterboxd](https://letterboxd.com/pvca/)
- [X](https://x.com/vaidadehumana)
