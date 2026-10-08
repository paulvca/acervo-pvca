import { catalog, isPreview } from "./catalog";
import { catalogCopy, hasPtBr } from "../lib/catalog";
import { editorial } from "./editorial";
import {
  validateEditorial,
  manualSelectionFilms,
} from "../../scripts/lib/editorial.mjs";
const errors = validateEditorial(editorial, isPreview ? undefined : catalog);
if (errors.length) throw new Error(errors.join("\n"));
export const selections = editorial.selections.map((selection) => ({
  ...selection,
  films:
    selection.rule === "manual"
      ? manualSelectionFilms(selection, catalog)
      : catalog.filter((film) => {
          if (selection.rule === "pt-br") return hasPtBr(film);
          if (selection.rule === "4k")
            return catalogCopy(film)?.resolution === "2160p";
          return false;
        }),
}));
