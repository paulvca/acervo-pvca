import type {
  CatalogPreviewFilm,
  CatalogCopyInfo,
} from "../data/catalog-preview";

export const catalogCopy = (film: CatalogPreviewFilm) =>
  film.copies?.find((copy) => copy.id === film.catalogCopyId);

export const formatGiB = (value: number, lang = "pt-BR") =>
  `${new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)} GiB`;

export const hasPtBr = (film: CatalogPreviewFilm) =>
  Boolean(
    catalogCopy(film)?.subtitles?.some((language) => {
      const normalized = language
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLocaleLowerCase("pt-BR");
      return (
        normalized === "pt-br" || normalized.includes("portugues (brasil)")
      );
    })
  );

/** Count works once by release year, independent of their number of copies. */
export function filmsByDecade(films: CatalogPreviewFilm[]) {
  const counts = new Map<number, number>();
  for (const film of films) {
    if (!Number.isInteger(film.year)) continue;
    const decade = Math.floor(film.year / 10) * 10;
    counts.set(decade, (counts.get(decade) ?? 0) + 1);
  }
  if (!counts.size) return [];
  const first = Math.min(...counts.keys());
  const last = Math.max(...counts.keys());
  return Array.from({ length: (last - first) / 10 + 1 }, (_, index) => {
    const decade = first + index * 10;
    return { decade, count: counts.get(decade) ?? 0 };
  });
}

/** Collapse identical technical presentations, without deleting source copies or links. */
export function distinctCopyDetails(
  film: CatalogPreviewFilm
): CatalogCopyInfo[] {
  const selected = catalogCopy(film);
  const copies = selected
    ? [
        selected,
        ...(film.copies ?? []).filter((copy) => copy.id !== selected.id),
      ]
    : (film.copies ?? []);
  const seen = new Set<string>();
  return copies.filter((copy) => {
    const key = JSON.stringify([
      copy.resolution ?? null,
      copy.sizeGiB == null ? null : Number(copy.sizeGiB.toFixed(1)),
      copy.format ?? null,
      [...(copy.audio ?? [])].sort(),
      [...(copy.subtitles ?? [])].sort(),
      copy.edition ?? null,
      copy.label ?? null,
    ]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
