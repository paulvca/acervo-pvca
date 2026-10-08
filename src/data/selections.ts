import { catalog, isPreview } from "./catalog";
import { catalogCopy, hasPtBr } from "../lib/catalog";
import { editorial } from "./editorial";
export const selections = editorial.selections.map((selection) => ({
  ...selection,
  films: catalog.filter((film) => {
    if (selection.rule === "pt-br") return hasPtBr(film);
    if (selection.rule === "4k")
      return catalogCopy(film)?.resolution === "2160p";
    return (
      selection.filmSlugs.includes(film.slug) ||
      (!isPreview && film.selections?.includes(selection.title))
    );
  }),
}));
