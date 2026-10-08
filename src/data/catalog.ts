import { resolve } from "node:path";
import publicCatalog from "../../data/public/catalog.json";
import schema from "../../data/schema/public-catalog.schema.json";
import { validateCatalog, toRuntimeFilm } from "../../scripts/lib/catalog.mjs";
import { catalogPreview, type CatalogPreviewFilm } from "./catalog-preview";

const errors = validateCatalog(publicCatalog, schema, resolve("public"));
if (errors.length)
  throw new Error(`Invalid public catalog:\n${errors.join("\n")}`);
export const isPreview = publicCatalog.length === 0;
export const catalog: CatalogPreviewFilm[] = isPreview
  ? catalogPreview
  : publicCatalog.map(toRuntimeFilm);
