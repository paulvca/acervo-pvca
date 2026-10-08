import { realpathSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";

// Validate the repository's supported JSON Schema keywords without dependencies.
export function checkSchema(value, rule, path, errors) {
  const types = Array.isArray(rule.type) ? rule.type : [rule.type];
  const matches = types.some((type) => {
    if (type === "null") return value === null;
    if (type === "array") return Array.isArray(value);
    if (type === "object")
      return (
        value !== null && typeof value === "object" && !Array.isArray(value)
      );
    if (type === "integer") return Number.isInteger(value);
    if (type === "number")
      return typeof value === "number" && Number.isFinite(value);
    return typeof value === type;
  });
  if (rule.type && !matches) {
    errors.push(`${path}: tipo inválido; esperado ${types.join(" ou ")}.`);
    return;
  }
  if (rule.enum && !rule.enum.includes(value))
    errors.push(`${path}: opção não permitida.`);
  if (value === null) return;
  if (typeof value === "string") {
    if (rule.minLength && value.trim().length < rule.minLength)
      errors.push(`${path}: preencher este campo.`);
    if (rule.pattern && !new RegExp(rule.pattern).test(value))
      errors.push(`${path}: formato inválido.`);
    if (rule.format === "uri") {
      try {
        new URL(value);
      } catch {
        errors.push(`${path}: URL inválida.`);
      }
    }
  }
  if (typeof value === "number") {
    if (rule.minimum != null && value < rule.minimum)
      errors.push(`${path}: valor abaixo do mínimo.`);
    if (rule.maximum != null && value > rule.maximum)
      errors.push(`${path}: valor acima do máximo.`);
    if (rule.exclusiveMinimum != null && value <= rule.exclusiveMinimum)
      errors.push(`${path}: precisa ser maior que ${rule.exclusiveMinimum}.`);
  }
  if (Array.isArray(value)) {
    if (rule.minItems && value.length < rule.minItems)
      errors.push(`${path}: lista incompleta.`);
    value.forEach((entry, index) =>
      checkSchema(entry, rule.items, `${path}[${index}]`, errors)
    );
  } else if (typeof value === "object") {
    for (const key of rule.required ?? [])
      if (!(key in value))
        errors.push(`${path}.${key}: campo obrigatório ausente.`);
    for (const [key, entry] of Object.entries(value)) {
      if (rule.properties?.[key])
        checkSchema(entry, rule.properties[key], `${path}.${key}`, errors);
      else if (rule.additionalProperties === false)
        errors.push(
          `${path}.${key}: campo fora da projeção pública; remova antes de importar.`
        );
    }
  }
}

export function posterExists(publicDir, poster) {
  if (!/^\/posters\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|avif)$/.test(poster))
    return false;
  try {
    const root = realpathSync(publicDir);
    const file = realpathSync(resolve(root, poster.slice(1)));
    return file.startsWith(root + sep) && statSync(file).isFile();
  } catch {
    return false;
  }
}

export function validateLink(link) {
  try {
    const url = new URL(link.url);
    const secret =
      /^(token|access_token|api_key|password|secret|authorization|cookie)$/i;
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      [...url.searchParams.keys()].some((key) => secret.test(key)) ||
      /(?:access_token|password|api_key)=/i.test(url.hash)
    )
      return "use HTTPS sem credenciais ou parâmetros secretos.";
    if (
      link.provider === "internet_archive" &&
      !(url.hostname === "archive.org" || url.hostname.endsWith(".archive.org"))
    )
      return "domínio não corresponde ao Internet Archive.";
    if (link.provider === "google_drive" && url.hostname !== "drive.google.com")
      return "domínio não corresponde ao Google Drive.";
    return null;
  } catch {
    return "URL inválida.";
  }
}

