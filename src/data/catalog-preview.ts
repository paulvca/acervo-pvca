export interface CatalogCopyInfo {
  id: string;
  label?: string;
  resolution?: string;
  sizeGiB?: number;
  audio?: string[];
  subtitles?: string[];
  edition?: string;
  format?: string;
}

export interface CatalogExternalLink {
  provider: "Internet Archive" | "Google Drive" | "Outro";
  copyId?: string;
  url?: string;
}

export interface CatalogPreviewFilm {
  slug: string;
  title: string;
  originalTitle?: string;
  romanizedTitle?: string;
  director: string;
  year: number;
  country?: string;
  originalLanguages?: string[];
  runtimeMinutes?: number;
  genres?: string[];
  synopsis?: string;
  poster?: string;
  catalogCopyId?: string;
  searchable: string;
  collectionNote?: string;
  copies?: CatalogCopyInfo[];
  externalLinks?: CatalogExternalLink[];
  selections?: string[];
  addedAt?: string;
  tmdbId?: number;
  translations?: Record<
    string,
    {
      title?: string | null;
      synopsis?: string | null;
      collection_note?: string | null;
    }
  >;
  localizedMetadata?: Record<
    string,
    { countries?: string[]; genres?: string[]; original_languages?: string[] }
  >;
}

import preview from "../../data/public/catalog.preview.json";
export const catalogPreview = preview as CatalogPreviewFilm[];
