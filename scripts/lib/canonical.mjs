// Deliberately public projection of the private PVCA 6.1 inventory.
const unique = (values) => [...new Set(values.filter(Boolean))];
const text = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;
const slug = (title, year) =>
  title
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") +
  "-" +
  year;
const knownLanguages = {
  eng: "en",
  jpn: "ja",
  rus: "ru",
  ita: "it",
  fre: "fr",
  fra: "fr",
  chi: "zh",
  zho: "zh",
  ger: "de",
  deu: "de",
  spa: "es",
  por: "pt",
  kor: "ko",
  dut: "nl",
  nld: "nl",
  per: "fa",
  fas: "fa",
  nor: "no",
  pol: "pl",
  hun: "hu",
  fin: "fi",
  swe: "sv",
  dan: "da",
  vie: "vi",
  mal: "ml",
  tgl: "tl",
  tha: "th",
  ukr: "uk",
  heb: "he",
  gre: "el",
  ell: "el",
  cze: "cs",
  ces: "cs",
  rum: "ro",
  ron: "ro",
  ara: "ar",
  hin: "hi",
  tur: "tr",
  srp: "sr",
  hrv: "hr",
  scc: "sr",
  scr: "hr",
  slo: "sk",
  slk: "sk",
  slv: "sl",
  bul: "bg",
  cat: "ca",
  est: "et",
  lav: "lv",
  lit: "lt",
  ind: "id",
  ice: "is",
  isl: "is",
  alb: "sq",
  sqi: "sq",
  ben: "bn",
  tam: "ta",
  tel: "te",
  urd: "ur",
  und: "und",
  mul: "mul",
  zxx: "zxx",
};
function language(tag, subtitle, options) {
  const value = text(tag)?.toLowerCase();
  if (!value) return null;
  if (value === "pt-br") return "pt-BR";
  if (value === "pt-pt") return "pt-PT";
  if (
    subtitle &&
    ["por", "pt", "pt-br"].includes(value) &&
    options.portugueseIsBrazilian
  )
    return "pt-BR";
  return (
    knownLanguages[value] ??
    (/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(value) ? value : null)
  );
}
export const isCanonical = (value) =>
  value?.schema_version === "pvca-clean-catalog-6.1";
export function convertCanonical(input, options = {}) {
  if (
    !isCanonical(input) ||
    !Array.isArray(input.items) ||
    input.items.length > 10000
  )
    throw Error("Formato canônico PVCA 6.1 inválido.");
  if (input.item_count !== input.items.length)
    throw Error("Contagem do arquivo canônico inconsistente.");
  const records = [],
    indices = [],
    failures = [],
    seenIds = new Set(),
    seenTmdb = new Set(),
    seenSlugs = new Set();
  for (const [index, item] of input.items.entries()) {
    try {
      const id = text(item.pvca_id),
        title = text(item.title),
        year = item.year,
        tmdb = item.identity?.tmdb?.id;
      if (
        !id ||
        !title ||
        !Number.isInteger(year) ||
        !Number.isInteger(tmdb) ||
        tmdb <= 0
      )
        throw Error("Identidade incompleta.");
      if (seenIds.has(id) || seenTmdb.has(tmdb))
        throw Error("Identidade duplicada no arquivo canônico.");
      let address = slug(title, year);
      if (seenSlugs.has(address)) address += "-" + id.toLowerCase();
      const copies = [];
      for (const provider of ["local", "drive", "archive"]) {
        const source = item.copies?.[provider];
        if (source?.status !== "AVAILABLE") continue;
        const bytes = source.size?.bytes;
        const resolution =
          text(source.resolution?.declared_class) ||
          text(source.resolution?.label);
        if (!Number.isSafeInteger(bytes) || bytes <= 0 || !resolution)
          throw Error("Cópia existente sem tamanho ou resolução comprovados.");
        copies.push({
          id: id.toLowerCase() + "-" + provider,
          resolution,
          size_gib: bytes / 1073741824,
          format: text(source.container?.value),
          audio_languages: unique(
            (source.technical?.audio_streams ?? []).map((stream) =>
              language(stream.tags?.language, false, options)
            )
          ),
          subtitle_languages: unique(
            (source.embedded_subtitles?.tracks ?? []).map((track) =>
              language(track.language?.tag, true, options)
            )
          ),
        });
      }
      const preferred = text(
        item.availability?.preferred_media_source
      )?.toLowerCase();
      const selected = id.toLowerCase() + "-" + preferred;
      if (
        !copies.some((copy) => copy.id === selected) ||
        item.media?.source?.toLowerCase() !== preferred
      )
        throw Error("Cópia representativa ausente ou inconsistente.");
      const metadata = item.metadata ?? {},
        langs = metadata.languages_and_countries ?? {},
        texts = metadata.synopsis?.texts ?? {};
      const external_links = [];
      if (
        item.copies.archive?.status === "AVAILABLE" &&
        text(item.copies.archive.url)
      )
        external_links.push({
          provider: "internet_archive",
          url: item.copies.archive.url,
          copy_id: id.toLowerCase() + "-archive",
        });
      records.push({
        id,
        slug: address,
        title,
        year,
        tmdb_id: tmdb,
        imdb_id: /^tt\d+$/.test(item.identity?.imdb ?? "")
          ? item.identity.imdb
          : null,
        original_title: text(metadata.original_title),
        release_date: text(metadata.release_date),
        runtime_minutes:
          Number.isInteger(metadata.runtime_minutes) &&
          metadata.runtime_minutes > 0
            ? metadata.runtime_minutes
            : null,
        directors: unique((metadata.credits?.directors ?? []).map(text)),
        countries: unique((langs.production_countries ?? []).map(text)),
        genres: unique((metadata.production?.genres ?? []).map(text)),
        original_languages: unique([text(langs.original_language)]),
        synopsis: text(texts["pt-BR"]),
        translations: {
          "pt-BR": { synopsis: text(texts["pt-BR"]) },
          en: { synopsis: text(texts["en-US"]) },
        },
        poster: null,
        copies,
        catalog_copy_id: selected,
        external_links,
        selections: [],
      });
      indices.push(index);
      seenIds.add(id);
      seenTmdb.add(tmdb);
      seenSlugs.add(address);
    } catch (error) {
      failures.push({
        index,
        title: text(item?.title) || `#${index + 1}`,
        status: "rejected",
        reasons: [error.message],
        protected: [],
      });
    }
  }
  return { records, indices, failures };
}