export function validateCatalog(value, schema, publicDir) {
  const errors = [];
  checkSchema(value, schema, "catálogo", errors);
  if (errors.length) return errors;
  const slugs = new Set(),
    filmIds = new Set(),
    tmdbIds = new Set();
  value.forEach((film, index) => {
    const path = `catálogo[${index}]`;
    if (slugs.has(film.slug)) errors.push(`${path}.slug: filme duplicado.`);
    if (filmIds.has(film.id))
      errors.push(`${path}.id: identificador duplicado.`);
    slugs.add(film.slug);
    filmIds.add(film.id);
    if (film.tmdb_id) {
      if (tmdbIds.has(film.tmdb_id))
        errors.push(`${path}.tmdb_id: identificador duplicado.`);
      tmdbIds.add(film.tmdb_id);
    }
    if (
      film.added_at &&
      (Number.isNaN(Date.parse(film.added_at)) ||
        new Date(film.added_at).toISOString().slice(0, 10) !== film.added_at)
    )
      errors.push(`${path}.added_at: data inválida.`);
    if (!posterExists(publicDir, film.poster))
      errors.push(
        `${path}.poster: use um arquivo existente em public/posters/ (jpg, png, webp ou avif).`
      );
    const copyIds = new Set();
    film.copies.forEach((copy, copyIndex) => {
      if (copyIds.has(copy.id))
        errors.push(`${path}.copies[${copyIndex}].id: cópia duplicada.`);
      copyIds.add(copy.id);
    });
    if (!copyIds.has(film.catalog_copy_id))
      errors.push(
        `${path}.catalog_copy_id: escolha explicitamente uma cópia existente.`
      );
    film.external_links.forEach((link, linkIndex) => {
      const linkPath = `${path}.external_links[${linkIndex}]`;
      if (link.copy_id != null && !copyIds.has(link.copy_id))
        errors.push(`${linkPath}.copy_id: cópia inexistente.`);
      const linkError = validateLink(link);
      if (linkError) errors.push(`${linkPath}.url: ${linkError}`);
    });
  });
  return errors;
}

// Project only allowlisted fields; source rows never pass through to the UI.
export function toRuntimeFilm(film) {
  return {
    slug: film.slug,
    title: film.title,
    addedAt: film.added_at ?? undefined,
    tmdbId: film.tmdb_id ?? undefined,
    translations: film.translations,
    localizedMetadata: film.localized_metadata,
    originalTitle: film.original_title ?? undefined,
    romanizedTitle: film.romanized_title ?? undefined,
    director: film.directors.join(", "),
    year: film.year,
    country: film.countries.join(", ") || undefined,
    originalLanguages: film.original_languages,
    runtimeMinutes: film.runtime_minutes ?? undefined,
    genres: film.genres,
    synopsis: film.synopsis ?? undefined,
    poster: film.poster,
    catalogCopyId: film.catalog_copy_id,
    copies: film.copies.map((copy) => ({
      id: copy.id,
      label: copy.label ?? undefined,
      resolution: copy.resolution,
      sizeGiB: copy.size_gib,
      format: copy.format ?? undefined,
      audio: copy.audio_languages,
      subtitles: copy.subtitle_languages,
      edition: copy.edition ?? undefined,
    })),
    externalLinks: film.external_links.map((link) => ({
      provider: {
        internet_archive: "Internet Archive",
        google_drive: "Google Drive",
        other: "Outro",
      }[link.provider],
      url: link.url,
      copyId: link.copy_id ?? undefined,
    })),
    selections: film.selections,
    collectionNote: film.collection_note ?? undefined,
    searchable: [
      film.title,
      film.original_title,
      film.romanized_title,
      ...film.directors,
      film.year,
      ...film.countries,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export function mergeCatalog(existing, incoming, replace = false) {
  const result = [...existing];
  for (const film of incoming) {
    const index = result.findIndex(
      (item) => item.slug === film.slug || item.id === film.id
    );
    if (index === -1) result.push(film);
    else {
      if (result[index].id !== film.id || result[index].slug !== film.slug)
        throw new Error(
          "Identidade em conflito: id e slug precisam corresponder ao mesmo filme."
        );
      if (!replace)
        throw new Error(
          "Filme já cadastrado. Para atualizar suas cópias e links, revise o registro completo e use --replace."
        );
      result[index] = film;
    }
  }
  return result;
}
