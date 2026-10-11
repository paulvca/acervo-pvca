export function validateEditorial(value, catalog) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return ["Configuração editorial inválida."];
  const errors = [];
  const keys = [
    "featuredSlug",
    "featuredNote",
    "featuredNotes",
    "recentLimit",
    "previewRecentSlugs",
    "homeSelectionIds",
    "showStats",
    "selections",
  ];
  if (Object.keys(value).some((key) => !keys.includes(key)))
    errors.push("Campo editorial desconhecido.");
  if (!(value.featuredSlug === null || typeof value.featuredSlug === "string"))
    errors.push("Escolha um destaque ou nenhum.");
  if (!(value.featuredNote === null || typeof value.featuredNote === "string"))
    errors.push("Nota do destaque inválida.");
  if (
    !Number.isInteger(value.recentLimit) ||
    value.recentLimit < 1 ||
    value.recentLimit > 12
  )
    errors.push("Recentemente deve ter de 1 a 12 filmes.");
  if (typeof value.showStats !== "boolean")
    errors.push("Exibição dos números inválida.");
  for (const key of ["previewRecentSlugs", "homeSelectionIds"])
    if (
      !Array.isArray(value[key]) ||
      value[key].some((item) => typeof item !== "string")
    )
      errors.push("Lista editorial inválida.");
  if (!Array.isArray(value.selections))
    return [...errors, "Seleções inválidas."];
  const ids = new Set();
  const titles = new Set();
  const slugs = catalog ? new Set(catalog.map((film) => film.slug)) : null;
  for (const s of value.selections) {
    if (
      !s ||
      typeof s !== "object" ||
      Object.keys(s).some(
        (key) =>
          ![
            "id",
            "title",
            "description",
            "localized",
            "rule",
            "filmSlugs",
          ].includes(key)
      )
    ) {
      errors.push("Seleção inválida.");
      continue;
    }
    if (typeof s.id !== "string" || !/^[-a-z0-9]+$/.test(s.id) || ids.has(s.id))
      errors.push("Endereço de seleção inválido ou repetido.");
    ids.add(s.id);
    if (
      typeof s.title !== "string" ||
      !s.title.trim() ||
      typeof s.description !== "string"
    )
      errors.push("Preencha título e descrição da seleção.");
    if (titles.has(s.title)) errors.push("Título de seleção repetido.");
    titles.add(s.title);
    if (
      !["manual", "pt-br", "4k"].includes(s.rule) ||
      !Array.isArray(s.filmSlugs) ||
      s.filmSlugs.some((slug) => typeof slug !== "string")
    )
      errors.push("Regra ou filmes da seleção inválidos.");
    if (Array.isArray(s.filmSlugs)) {
      if (new Set(s.filmSlugs).size !== s.filmSlugs.length)
        errors.push(`Seleção ${s.id}: filme repetido.`);
      if (slugs && s.filmSlugs.some((slug) => !slugs.has(slug)))
        errors.push(`Seleção ${s.id}: filme inexistente.`);
      if (s.rule !== "manual" && s.filmSlugs.length)
        errors.push(
          `Seleção ${s.id}: regra automática não aceita filmes manuais.`
        );
    }
    if (
      typeof s.title === "string" &&
      s.title.toLowerCase().includes("disponíveis no internet archive")
    )
      errors.push("Disponibilidade não é uma seleção editorial.");
  }
  if (
    Array.isArray(value.homeSelectionIds) &&
    value.homeSelectionIds.some((id) => !ids.has(id))
  )
    errors.push("Seleção da home inexistente.");
  if (
    value.featuredNotes &&
    Object.entries(value.featuredNotes).some(
      ([lang, text]) =>
        !["pt-BR", "en"].includes(lang) ||
        (text !== null && typeof text !== "string")
    )
  )
    errors.push("Nota do destaque inválida.");
  for (const s of value.selections)
    if (
      s?.localized &&
      Object.entries(s.localized).some(
        ([lang, texts]) =>
          !["pt-BR", "en"].includes(lang) ||
          !texts ||
          Object.entries(texts).some(
            ([key, text]) =>
              !["title", "description"].includes(key) ||
              typeof text !== "string"
          )
      )
    )
      errors.push("Tradução da seleção inválida.");
  return errors;
}

// Membership is keyed by stable slugs, never by translated selection titles.
export function manualSelectionFilms(selection, catalog) {
  const slugs = new Set(selection.filmSlugs);
  return catalog.filter((film) => slugs.has(film.slug));
}

// Films added on the same day keep the order they entered the catalog, newest first.
export function recentEntries(catalog, limit) {
  return catalog
    .filter((film) => film.addedAt)
    .sort(
      (a, b) =>
        b.addedAt.localeCompare(a.addedAt) ||
        (b.id ?? "").localeCompare(a.id ?? "") ||
        a.title.localeCompare(b.title)
    )
    .slice(0, limit);
}