// Source copy facts and supplied synopses take precedence over enrichment.
export function mergeEnrichment(record, enriched) {
  const present = Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) =>
        value !== null &&
        value !== "" &&
        (!Array.isArray(value) || value.length)
    )
  );
  const localized = {};
  for (const lang of ["pt-BR", "en"])
    localized[lang] = {
      ...enriched.translations?.[lang],
      ...Object.fromEntries(
        Object.entries(record.translations?.[lang] ?? {}).filter(
          ([, v]) => v !== null && v !== ""
        )
      ),
    };
  const refs = {},
    metadata = structuredClone(enriched.localized_metadata ?? {});
  const aliases = {
    "United States of America": "United States",
    "Hong Kong": "Hong Kong SAR China",
    "Soviet Union": "Soviet Union",
    Yugoslavia: "Yugoslavia",
    "Netherlands Antilles": "Netherlands Antilles",
  };
  for (const field of [
    "directors",
    "countries",
    "genres",
    "original_languages",
  ]) {
    if (!record[field]?.length) {
      if (enriched.entity_refs?.[field])
        refs[field] = enriched.entity_refs[field];
      continue;
    }
    const source = record[field]?.length
      ? record[field]
      : (enriched[field] ?? []);
    const names =
      enriched.localized_metadata?.en?.[field] ?? enriched[field] ?? [];
    const positions = source.map((name) =>
      names.indexOf(field === "countries" ? (aliases[name] ?? name) : name)
    );
    const fallback =
      field === "countries"
        ? {
            Italy: { id: "IT", labels: { en: "Italy", "pt-BR": "Itália" } },
            France: { id: "FR", labels: { en: "France", "pt-BR": "França" } },
          }
        : field === "genres"
          ? {
              Drama: {
                id: "tmdb-18",
                labels: { en: "Drama", "pt-BR": "Drama" },
              },
              Comedy: {
                id: "tmdb-35",
                labels: { en: "Comedy", "pt-BR": "Comédia" },
              },
            }
          : {};
    const matched =
      positions.every((index, i) => index >= 0 || fallback[source[i]]) &&
      new Set(source).size === source.length;
    if (matched && enriched.entity_refs?.[field])
      refs[field] = positions.map((index, i) =>
        index >= 0 ? enriched.entity_refs[field][index] : fallback[source[i]]
      );
    for (const lang of Object.keys(metadata))
      if (["countries", "genres"].includes(field)) {
        if (matched && metadata[lang][field])
          metadata[lang][field] = positions.map((index, i) =>
            index >= 0
              ? metadata[lang][field][index]
              : fallback[source[i]].labels[lang]
          );
        else delete metadata[lang][field];
      }
  }
  // Required empty arrays must survive; absence is not a fabricated value.
  return {
    ...enriched,
    ...present,
    selections: record.selections ?? enriched.selections ?? [],
    external_links: record.external_links ?? enriched.external_links ?? [],
    entity_refs: refs,
    translations: localized,
    localized_metadata: metadata,
  };
}
