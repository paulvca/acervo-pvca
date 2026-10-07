# Application

The site uses Astro 7.3.5, TypeScript and custom Flexoki Dark CSS with static
output. Run `npm run dev` for development, `npm run build` to generate the site,
and `npm run preview` to inspect the generated output locally.

`data/catalog-preview.ts` is the single source for the development film preview.
Home references those records by slug. Selection membership and statistics are
derived from the same preview. `lib/catalog.ts` resolves the explicitly selected
copy, formats GiB values and checks its Portuguese subtitles. `Poster.astro`
handles verified poster paths and honest missing-image placeholders everywhere.

The preview contains incomplete records. It is not a verified final projection.
See `../docs/DATA_MODEL.md` and the public export schema for the final contract.
