import {
  translate,
  languagePath,
  routePath,
} from "../../scripts/i18n/public.mjs";
import type { CatalogPreviewFilm } from "../data/catalog-preview";
export function getI18n(url: URL) {
  const base = import.meta.env.BASE_URL;
  const lang = routePath(url.pathname, base).startsWith("/en/")
    ? "en"
    : "pt-BR";
  return {
    lang,
    t: (text: string) => translate(lang, text),
    path: (pathname: string) => languagePath(lang, pathname, base),
    languageHref: (locale: string) => languagePath(locale, url.pathname, base),
  };
}
export function assetPath(pathname: string) {
  return (
    import.meta.env.BASE_URL.replace(/\/$/, "") +
    "/" +
    pathname.replace(/^\//, "")
  );
}
export function languageName(value: string, lang: string) {
  if (/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(value)) {
    try {
      return (
        new Intl.DisplayNames([lang], { type: "language" }).of(value) || value
      );
    } catch {}
  }
  return translate(lang, value);
}
// TMDB returns the original title when a language has no translation; one in
// a non-Latin script gives way to the main title and stays as the original.
const readableTitle = (title?: string | null) =>
  title && /\p{Script=Latin}|\p{N}/u.test(title) ? title : undefined;
export function localizeFilm(
  film: CatalogPreviewFilm,
  lang: string
): CatalogPreviewFilm {
  const values = film.translations?.[lang as "en" | "pt-BR"];
  const metadata = film.localizedMetadata?.[lang as "en" | "pt-BR"];
  return {
    ...film,
    title: readableTitle(values?.title) || film.title,
    synopsis:
      values?.synopsis ||
      (film.synopsis ? translate(lang, film.synopsis) : undefined),
    collectionNote:
      values?.collection_note ??
      (film.collectionNote ? translate(lang, film.collectionNote) : undefined),
    country:
      metadata?.countries?.join(", ") ||
      (film.country ? translate(lang, film.country) : undefined),
    genres: metadata?.genres ?? film.genres,
    originalLanguages: (
      metadata?.original_languages ?? film.originalLanguages
    )?.map((value) => languageName(value, lang)),
    copies: film.copies?.map((copy) => ({
      ...copy,
      audio: copy.audio?.map((value) => languageName(value, lang)),
      subtitles: copy.subtitles?.map((value) => languageName(value, lang)),
    })),
    searchable: [film.searchable, values?.title].filter(Boolean).join(" "),
  };
}
