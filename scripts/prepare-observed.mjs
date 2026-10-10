import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { mergeEnrichment } from "./lib/canonical.mjs";
import { convertObserved } from "./lib/observed.mjs";
import { enrichTmdb } from "./lib/tmdb.mjs";
import { validateCatalog } from "./lib/catalog.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const [input, auditFile, identitiesFile, ...flags] = process.argv.slice(2);
if (
  !input ||
  !auditFile ||
  !identitiesFile ||
  flags.some((f) => !["--share-drive", "--apply"].includes(f))
)
  throw Error(
    "Uso: node scripts/prepare-observed.mjs catálogo.json auditoria.json identidades.json [--share-drive] [--apply]"
  );
const raw = readFileSync(resolve(input));
if (raw.length > 32 * 1024 * 1024) throw Error("Arquivo maior que 32 MiB.");
function parsePrivateJson(bytes) {
  try {
    return JSON.parse(bytes);
  } catch {
    throw Error("JSON inválido; nenhum conteúdo privado será exibido.");
  }
}
const source = parsePrivateJson(raw);
const audit = parsePrivateJson(readFileSync(resolve(auditFile), "utf8"));
const identities = parsePrivateJson(
  readFileSync(resolve(identitiesFile), "utf8")
);
if (
  !Array.isArray(identities) ||
  new Set(identities.map((i) => i.pvca_id)).size !== identities.length
)
  throw Error("Manifesto de identidades inválido.");
for (const item of source.items) {
  const identity = identities.find((i) => i.pvca_id === item.pvca_id);
  if (!Number.isInteger(identity?.tmdb_id) || identity.tmdb_id <= 0)
    throw Error(`Identidade não confirmada: ${item.pvca_id}`);
  item.identity.tmdb = { id: identity.tmdb_id };
}
const converted = convertObserved(source, audit, {
  shareDrive: flags.includes("--share-drive"),
});
if (converted.failures.length)
  throw Error("A conversão contém registros rejeitados; nada foi aplicado.");
const folder = resolve(root, ".local-admin/observed-import");
mkdirSync(folder, { recursive: true });
const records = new Array(converted.records.length),
  errors = [];
let completed = 0,
  cursor = 0,
  fatal;
console.log(
  `Preparando ${records.length} filmes. Drive será incluído apenas com --share-drive.`
);
async function worker() {
  while (cursor < records.length && !fatal) {
    const index = cursor++,
      record = converted.records[index];
    try {
      records[index] = mergeEnrichment(
        record,
        await enrichTmdb(root, record.tmdb_id)
      );
    } catch (error) {
      records[index] = record;
      errors.push({
        id: record.id,
        tmdb_id: record.tmdb_id,
        error: error.message,
      });
      if (/CREDENTIAL|AUTH_FAILED/.test(error.message)) fatal = error;
    }
    completed++;
    if (completed % 10 === 0 || completed === records.length)
      console.log(
        `Preparados ${completed}/${records.length}; falhas de enriquecimento: ${errors.length}.`
      );
  }
}
await Promise.all([worker(), worker()]);
if (fatal) throw fatal;
const schema = JSON.parse(
  readFileSync(resolve(root, "data/schema/public-catalog.schema.json"), "utf8")
);
const pending = records.flatMap((record) => {
  const reasons = validateCatalog(
    [
      Object.fromEntries(
        Object.entries(record).filter(([key]) => key !== "entity_refs")
      ),
    ],
    schema,
    resolve(root, "public")
  );
  return reasons.length
    ? [{ id: record.id, title: record.title, reasons }]
    : [];
});
const report = {
  sourceSha256: createHash("sha256").update(raw).digest("hex"),
  sourceVersion: source.schema_version,
  sharedLinks: flags.includes("--share-drive")
    ? "observed_copy"
    : "internet_archive",
  records: records.length,
  copies: records.reduce((n, r) => n + r.copies.length, 0),
  ready: records.length - pending.length,
  pending,
  conversionRejected: converted.failures,
  enrichmentErrors: errors,
  missingPortugueseSynopsis: records
    .filter((r) => !r.translations?.["pt-BR"]?.synopsis)
    .map((r) => ({ id: r.id, title: r.title })),
};
function save(path, value) {
  const tmp = path + ".tmp";
  writeFileSync(tmp, JSON.stringify(value, null, 2) + "\n");
  renameSync(tmp, path);
}
save(resolve(folder, "prepared.json"), records);
save(resolve(folder, "report.json"), report);
console.log(
  JSON.stringify({
    records: report.records,
    copies: report.copies,
    ready: report.ready,
    pending: pending.length,
    enrichmentErrors: errors.length,
    missingPortugueseSynopsis: report.missingPortugueseSynopsis.length,
  })
);
if (flags.includes("--apply")) {
  const { planImport } = await import("./lib/database.mjs");
  const { updateDatabase } = await import("./lib/store.mjs");
  let plan;
  updateDatabase(root, (before) => {
    plan = planImport(before, records, schema, resolve(root, "public"));
    if (plan.summary.rejected)
      throw Error(
        "A preparação contém registros rejeitados; nada foi aplicado."
      );
    return plan.database;
  });
  save(resolve(folder, "applied.json"), {
    summary: plan.summary,
    items: plan.items,
  });
  console.log(
    "Importação aplicada localmente. Nenhum push ou publicação realizado por esta ferramenta."
  );
}
