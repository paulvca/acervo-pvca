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
