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

test("multiple technical copy headings are symmetric, translated and unambiguous", async () => {
  const { copyDetailHeading } = await import("../src/lib/catalog.ts");
  const { translate } = await import("./i18n/public.mjs");
  const copy = { id: "a" };
  assert.equal(
    copyDetailHeading(copy, 0, 2, (text) => text),
    "Cópia do catálogo"
  );
  assert.equal(
    copyDetailHeading(copy, 1, 2, (text) => translate("en", text)),
    "Another copy"
  );
  assert.equal(
    copyDetailHeading(copy, 0, 3, (text) => translate("en", text)),
    "Catalog copy"
  );
  assert.equal(
    copyDetailHeading(copy, 1, 3, (text) => text),
    "Outra cópia 2"
  );
  assert.equal(
    copyDetailHeading(copy, 2, 3, (text) => text),
    "Outra cópia 3"
  );
  assert.equal(
    copyDetailHeading({ ...copy, label: "Restoration" }, 0, 2, (text) => text),
    "Restoration"
  );
  assert.equal(
    copyDetailHeading(
      { ...copy, edition: "Director’s cut" },
      1,
      2,
      (text) => text
    ),
    "Director’s cut"
  );
});

test("invalid year types never create decades or inflate the work count", () => {
  assert.deepEqual(
    filmsByDecade([
      { year: 1953 },
      { year: NaN },
      { year: Infinity },
      { year: 1953.5 },
      { year: "1953" },
      {},
    ]),
    [{ decade: 1950, count: 1 }]
  );
});

test("copy access follows IDs, preserving selected order and links of equivalent copies", async () => {
  const { copyAccessGroups, copyAccessHeading } =
    await import("../src/lib/catalog.ts");
  const film = {
    catalogCopyId: "drive",
    copies: [
      { id: "archive", resolution: "1080p", subtitles: ["pt-BR"] },
      { id: "drive", resolution: "1080p", subtitles: ["en"] },
      { id: "mirror", resolution: "1080p", subtitles: ["en"] },
    ],
    externalLinks: [
      {
        copyId: "archive",
        provider: "Internet Archive",
        url: "https://archive.org/details/example",
      },
      {
        copyId: "drive",
        provider: "Google Drive",
        url: "https://drive.google.com/drive/folders/example",
      },
      {
        copyId: "mirror",
        provider: "Google Drive",
        url: "https://drive.google.com/drive/folders/mirror",
      },
      { provider: "Outro", url: "https://example.org/" },
    ],
  };
  const before = structuredClone(film);
  const { groups, remainingLinks } = copyAccessGroups(film);
  assert.deepEqual(
    groups.map((group) => group.copy.id),
    ["drive", "archive"]
  );
  assert.deepEqual(
    groups[0].links.map((link) => link.copyId),
    ["drive", "mirror"]
  );
  assert.deepEqual(
    groups[1].links.map((link) => link.copyId),
    ["archive"]
  );
  assert.equal(
    copyAccessHeading(groups, 0, (text) => text),
    "Cópia do Drive"
  );
  assert.equal(
    copyAccessHeading(groups, 1, (text) => text),
    "Cópia do Archive"
  );
  assert.deepEqual(remainingLinks, [film.externalLinks[3]]);
  assert.deepEqual(film, before);
});

test("equivalent cross-provider copies share details and retain both access actions", async () => {
  const { copyAccessGroups, copyAccessHeading } =
    await import("../src/lib/catalog.ts");
  const film = {
    catalogCopyId: "archive",
    copies: [
      { id: "archive", resolution: "1080p" },
      { id: "drive", resolution: "1080p" },
    ],
    externalLinks: [
      {
        copyId: "drive",
        provider: "Google Drive",
        url: "https://drive.google.com/drive/folders/example",
      },
      {
        copyId: "archive",
        provider: "Internet Archive",
        url: "https://archive.org/details/example",
      },
    ],
  };
  const { groups, remainingLinks } = copyAccessGroups(film);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].copy.id, "archive");
  assert.equal(groups[0].links.length, 2);
  assert.deepEqual(remainingLinks, []);
  assert.equal(
    copyAccessHeading(groups, 0, (text) => text),
    "Cópias do Archive e do Drive"
  );
});

test("a title with no readable translation falls back to the main title", async () => {
  const { localizeFilm } = await import("../src/lib/i18n.ts");
  const film = {
    slug: "new-year-trip-1968",
    title: "New Year Trip",
    originalTitle: "喜劇　初詣列車",
    director: "Masaharu Segawa",
    year: 1968,
    translations: {
      "pt-BR": { title: "喜劇　初詣列車" },
      en: { title: "New Year Trip" },
    },
  };
  assert.equal(localizeFilm(film, "pt-BR").title, "New Year Trip");
  assert.equal(localizeFilm(film, "pt-BR").originalTitle, "喜劇　初詣列車");
  film.translations["pt-BR"].title = "Viagem de Ano-Novo";
  assert.equal(localizeFilm(film, "pt-BR").title, "Viagem de Ano-Novo");
});
