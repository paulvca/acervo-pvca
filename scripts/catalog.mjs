import { readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateCatalog, mergeCatalog } from "./lib/catalog.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [command, inputPath, ...flags] = process.argv.slice(2);
try {
  if (
    !["check", "import"].includes(command) ||
    flags.some((flag) => flag !== "--replace") ||
    (flags.includes("--replace") && command !== "import")
  )
    throw new Error(
      "Uso: npm run catalog:check -- [arquivo.json] ou npm run catalog:import -- arquivo.json [--replace]"
    );
  if (command === "import" && !inputPath)
    throw new Error(
      "Informe o arquivo JSON com os registros públicos revisados."
    );
  const target = resolve(root, "data/public/catalog.json");
  const schema = JSON.parse(
    readFileSync(
      resolve(root, "data/schema/public-catalog.schema.json"),
      "utf8"
    )
  );
  const incoming = JSON.parse(
    readFileSync(inputPath ? resolve(inputPath) : target, "utf8")
  );
  const errors = validateCatalog(incoming, schema, resolve(root, "public"));
  if (errors.length) throw new Error(errors.join("\n"));
  if (command === "check") {
    console.log(
      incoming.length
        ? `${incoming.length} registro(s) válido(s). Nenhuma alteração feita.`
        : "Catálogo real vazio. A prévia de desenvolvimento continua ativa."
    );
  } else {
    if (!incoming.length)
      throw new Error("Entrada vazia: nenhum filme foi alterado.");
    const existing = JSON.parse(readFileSync(target, "utf8"));
    const merged = mergeCatalog(
      existing,
      incoming,
      flags.includes("--replace")
    );
    const mergedErrors = validateCatalog(
      merged,
      schema,
      resolve(root, "public")
    );
    if (mergedErrors.length) throw new Error(mergedErrors.join("\n"));
    const temporary = `${target}.${process.pid}.tmp`;
    try {
      writeFileSync(temporary, JSON.stringify(merged, null, 2) + "\n", {
        flag: "wx",
      });
      renameSync(temporary, target);
    } finally {
      try {
        unlinkSync(temporary);
      } catch {}
    }
    console.log(
      `${incoming.length} registro(s) importado(s) localmente. Total: ${merged.length}. Rode npm run build e revise. Nenhum commit, upload ou publicação realizado.`
    );
  }
} catch (error) {
  // Do not print raw JSON parse errors: they can include private source content.
  console.error(
    error instanceof SyntaxError
      ? "JSON inválido. Corrija a estrutura do arquivo antes de importar."
      : error.message
  );
  process.exitCode = 1;
}
