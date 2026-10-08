import type {
  CatalogPreviewFilm,
  CatalogCopyInfo,
  CatalogExternalLink,
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

function copyDetailKey(copy: CatalogCopyInfo) {
  return JSON.stringify([
    copy.resolution ?? null,
    copy.sizeGiB == null ? null : Number(copy.sizeGiB.toFixed(1)),
    copy.format ?? null,
    [...(copy.audio ?? [])].sort(),
    [...(copy.subtitles ?? [])].sort(),
    copy.edition ?? null,
    copy.label ?? null,
  ]);
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
    const key = copyDetailKey(copy);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Name each distinct presentation; source labels and editions take precedence. */
export function copyDetailHeading(
  copy: CatalogCopyInfo,
  index: number,
  total: number,
  t: (text: string) => string
) {
  return (
    copy.label ||
    copy.edition ||
    (index === 0
      ? t("Cópia do catálogo")
      : t("Outra cópia") + (total > 2 ? ` ${index + 1}` : ""))
  );
}

/** Attach every source link to its displayed copy, retaining deduplicated sources. */
export function copyAccessGroups(film: CatalogPreviewFilm) {
  const links = (film.externalLinks ?? []).filter((link) => Boolean(link.url));
  const byId = new Map(
    (film.copies ?? []).map((copy) => [copy.id, copyDetailKey(copy)])
  );
  const assigned = new Set<CatalogExternalLink>();
  const groups = distinctCopyDetails(film).map((copy) => {
    const key = copyDetailKey(copy);
    const associated = links.filter(
      (link) => link.copyId && byId.get(link.copyId) === key
    );
    for (const link of associated) assigned.add(link);
    return { copy, links: associated };
  });
  return {
    groups,
    remainingLinks: links.filter((link) => !assigned.has(link)),
  };
}

export function copyAccessHeading(
  groups: ReturnType<typeof copyAccessGroups>["groups"],
  index: number,
  t: (text: string) => string
) {
  const { copy, links } = groups[index];
  const providers = [...new Set(links.map((link) => link.provider))];
  let heading: string;
  if (providers.length === 1 && providers[0] === "Internet Archive")
    heading = t("Cópia do Archive");
  else if (providers.length === 1 && providers[0] === "Google Drive")
    heading = t("Cópia do Drive");
  else if (
    providers.length === 2 &&
    providers.includes("Internet Archive") &&
    providers.includes("Google Drive")
  )
    heading = t("Cópias do Archive e do Drive");
  else return copyDetailHeading(copy, index, groups.length, t);
  const detail = copy.label || copy.edition;
  if (detail) return `${heading} — ${detail}`;
  const matching = groups.filter((group) => {
    const sources = [...new Set(group.links.map((link) => link.provider))];
    return (
      sources.length === providers.length &&
      sources.every((provider) => providers.includes(provider))
    );
  });
  return matching.length > 1
    ? `${heading} ${matching.findIndex((group) => group.copy.id === copy.id) + 1}`
    : heading;
}
