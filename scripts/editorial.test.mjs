import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { translateAdmin } from "./i18n/admin.mjs";
import { manualSelectionFilms, validateEditorial } from "./lib/editorial.mjs";
const load = (p) =>
  JSON.parse(readFileSync(new URL("../" + p, import.meta.url)));
const editorial = load("data/public/editorial.json"),
  catalog = load("data/public/catalog.json");
const config = () => ({
  featuredSlug: null,
  featuredNote: null,
  recentLimit: 4,
  previewRecentSlugs: [],
  homeSelectionIds: ["french"],
  showStats: true,
  selections: [
    {
      id: "french",
      title: "Cinema francês",
      description: "Editorial selection",
      rule: "manual",
      filmSlugs: ["selected"],
    },
  ],
});
test("removed title-based memberships stay removed after renaming or reimporting", () => {
  const selected = { slug: "selected" },
    removed = {
      slug: "removed",
      selections: ["Cinema francês", "French cinema"],
    };
  const s = config().selections[0];
  assert.deepEqual(manualSelectionFilms(s, [selected, removed]), [selected]);
  s.title = "French cinema";
  assert.deepEqual(manualSelectionFilms(s, [selected, removed]), [selected]);
});
test("rejects dangling references, duplicate members and manual overrides on automatic rules", () => {
  assert.deepEqual(validateEditorial(config(), [{ slug: "selected" }]), []);
  const missing = config();
  missing.selections[0].filmSlugs = ["missing"];
  assert.ok(validateEditorial(missing, [{ slug: "selected" }]).length);
  const duplicate = config();
  duplicate.selections[0].filmSlugs.push("selected");
  assert.ok(validateEditorial(duplicate).length);
  const automatic = config();
  automatic.selections[0].rule = "4k";
  assert.ok(validateEditorial(automatic).length);
  const title = config();
  title.selections.push({ ...title.selections[0], id: "another" });
  assert.ok(validateEditorial(title).length);
});
test("reviewed national selections do not classify films by minority financing", () => {
  const french = editorial.selections.find((s) => s.id === "cinema-frances");
  const actual = manualSelectionFilms(french, catalog);
  assert.ok(actual.some((f) => f.slug === "napoleon-1927"));
  assert.ok(actual.some((f) => f.slug === "the-400-blows-1959"));
  for (const slug of [
    "ran-1985",
    "mulholland-drive-2001",
    "la-notte-1961",
    "millennium-mambo-2001",
    "the-spousals-of-god-1999",
  ])
    assert.ok(!actual.some((f) => f.slug === slug), slug);
  assert.ok(
    !editorial.selections
      .find((s) => s.id === "cinema-japones")
      .filmSlugs.includes("affliction-1998")
  );
  assert.ok(
    !editorial.selections
      .find((s) => s.id === "cinema-italiano")
      .filmSlugs.includes("pierrot-le-fou-1965")
  );
  assert.ok(
    !editorial.selections
      .find((s) => s.id === "japao-depois-da-guerra")
      .filmSlugs.includes("onibaba-1964")
  );
});
test("all 26 reviewed selections have valid references and consistent public mirrors", () => {
  assert.deepEqual(validateEditorial(editorial, catalog), []);
  assert.equal(editorial.selections.length, 26);
  for (const selection of editorial.selections.filter(
    (s) => s.rule === "manual"
  )) {
    const members = manualSelectionFilms(selection, catalog)
      .map((f) => f.slug)
      .sort();
    const mirror = catalog
      .filter((f) => f.selections.includes(selection.title))
      .map((f) => f.slug)
      .sort();
    assert.deepEqual(mirror, members, selection.id);
  }
  const directorSelections = editorial.selections.filter((s) =>
    catalog.some((f) => f.directors.includes(s.title))
  );
  for (const selection of directorSelections) {
    const directed = catalog
      .filter((f) => f.directors.includes(selection.title))
      .map((f) => f.slug)
      .sort();
    assert.deepEqual([...selection.filmSlugs].sort(), directed, selection.id);
  }
  const decade = editorial.selections.find((s) => s.id === "anos-1950");
  assert.deepEqual(
    [...decade.filmSlugs].sort(),
    catalog
      .filter((f) => f.year >= 1950 && f.year < 1960)
      .map((f) => f.slug)
      .sort()
  );
});

test("selection validation errors are available in English in the admin", () => {
  assert.equal(
    translateAdmin("en", "Seleção french: filme inexistente."),
    "Selection french: Film not found."
  );
  assert.equal(
    translateAdmin("en", "Título de seleção repetido."),
    "Duplicate selection title."
  );
});
