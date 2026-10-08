import test from "node:test";
import assert from "node:assert/strict";
import { convertObserved } from "./lib/observed.mjs";
function fixture() {
  return [
    {
      schema_version: "pvca-clean-catalog-6.2-subset",
      item_count: 1,
      items: [
        {
          pvca_id: "PVCA-000426",
          title: "Fixture",
          year: 1971,
          identity: { tmdb: { id: 42 } },
          availability: { preferred_media_source: "DRIVE" },
          metadata: { credits: { directors: ["Director"] } },
          copies: {
            drive: {
              url: "https://drive.google.com/drive/folders/FIXTURE",
              resolution: { declared_class: "1080p" },
            },
          },
        },
      ],
    },
    {
      schema_version: "pvca-remote-technical-observation-1",
      observations: [
        {
          pvca_id: "PVCA-000426",
          title: "Fixture",
          year: 1971,
          observed_copy: {
            source: "DRIVE",
            source_url: "https://drive.google.com/drive/folders/FIXTURE",
            size_bytes: 1073741824,
            file_name: "PRIVATE",
            hashes: { md5: "PRIVATE" },
            drive_file_id: "PRIVATE",
            ffprobe: {
              format: { format_name: "matroska,webm" },
              streams: [
                { codec_type: "video", width: 1920, height: 1080 },
                { codec_type: "audio", tags: { language: "eng" } },
                {
                  codec_type: "subtitle",
                  tags: { language: "por", title: "Portuguese (Brazil)" },
                },
                {
                  codec_type: "subtitle",
                  tags: { language: "por", title: "Portuguese (Portugal)" },
                },
                { codec_type: "subtitle", tags: { language: "por" } },
              ],
            },
          },
        },
      ],
    },
  ];
}
test("joins by identity, projects observed facts and separates Portuguese locales without leaking private fields", () => {
  const result = convertObserved(...fixture(), { shareDrive: true });
  assert.equal(result.failures.length, 0);
  const r = result.records[0];
  assert.equal(r.copies[0].size_gib, 1);
  assert.equal(r.copies[0].format, "MKV");
  assert.deepEqual(r.copies[0].subtitle_languages, ["pt-BR", "pt-PT", "pt"]);
  assert.deepEqual(r.copies[0].audio_languages, ["en"]);
  assert.equal(r.external_links[0].provider, "google_drive");
  assert.ok(!JSON.stringify(r).includes("PRIVATE"));
});
test("refuses copy mismatch, duplicate observations and missing evidence", () => {
  let [s, a] = fixture();
  a.observations[0].observed_copy.source = "ARCHIVE";
  assert.throws(() => convertObserved(s, a));
  [s, a] = fixture();
  a.observations.push(a.observations[0]);
  assert.throws(() => convertObserved(s, a));
  [s, a] = fixture();
  delete a.observations[0].observed_copy.size_bytes;
  assert.throws(() => convertObserved(s, a));
});

test("Drive sharing requires an explicit option", () =>
  assert.deepEqual(
    convertObserved(...fixture()).records[0].external_links,
    []
  ));
