import assert from "node:assert/strict";
import { test } from "node:test";
import { filmsByDecade, distinctCopyDetails } from "../src/lib/catalog.ts";

test("decades recalculate when films are added, counting works rather than copies", () => {
  const films = [
    { year: 1953, copies: [{ id: "a" }, { id: "b" }] },
    { year: 1959 },
  ];
  assert.deepEqual(filmsByDecade(films), [{ decade: 1950, count: 2 }]);
  assert.deepEqual(filmsByDecade([...films, { year: 1960 }]), [
    { decade: 1950, count: 2 },
    { decade: 1960, count: 1 },
  ]);
});
test("empty decades preserve the chronological scale and unknown years are excluded", () => {
  assert.deepEqual(
    filmsByDecade([{ year: 1910 }, { year: 1931 }, { year: undefined }]),
    [
      { decade: 1910, count: 1 },
      { decade: 1920, count: 0 },
      { decade: 1930, count: 1 },
    ]
  );
  assert.deepEqual(filmsByDecade([]), []);
});
test("identical displayed copy details appear once without changing source records or links", () => {
  const copy = {
    resolution: "1080p",
    sizeGiB: 23.896,
    format: "MKV",
    audio: ["en"],
    subtitles: ["pt-BR"],
  };
  const film = {
    catalogCopyId: "archive",
    copies: [
      { ...copy, id: "drive" },
      { ...copy, id: "archive", sizeGiB: 23.897 },
    ],
    externalLinks: [{ copyId: "drive" }, { copyId: "archive" }],
  };
  assert.deepEqual(
    distinctCopyDetails(film).map((copy) => copy.id),
    ["archive"]
  );
  assert.equal(film.copies.length, 2);
  assert.equal(film.externalLinks.length, 2);
});
test("different sizes, editions and subtitles stay separate", () => {
  const copy = {
    id: "a",
    resolution: "1080p",
    sizeGiB: 15,
    audio: ["en"],
    subtitles: ["en"],
  };
  const film = {
    copies: [
      copy,
      { ...copy, id: "b", sizeGiB: 16 },
      { ...copy, id: "c", edition: "Restoration" },
      { ...copy, id: "d", subtitles: ["pt-BR"] },
    ],
  };
  assert.equal(distinctCopyDetails(film).length, 4);
});
