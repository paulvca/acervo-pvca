"""Small negative fixtures protect the generated-HTML validator itself."""
import unittest
from site_check import Page, metadata_errors


class SiteTests(unittest.TestCase):
    def parse(self, html):
        page = Page()
        page.feed(html)
        return page

    def test_metadata_requires_absolute_self_canonical_and_counterparts(self):
        base = '/acervo-pvca'
        site = 'https://example.org'
        route = '/en/filmes/'
        pages = {route: None, '/filmes/': None}
        html = '<link rel="canonical" href="https://example.org/acervo-pvca/en/filmes/"><link rel="alternate" hreflang="pt-BR" href="https://example.org/acervo-pvca/filmes/"><link rel="alternate" hreflang="en" href="https://example.org/acervo-pvca/en/filmes/">'
        self.assertEqual(metadata_errors(self.parse(html), route, pages, site, base), [])
        for broken in [html.replace('https://example.org', ''), html.replace('rel="canonical"', 'rel="other"'), html.replace('canonical" href="https://example.org/acervo-pvca/en/', 'canonical" href="https://example.org/acervo-pvca/')]:
            self.assertTrue(metadata_errors(self.parse(broken), route, pages, site, base))
        self.assertTrue(metadata_errors(self.parse(html), route, {route: None}, site, base))

    def test_generic_names_rejected_but_named_roles_allowed(self):
        for tag in ('div', 'span'):
            for attribute in ('aria-label', 'aria-labelledby'):
                self.assertTrue(self.parse(f'<{tag} {attribute}="Filters"></{tag}>').semantic_errors)
                self.assertEqual(self.parse(f'<{tag} role="group" {attribute}="Filters"></{tag}>').semantic_errors, [])
        self.assertTrue(self.parse('<div role="presentation" aria-label="Filters"></div>').semantic_errors)

    def test_layout_sections_and_redundant_poster_names_rejected(self):
        self.assertTrue(self.parse('<section><p>Layout</p></section>').semantic_errors)
        self.assertEqual(self.parse('<section><h2>Title</h2></section>').semantic_errors, [])
        self.assertTrue(self.parse('<a><img class="poster" alt="Poster for Film"><h2>Film</h2></a>').semantic_errors)
        self.assertEqual(self.parse('<a><img class="poster" alt=""><h2>Film</h2></a>').semantic_errors, [])
        self.assertEqual(self.parse('<a><img class="poster" alt="Poster for Film"></a>').semantic_errors, [])

    def test_error_pages_have_explicit_equivalents_and_are_noindex(self):
        html = '<meta name="robots" content="noindex"><link rel="canonical" href="https://example.org/acervo-pvca/404.html"><link rel="alternate" hreflang="pt-BR" href="https://example.org/acervo-pvca/404.html"><link rel="alternate" hreflang="en" href="https://example.org/acervo-pvca/en/404/">'
        page = self.parse(html)
        self.assertTrue(page.noindex)
        self.assertEqual(metadata_errors(page, '/404.html', {'/404.html': None, '/en/404/': None}, 'https://example.org', '/acervo-pvca'), [])
