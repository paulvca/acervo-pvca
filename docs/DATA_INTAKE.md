# Local catalog intake

This workflow receives deliberately public film records. It does not upload media,
read private inventories automatically, push commits, or deploy the site.
Accept the user's existing spreadsheet format and map its columns when provided;
do not require a replacement spreadsheet or infer missing factual metadata.

## Sources and contracts

- `data/public/catalog.json`: sole final public runtime source, initially `[]`.
- `data/schema/public-catalog.schema.json`: public field allowlist, using snake_case.
- `data/templates/film.blank.json`: blank input scaffold, intentionally invalid until
  required information is supplied. Never import this as a film.
- `src/data/catalog.ts`: validates and maps the public projection for all pages.
- `src/data/catalog-preview.ts`: development fallback only when the real catalog
  is empty. Real records replace this preview; they are never mixed with it.
- `data/public/catalog.sample.json`: historical schema example, never imported
  automatically or treated as verified film data.
- `public/posters/`: approved local poster assets; no automatic external fetching.

Keep raw spreadsheets, operational inventories and private staging files outside
`public/`, `data/public/` and Git. Produce an allowlisted JSON array for intake.
See [CAMPOS_DO_ACERVO.md](CAMPOS_DO_ACERVO.md) for the visitor-facing field guide.

## Preparation

1. Map source columns to film, copy and external-link fields. Preserve multiple
   directors, countries, copies, audio languages and subtitle languages.
2. Confirm film identity and stable `id`/`slug`. A new copy or link belongs to the
   existing film record, not a duplicate work.
3. Confirm sizes and original units. Convert proven byte sizes to GiB by dividing
   by `1073741824`; never relabel decimal GB as GiB. JSON numbers use a decimal
   point. The UI alone rounds to one decimal with a Portuguese decimal comma.
4. Choose `catalog_copy_id` explicitly, referencing an existing copy `id`. Every
   exported copy requires resolution and a positive `size_gib`. Keep incomplete
   candidates in staging rather than fabricating publishable data.
5. Place approved posters under `public/posters/`, using local paths such as
   `/posters/<slug>.webp`. Nested paths are supported. Supported extensions are
   jpg, jpeg, png, webp and avif; filenames use ASCII letters, digits, `_` and `-`.
6. Review optional text, language names and editorial selection titles. Use
   `Português (Brasil)` for confirmed Brazilian Portuguese subtitles and `2160p`
   for confirmed 4K copies to match the existing filters. Empty arrays represent
   unreported information, not verified absence. Original language is separate
   from copy audio; do not derive one from the other.
7. Include only deliberately shared HTTPS destination URLs. An optional `copy_id`
   must reference an existing copy. No link means no destination button.

Unknown optional scalar values may be omitted or `null` where allowed by the
schema. Array fields use arrays. Pôster, title, year, director, copy selection,
resolution and size cannot be missing in the final projection.

## Check and apply

Run from the project root. Check a prepared input without changing the catalog:

```sh
npm run catalog:check -- /absolute/path/prepared-public-films.json
```

Import new films only after reviewing that public input:

```sh
npm run catalog:import -- /absolute/path/prepared-public-films.json
```

The importer validates both the input and the merged catalog before writing.
Duplicate works are rejected by default; unrelated existing films are preserved.
For a reviewed update, supply the **complete** existing film record, retaining
all copies, links and metadata that should remain, then use:

```sh
npm run catalog:import -- /absolute/path/prepared-public-films.json --replace
```

`--replace` replaces that whole film record, not individual fields. The `id` and
`slug` must both match the existing work. Inspect the Git diff after import;
do not silently omit previous variants or URLs. An invalid import leaves the
existing catalog untouched. Successful writes use a temporary file and rename.

```sh
npm run catalog:check
npm run catalog:test
npm run build
git diff --check
```

Review the generated catalog and every new/updated film page in desktop/mobile.
Grade, Lista, filters, statistics and selections use the same runtime source.
Create editorial selection definitions in the local panel for supplied selection
names. pt-BR and 4K membership derive from the representative copy. Home settings
live in `data/public/editorial.json`. Recent films use confirmed `added_at` dates;
unknown dates are excluded rather than replaced with inferred viewing dates.
See [LOCAL_ADMIN.md](LOCAL_ADMIN.md).

## Validation boundary

The dependency-free validator implements the schema keywords currently used in
this repository, plus film/copy uniqueness, copy references, poster presence and
path confinement, HTTPS, provider host matching and common secret URL parameters.
The build uses the same validation and stops on invalid final data. It is not a
general-purpose implementation of every JSON Schema keyword.

These checks do not prove metadata accuracy, image provenance, a remote link's
accessibility, sharing consent, or the absence of private content inside free
text. Confirm those against the user's supplied evidence. Review selection
titles editorially; do not reintroduce selections based on provider availability.

Tests use synthetic records/assets only in temporary directories, including an
isolated Astro build. They never populate the project's real public catalog.
