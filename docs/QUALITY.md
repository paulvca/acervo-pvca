# Quality and maintenance

## Three synchronous defenses

1. Source: `npm ci`, `npm run format:check`, `npm run lint`, `npm run check`, `npm test`, `npm run catalog:check`.
2. Artifact: build with the Pages origin/base, then `python3 scripts/site_check.py --site https://paulvca.github.io --base /acervo-pvca`.
3. Browser: `npx --no-install playwright install chromium`, then `npm run e2e` against that artifact. CI installs Chromium's system dependencies on the hosted runner; workstation tests may select an installed Chromium-family browser with `PVCA_BROWSER_PATH`.

Node 22.22.3 or newer is required by the current Astro ESLint plugin. ESLint checks code semantics, duplicate keys, unreachable/undefined code and unused bindings; Prettier owns formatting. Evidence prototypes/references and generated artifacts are outside source lint scope. No errors/warnings are waived as a baseline.

English UI coverage scans literal `t()` calls, including conditional labels, across Astro frontmatter/templates/scripts and TypeScript. Dynamic cinema metadata, proper titles, localized editorial data and technical values are excluded by their expression shape, not by a blanket exemption. The explicit allowlist contains only the shared project name with its rationale. Tests exercise absent dictionary keys and conditional/dynamic expressions.

Playwright covers seven representative pages in each locale, a real Pages 404 fallback and dynamic navigation/catalog/mobile behavior. Artifact validation remains responsible for all films/routes/assets. Axe uses WCAG 2.0/2.1 A/AA and WCAG 2.2 AA tags and fails on automated violations. Passing these tests does not establish full WCAG compliance; assistive-technology, editorial alternatives and contextual usability still need human review.

The same workflow validates `pull_request` to main, main pushes and manual main runs. Pages configuration/upload/deploy are skipped for PRs. Fork PRs run with read-only permissions, without secrets or previews. Browser reports/traces are uploaded as GitHub artifacts on success or failure. Main deploy depends on the quality job.

## Local commits

Husky runs staged-only Prettier through lint-staged, followed by `npm run check` (the existing Astro/TypeScript check) and `npm test`. The hook is executable and `npm ci` installs it through the existing prepare script. Failed formatting, type checks or regressions stop the commit; browser and artifact checks remain in CI.

## Async maintenance

- Dependabot opens weekly npm and GitHub Actions update PRs. No auto-merge is configured; majors follow the same CI as other PRs.
- Dependency Review examines introduced dependency changes, blocking new known high/critical vulnerabilities. It does not turn old advisories into an undifferentiated baseline failure. No PR comment writes are enabled.
- CodeQL uses GitHub default setup and default queries; no advanced workflow is added. Repository settings and scan results must be verified separately from files on disk.
- Public source link health runs weekly on Monday at 09:23 UTC, separately from deployment. It uses Node's maintained native Fetch API, avoiding another crawler dependency. It makes GET requests, cancels bodies, uses 10-second timeouts, up to two retries and four workers. JSON and Markdown reports are uploaded as artifacts.

Link outcomes distinguish `http-reachable`, `broken-http`, `timeout`, `rate-limit`, `host-excluded` and `inconclusive`. Drive 404s/auth pages are inconclusive because automation cannot distinguish missing sharing rights from removed resources. Other 404/410 responses receive bounded retries before reporting. A successful HTTP response is not proof that a film can be played/downloaded. Review broken-HTTP candidates manually; retry transient/inconclusive candidates before editing catalog links. No catalog mutations are performed by maintenance.

Lighthouse and Lighthouse CI are excluded at the owner's request. No score reporting/gates, SaaS monitoring, analytics or service workers are included.

## Proposed main protection

`docs/main-ruleset.proposed.json` is a reviewable proposal, not an applied ruleset. It blocks force pushes and deletion, requires a PR with zero mandatory human approvals, and requires `quality` and `dependency-review` checks against an up-to-date branch. No merge queue or multi-reviewer policy is imposed.

Wait for a successful remote PR run and verify actual check names before enabling the proposal. Administrative application needs the owner's explicit approval. Do not enable required check names that have never run, which could block the owner's normal workflow.

## Browser metadata and assets

Pages uses root `404.html`; its short English explanation keeps unknown EN paths usable without automatic redirection. The language switch opens the explicit English error page. Error pages are noindex and absent from sitemap.

Favicon and theme-color use existing Flexoki values. The current locale has `aria-current="page"` and a subtle underline. Institutional pages have distinct, translated descriptions. Preserved poster sources/revisions live in `assets/poster-sources/`; only approved publication assets stay in `public/`.
