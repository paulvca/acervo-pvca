# Decisions

## Confirmed

- Astro produces a static, bilingual PT-BR/English public site on GitHub Pages.
- Flexoki Dark, editorial typography and negative space remain the visual direction.
- Public source repository and public site are separate from private collection operations.
- The normalized private database is authoritative. Only validated public projections and approved poster assets are published.
- The admin runs locally; it is not a public route and does not require remote authentication.
- Film slugs and work/copy identities are stable. One selected copy represents each film; real copies and source links remain separate from deduplicated technical presentations.
- Home collection figures are in the introduction, as established by the published implementation and subsequent revisions. The decade chart follows selections; both home statistics obey `showStats`.
- Explicit locale URLs determine language. Manual switching preserves equivalent routes, query strings and fragments.
- The Noah Zender reference informs structure; its content is not reused.
- Pull requests must pass source, artifact and representative browser checks before merging. Deployment is exclusive to main.

## Still open

- Code licensing policy.
- Optional Movie JSON-LD and editorial decisions about additional structured data.

Repository history and previous design documents are dated evidence, not a second implementation contract.

## Home introduction — editorial variant A (2026-10-08)

Selected by the user after a local three-variant comparison. Keep the personal introduction and Flexoki tokens; balance the heading, add a discreet catalogue link, and align the statistics. Use six columns on wide screens, three on tablets, and two on phones, with a smaller fluid mobile heading. Public counts and the showStats gate remain unchanged.

Primary prototype source: local branch `prototype/home-intro-20261008`, commit `5dc6a26`. The prototype switcher and alternative layouts stay outside the implementation branch.

## Mobile decade chart — horizontal bars (2026-10-08)

Selected by the user after a three-variant comparison. At widths up to 760px, use one chronological sequence of horizontal bars with direct decade and count labels, keeping the same maximum across all decades. Preserve the desktop columns, filmsByDecade calculation and showStats gate. No chart library or additional runtime is needed.

Primary prototype source: local branch `prototype/decade-mobile-20261008`, commit `8d474ad`.

## Movie detail layout approved on 2026-10-08

Use one responsive editorial composition: poster left, the work in the central column, archived copies and their access actions in a right-hand card. On mobile, retain the reading order of localized title, original title, metadata, poster, synopsis, editorial facts, archived copies and related selections. Preserve the canonical sans-serif family, weight, letter spacing and line height. Original titles retain diacritics and do not repeat an identical localized title.

Each technical presentation carries its source-specific heading and access links. Equivalent copies remain visually deduplicated without removing any source links. Selection cards reuse the first three posters from the selections index and use the same 4px corner radius as the archive card. Keep the synopsis 32px below the title block; a tall archive card must not stretch the title row.

Primary source: local branch `prototype/movie-detail-20261008`, component `src/components/MovieDetailPrototype.astro`, including the user's copy/access and selection-card adjustments. Production uses `FilmDetail.astro`; prototype controls and routes are excluded. Sharing uses the canonical URL of the current locale, with a manual copy fallback when browser sharing or clipboard access is unavailable.

The approved technical summary shows resolution and size together (for example `1080p · 42,2 GiB`). File/container formats are retained in the data model and local admin but omitted from public film details, matching the existing catalog cards.
