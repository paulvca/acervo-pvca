import test from "node:test";
import assert from "node:assert/strict";
import { convertCanonical, mergeEnrichment } from "./lib/canonical.mjs";
const copy = (bytes, resolution, tag) => ({
  status: "AVAILABLE",
  size: { bytes },
  resolution: { declared_class: resolution, label: "1920×1080" },
  container: { value: "Matroska" },
  technical: { audio_streams: [{ tags: { language: tag } }] },
  embedded_subtitles: { tracks: [{ language: { tag: "por" } }] },
  hashes: { md5: "PRIVATE_HASH" },
  file_id: "PRIVATE_DRIVE_ID",
  file_name: "PRIVATE_FILE",
});
const fixture = () => ({
  schema_version: "pvca-clean-catalog-6.1",
  item_count: 1,
  items: [
    {
      pvca_id: "PVCA-000001",
      title: "Synthetic film",
      year: 2000,
      identity: { tmdb: { id: 7 }, imdb: "tt123" },
      availability: { preferred_media_source: "DRIVE" },
      media: { source: "DRIVE" },
      metadata: {
        original_title: "Synthetic film",
        credits: { directors: ["Director"] },
        languages_and_countries: {
          original_language: "en",
          production_countries: ["Country"],
        },
        production: { genres: ["Drama"] },
        synopsis: {
          texts: { "pt-BR": "Texto fornecido", "en-US": "Supplied text" },
        },
      },
      copies: {
        local: { status: "ABSENT" },
        drive: {
          ...copy(1073741824, "1080p", "jpn"),
          url: "https://drive.google.com/file/d/PRIVATE_DRIVE_ID/view",
        },
        archive: {
          ...copy(2147483648, "2160p", "eng"),
          url: "https://archive.org/details/synthetic",
        },
      },
    },
  ],
});
test("projects only public fields, keeps variants separate and uses the explicit selected source", () => {
  const result = convertCanonical(fixture(), { portugueseIsBrazilian: true });
  const record = result.records[0];
  assert.equal(result.failures.length, 0);
  assert.equal(record.copies.length, 2);
  const chosen = record.copies.find((c) => c.id === record.catalog_copy_id);
  assert.equal(chosen.size_gib, 1);
  assert.equal(chosen.resolution, "1080p");
  assert.deepEqual(chosen.audio_languages, ["ja"]);
  assert.deepEqual(chosen.subtitle_languages, ["pt-BR"]);
  assert.equal(record.external_links[0].copy_id, "pvca-000001-archive");
  assert.equal(record.external_links.length, 1);
  assert.ok(!JSON.stringify(result).includes("PRIVATE"));
  assert.equal(record.poster, null);
  assert.ok(!("added_at" in record));
});
test("unconfirmed Portuguese stays generic, unknown audio is not the original language and exact raster remains honest", () => {
  const source = fixture();
  delete source.items[0].copies.drive.technical;
  delete source.items[0].copies.drive.resolution.declared_class;
  source.items[0].copies.drive.resolution.label = "720×544";
  const record = convertCanonical(source).records[0],
    selected = record.copies[0];
  assert.deepEqual(selected.subtitle_languages, ["pt"]);
  assert.deepEqual(selected.audio_languages, []);
  assert.equal(selected.resolution, "720×544");
});
test("rejects incomplete identities, duplicate works, inconsistent selection and count mismatch safely", () => {
  const source = fixture();
  source.items[0].availability.preferred_media_source = "LOCAL";
  assert.equal(convertCanonical(source).failures.length, 1);
  assert.throws(() => convertCanonical({ ...fixture(), item_count: 2 }));
  const repeated = fixture();
  repeated.items.push(repeated.items[0]);
  repeated.item_count = 2;
  assert.equal(convertCanonical(repeated).failures.length, 1);
  const incomplete = fixture();
  delete incomplete.items[0].copies.drive.size.bytes;
  assert.equal(convertCanonical(incomplete).records.length, 0);
});
test("fills official localized gaps without replacing copy facts or supplied synopses", () => {
  const record = convertCanonical(fixture(), { portugueseIsBrazilian: true })
    .records[0];
  record.translations["pt-BR"].synopsis = null;
  record.synopsis = null;
  const enriched = {
    tmdb_id: 7,
    title: "Localized title",
    synopsis: "Sinopse oficial",
    translations: {
      "pt-BR": { title: "Título localizado", synopsis: "Sinopse oficial" },
      en: { title: "English title", synopsis: "Updated text" },
    },
    copies: [{ id: "wrong" }],
    poster: "/posters/official.jpg",
    countries: ["Different country"],
    entity_refs: { countries: [{ id: "XX" }] },
  };
  const merged = mergeEnrichment(record, enriched);
  assert.equal(merged.translations["pt-BR"].synopsis, "Sinopse oficial");
  assert.equal(merged.translations.en.synopsis, "Supplied text");
  assert.deepEqual(merged.copies, record.copies);
  assert.equal(merged.title, record.title);
  assert.deepEqual(merged.entity_refs, {});
  assert.deepEqual(merged.selections, []);
});

test("normalizes shared genre and country identities while retaining source names", () => {
  const merged = mergeEnrichment(
    {
      countries: ["United States of America"],
      genres: ["Western"],
      selections: [],
      external_links: [],
    },
    {
      countries: ["Estados Unidos"],
      genres: ["Faroeste"],
      entity_refs: { countries: [{ id: "US" }], genres: [{ id: "tmdb-37" }] },
      localized_metadata: {
        en: { countries: ["United States"], genres: ["Western"] },
        "pt-BR": { countries: ["Estados Unidos"], genres: ["Faroeste"] },
      },
    }
  );
  assert.equal(merged.entity_refs.countries[0].id, "US");
  assert.equal(merged.entity_refs.genres[0].id, "tmdb-37");
  assert.deepEqual(merged.localized_metadata["pt-BR"].genres, ["Faroeste"]);
});
