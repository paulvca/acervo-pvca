# GitHub Pages

The public interface is deployed as static Astro output. The private local admin
server, drafts, normalized database, credentials and TMDB cache are not included
in the deployment artifact. The workflow uploads only `dist/`.

## Initial setup

1. Enable GitHub Pages with GitHub Actions as its publishing source.
2. Ensure the account plan supports Pages for the repository's visibility.
   This repository was made public with the owner's explicit approval because
   the account plan rejected Pages for the private repository. Source and Git
   history are therefore public; private operational data remains outside Git.
3. Commit and push the reviewed implementation and `.github/workflows/pages.yml`
   to `main`. The workflow builds, validates routes/assets and deploys the site.
4. Confirm both the successful deployment and the live public URL.

Expected URL: `https://paulvca.github.io/acervo-pvca/`.

## Local checks

Normal local previews retain `/` as their base path. To test the Pages path:

```sh
npx --no-install astro build --site https://paulvca.github.io --base /acervo-pvca
python3 scripts/site_check.py --base /acervo-pvca
```

Navigation, language switching and poster URLs use Astro's deployment base.
Language detection retains the current page under that base path.

## Updating the catalog later

Edit and validate the collection locally through `npm run admin`. Generate and
review the public projection and its local posters. Commit only deliberately
public data/assets and relevant code, then push to `main` to rebuild the site.
Private drafts and `.local-admin/` remain outside Git and outside the deployed site.

No TMDB credential is needed in GitHub Actions: enrichment happens locally before
publication. Missing real catalog data remains a development preview, with honest
placeholders; publishing does not certify its completeness.

References: [Astro deployment guide](https://docs.astro.build/en/guides/deploy/github/)
and [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
