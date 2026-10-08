import type { CatalogPreviewFilm } from "./catalog-preview";
import { catalog, isPreview } from "./catalog";
import { editorial } from "./editorial";
import { recentEntries } from "../../scripts/lib/editorial.mjs";
export const featuredFilm = catalog.find(
  (film) => film.slug === editorial.featuredSlug
);
export const featuredNote =
  editorial.featuredNote ?? featuredFilm?.collectionNote;
export const recentFilms: CatalogPreviewFilm[] = isPreview
  ? editorial.previewRecentSlugs
      .flatMap((slug) => catalog.filter((film) => film.slug === slug))
      .slice(0, editorial.recentLimit)
  : recentEntries(catalog, editorial.recentLimit);
