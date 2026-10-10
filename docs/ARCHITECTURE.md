# Catalog, internationalization and local editing architecture

## Boundaries

Astro remains a static public site, with pt-BR routes at `/` and English counterparts
at `/en/`. Both use the same pages/components, typography and Flexoki tokens.
No public request calls TMDB or the editing server. No admin route, credential,
draft, provenance field or operational inventory is emitted by Astro.

The Node editor remains bound to `127.0.0.1:4323`. Its JSON API enforces the local
Host, Origin and per-process write token. It is for a trusted local owner, not a
remote multi-user service. It does not publish, deploy or upload movie files.

## Language policy

`PT / EN` links preserve the equivalent page. Manual choice is stored as
`pvca-language` and wins over detection. Without a choice, the primary browser
language selects pt-BR for Portuguese and English otherwise. A Brazilian region
hint in the browser locale or a Brazilian configured time zone also selects pt-BR. Time zone is a device configuration hint, not proof of physical location.
No IP geolocation, tracking service
or location permission is used: a visitor's actual country cannot be determined
reliably by a static site alone. Storage-blocked browsers still have working
language links, but cannot persist a choice. Detection requires JavaScript;
Portuguese is the no-JavaScript default, and English routes are independently
usable without it.

Interface messages are centralized in `scripts/i18n/`. Dynamic counters, menu
labels, placeholders, empty states, editing messages and import feedback use the
same language policy. Movie `translations.pt-BR` / `translations.en` hold title,
synopsis and collection note independently. Missing translations fall back to
existing primary content; they are not machine-translated or invented. The two
existing development-preview editorial texts have explicit English equivalents.
Work identity, copies, directors, dates, poster and technical data are shared.
Selections and featured notes can have English text through the editor, too.

## Storage and relationships

`.local-admin/database.json` is the editor's normalized, versioned JSON database:

- `films`: stable work identity, language-neutral/public fields and localized text;
- `entities.directors`: reusable director records, preferably keyed by TMDB person ID;
- `entities.countries`: reusable countries, keyed by ISO code when available;
- `entities.genres`: reusable genres, keyed by TMDB genre ID when available;
- `entities.languages`: reusable original/audio/subtitle language records;
- per-film relation ID arrays and per-copy language relation ID arrays;
- manual field locks, source fingerprints, publication readiness and revision.

Names supplied without external IDs receive stable normalized-name identities.
Names are not claimed to uniquely identify people across different TMDB IDs.
Film year is a scalar, not an unnecessary separate table. Selection definitions
remain a public editorial document with explicit film relationships/rules.

The database is excluded from Git and static output. Back it up with the private
editing state; the public JSON alone does not retain manual locks or drafts.
`data/public/catalog.json` is a deliberately denormalized allowlisted projection
for fast static generation, not a duplicate editing database. The reader can
bootstrap previous public records and reconcile explicit compatibility CLI edits.
A transaction journal lets the editor finish database/projection writes after an
interruption. Previous public JSON versions are retained in local backups.

The single-user JSON store avoids adding a database server, ORM or dependency.
Import uses indexed identity lookups and shared entity registries; a deterministic
1,000-record test checks idempotence and entity reuse. This is not a benchmark for
concurrent users. If that scope changes, the repository layer can move to SQLite
without changing the public projection or templates.

## JSON import

The import tab accepts a JSON array, up to 10,000 records within the 8 MiB request
limit. It accepts the existing public field names plus `tmdb_id`, `imdb_id`,
`release_date`, `translations` and `localized_metadata`. A TMDB-only candidate
can be `{ "tmdb_id": <positive integer> }`; this is a shape description, not a
real movie ready to import. Technical copy data still has to come from the owner.

The flow is upload → validate/enrich → preview → confirm → result. Preview does
not change the catalog. TMDB response caches and poster assets can be prepared
locally during enrichment; unused assets are not automatically deleted.

Identity resolves through `tmdb_id`, then supplied stable `id` and `slug`. Conflicts
between those identities are rejected rather than guessed from titles. Repeated
identities in the same file are ignored with a reason. Reimporting unchanged
records is ignored; it never creates additional works or relationships.

