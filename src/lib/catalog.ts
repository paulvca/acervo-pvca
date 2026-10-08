import type { CatalogPreviewFilm } from "../data/catalog-preview";

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
