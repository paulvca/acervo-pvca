import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  emptyDatabase,
  planImport,
  saveManual,
  allRecords,
  publicRecords,
  exportFilm,
} from "./lib/database.mjs";
import { preferredLanguage, languagePath } from "./i18n/public.mjs";
const root = new URL("../", import.meta.url);
const schema = JSON.parse(
  readFileSync(new URL("data/schema/public-catalog.schema.json", root))
);
const temp = mkdtempSync(join(tmpdir(), "pvca-model-test-"));
mkdirSync(join(temp, "posters"));
writeFileSync(join(temp, "posters/fixture.png"), "synthetic test file");
const fixture = (id = 1) => ({
  id: `fixture-${id}`,
  slug: `fixture-${id}`,
  tmdb_id: id,
  title: "Synthetic test film",
  year: 2000,
  directors: ["Test Director"],
  countries: ["Country"],
  genres: ["Drama"],
  original_languages: ["en"],
  poster: "/posters/fixture.png",
  catalog_copy_id: "one",
  copies: [
    {
      id: "one",
      resolution: "1080p",
      size_gib: 12,
      audio_languages: ["en"],
      subtitle_languages: ["Português (Brasil)"],
    },
  ],
  external_links: [],
  selections: [],
  translations: {
    "pt-BR": { title: "Título teste", synopsis: "Sinopse teste" },
    en: { title: "Test title", synopsis: "Test synopsis" },
  },
});
test("bulk imports reuse entities and are idempotent at 1000 records", () => {
  const input = Array.from({ length: 1000 }, (_, i) => fixture(i + 1));
  const first = planImport(emptyDatabase(), input, schema, temp);
  assert.equal(first.summary.created, 1000);
  assert.equal(Object.keys(first.database.entities.directors).length, 1);
  assert.equal(Object.keys(first.database.entities.countries).length, 1);
  assert.equal(publicRecords(first.database).length, 1000);
  const again = planImport(first.database, input, schema, temp);
  assert.equal(again.summary.ignored, 1000);
  assert.equal(again.summary.created, 0);
  assert.deepEqual(
    publicRecords(again.database),
    publicRecords(first.database)
  );
});
test("manual field and translation locks survive enrichment and reimports", () => {
  const first = planImport(emptyDatabase(), [fixture()], schema, temp).database;
  const record = allRecords(first)[0];
  record.translations.en.synopsis = "Manual editorial change";
  record.directors = ["Manually corrected director"];
  const manual = saveManual(first, record, true);
  const incoming = fixture();
  incoming.year = 2001;
  incoming.translations.en.synopsis = "New source synopsis";
  const updated = planImport(manual, [incoming], schema, temp);
  assert.equal(updated.summary.updated, 1);
  const result = allRecords(updated.database)[0];
  assert.equal(result.translations.en.synopsis, "Manual editorial change");
  assert.deepEqual(result.directors, ["Manually corrected director"]);
  assert.equal(result.year, 2001);
  assert.ok(updated.items[0].protected.includes("translations.en.synopsis"));
});
test("partial imports report invalid records and retain incomplete works as private drafts", () => {
  const plan = planImport(
    emptyDatabase(),
    [
      { tmdb_id: 55 },
      { ...fixture(), local_path: "PRIVATE" },
      fixture(),
      fixture(),
    ],
    schema,
    temp
  );
  assert.equal(plan.summary.created, 2);
  assert.equal(plan.summary.rejected, 1);
  assert.equal(plan.summary.ignored, 1);
  assert.equal(publicRecords(plan.database).length, 1);
  assert.equal(allRecords(plan.database).length, 2);
  assert.ok(!JSON.stringify(plan.items).includes("PRIVATE"));
});
test("identifier collisions are rejected rather than merging different works", () => {
  const db = planImport(
    emptyDatabase(),
    [fixture(1), fixture(2)],
    schema,
    temp
  ).database;
  const conflict = { ...fixture(1), slug: "fixture-2" };
  const plan = planImport(db, [conflict], schema, temp);
  assert.equal(plan.summary.rejected, 1);
  assert.equal(allRecords(plan.database).length, 2);
});
test("normalization keeps relationships and provenance outside the public record", () => {
  const film = fixture();
  film.entity_refs = { directors: [{ id: "tmdb-123" }] };
  const db = planImport(emptyDatabase(), [film], schema, temp).database;
  const row = Object.values(db.films)[0];
  assert.ok(!("directors" in row.fields));
  assert.ok(!("audio_languages" in row.fields.copies[0]));
  assert.deepEqual(exportFilm(db, row).directors, ["Test Director"]);
  assert.ok(!JSON.stringify(publicRecords(db)).includes("locks"));
  assert.ok(db.entities.directors["directors:tmdb-123"]);
});
test("language preference uses the primary browser language and manual choice wins", () => {
  assert.equal(preferredLanguage(null, ["pt-PT"]), "pt-BR");
  assert.equal(preferredLanguage(null, ["en-US", "pt-BR"]), "en");
  assert.equal(preferredLanguage("en", ["pt-BR"], "BR"), "en");
  assert.equal(preferredLanguage(null, ["en-BR"], "BR"), "pt-BR");
  assert.equal(languagePath("en", "/filmes/fixture/"), "/en/filmes/fixture/");
  assert.equal(
    languagePath("pt-BR", "/en/filmes/fixture/"),
    "/filmes/fixture/"
  );
});
test.after(() => rmSync(temp, { recursive: true, force: true }));