Each preview lists created, updated, ignored and rejected items, original array
index, publication readiness, missing fields and protected manual fields. Valid
candidates can be imported even when other entries are rejected. Incomplete works
remain private drafts until poster, selected copy, resolution, size and required
work fields are proven. A preview expires after ten minutes and confirmation is
refused if editing changed the database in the meantime.

Manual edits lock changed field paths, including localized text. Import only
updates unlocked fields. Technical copy arrays and external links are protected
when manually edited. Existing work IDs/URLs remain stable when a TMDB ID is
attached later. Null/missing enrichment does not silently erase existing facts.
The editor allows manual correction of imported drafts and published records.

## TMDB adapter

A local Python process resolves the credential through Paulo's maintained
`pvca_tmdb_credentials.py`, honoring its environment-first and protected-store
policy. The token stays in that process's memory and its HTTPS Authorization
header; it never reaches the Node/browser boundary, cache, public data or Git.
The connection check probes `/configuration` and reports only availability and
successful authentication. Credential failures, HTTP authentication failures,
missing movies and network errors have separate safe status codes.

For a movie ID, the adapter requests official `pt-BR` and `en-US` details, credits,
external IDs and images. It does not translate a synopsis when the localized API
value is absent. Empty values remain editable. It does not invent copy resolution,
size, audio, subtitles, a source URL, an entry date or a viewing history.

Poster policy: portrait candidates of usable width; original language first,
then language-neutral, then English. Within that priority, sort by vote count,
vote average, width and stable file path. This is a reproducible candidate rule,
not proof of original theatrical-release artwork. The owner can override it.
The image configuration establishes the official HTTPS CDN; selected JPEG artwork
is stored locally under `public/posters/` at w500 when supported. Redirects are
refused, downloads have a size limit, and the signature is checked. No browser
request or static render needs TMDB. Responses cache by movie ID for repeat import.

The [TMDB details API](https://developer.themoviedb.org/reference/movie-details),
[localized images guide](https://developer.themoviedb.org/docs/image-languages)
and [image configuration guide](https://developer.themoviedb.org/docs/image-basics)
are the implementation references. Before a real TMDB-backed catalog is published,
its About credits must include TMDB's approved logo and the notice required by
[TMDB attribution](https://developer.themoviedb.org/docs/faq). No site publication
is part of this local preparation task.

## Validation

`catalog:test` covers schema, selected-copy mapping, references, local imports and
isolated bilingual static generation. `data:test` covers normalization, 1,000-item
idempotence, identity conflicts, manual translation locks and language preference.
`admin:test` exercises origin/token protections, draft boundaries, bulk preview /
confirmation and stale previews against a temporary server. `tmdb:test` uses mocked
responses to verify both locales, director IDs and poster selection/download.
No tests populate the project's real catalog. The live connection probe validates
configured authentication, not the accuracy of an unprovided movie collection.

## Editorial selections

`data/public/editorial.json` is the authoritative source of selection identity,
localized descriptions, home placement and manual membership (`filmSlugs`).
Manual membership is keyed by stable film slugs, not selection titles. The public
site and admin picker must not union these members with imported `film.selections`
strings. Those strings are a compatibility projection; they cannot reintroduce a
film removed by the editor or change membership after a title translation.

Only the `pt-br` and `4k` selections are automatic. They inspect the explicitly
selected catalog copy. Director, period, national-cinema and thematic selections
remain explicit, editable lists. Importing metadata or discovering another
production country must not enroll a film into a curated selection.

National cinema is an editorial context, not a database join on every production
country. Minority financing, original language, director nationality and country
array order are insufficient individually. International works can belong to more
than one curated context where that choice is intentional. Preserve all production
countries on the film record even when a curated membership is removed.

`validateEditorial(config, catalog)` rejects missing film references, duplicate
members/titles and manual members attached to automatic rules. Builds validate
these references against the active public catalog; the admin validates against
its current editable catalog before saving. Selection pages, counts, preview strips,
home entries and film backlinks all derive from the same resolved selections.

## Verified upload handoff

For Archive/Drive upload synchronization, catalog transactions, batch deployment and site-only recovery, follow [the integration contract](PUBLICATION_INTEGRATION.md). Ordinary intake and panel editing remain local until that explicitly authorized publication workflow is used.
