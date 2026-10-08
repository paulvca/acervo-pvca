# Information architecture

## Public routes

- `/`, `/filmes/`, `/filmes/<slug>/`, `/selecoes/`, `/selecoes/<slug>/`, `/sobre/`.
- Each public content route has an equivalent under `/en/`.
- `/404.html` is the bilingual Pages fallback; `/en/404/` is its explicit English counterpart. Both are noindex and omitted from sitemap.

## Home

1. Collection identity/introduction, followed by concise collection figures.
2. Featured film.
3. Recent additions.
4. Personal selections.
5. Films by decade.

The current published implementation and recent home revisions establish figures in the introduction. The earlier instruction to place every figure at the end is superseded; this reconciliation does not move components. Figures remain editorial, without dashboard controls or a change in visual direction. `showStats` controls both the introduction figures and decade chart on Home.

## Film detail

Public poster, title/original title, year, director, country, runtime and available public synopsis. Technical details belong to copies; the selected copy represents the catalog. Distinct technical presentations are named symmetrically, while all real public source links remain available. Related selections and collection notes are included where public data supplies them.

## Private boundary

No admin routes, operational paths, credentials, hashes, mount details or private workflow state enter the public artifact. Preserved poster sources and older revisions are stored under `assets/poster-sources/`, outside the automatically published `public/` directory.
