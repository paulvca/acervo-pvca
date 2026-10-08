import { spawn } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  renameSync,
} from "node:fs";
import { resolve } from "node:path";
function bridge(root, args) {
  return new Promise((done, reject) => {
    const child = spawn(
      "python3",
      [resolve(root, "scripts/tmdb_bridge.py"), ...args],
      { cwd: root, stdio: ["ignore", "pipe", "ignore"] }
    );
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
      if (output.length > 8 * 1024 * 1024) child.kill();
    });
    child.on("error", () =>
      reject(Error("TMDB_NETWORK_OR_CONFIGURATION_FAILED"))
    );
    child.on("close", (code) => {
      try {
        const data = JSON.parse(output);
        if (code !== 0 || data.error)
          reject(Error(data.error ?? "TMDB_API_FAILED"));
        else done(data);
      } catch {
        reject(Error("TMDB_API_FAILED"));
      }
    });
  });
}
export const tmdbStatus = (root) => bridge(root, ["probe"]);
export async function enrichTmdb(root, id, { refresh = false } = {}) {
  if (!Number.isInteger(id) || id <= 0) throw Error("TMDB_ID_INVALID");
  const dir = resolve(root, ".local-admin/tmdb-cache"),
    file = resolve(dir, `${id}.json`);
  if (!refresh && existsSync(file)) {
    try {
      const cached = JSON.parse(readFileSync(file, "utf8"));
      if (
        !cached.poster ||
        existsSync(resolve(root, "public", cached.poster.replace(/^\//, "")))
      )
        return cached;
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      // An interrupted cache write must not prevent a fresh lookup.
    }
  }
  const data = await bridge(root, [String(id), root]);
  for (const lang of ["pt-BR", "en"]) {
    const regions = new Intl.DisplayNames([lang], { type: "region" });
    data.localized_metadata[lang].countries = (
      data.entity_refs.countries ?? []
    ).map(
      (ref) =>
        ({
          SU: lang === "en" ? "Soviet Union" : "União Soviética",
          YU: lang === "en" ? "Yugoslavia" : "Iugoslávia",
          AN: lang === "en" ? "Netherlands Antilles" : "Antilhas Neerlandesas",
        })[ref.id] ?? regions.of(ref.id)
    );
  }
  data.countries = data.localized_metadata["pt-BR"].countries;
  mkdirSync(dir, { recursive: true });
  writeFileSync(file + ".tmp", JSON.stringify(data, null, 2) + "\n");
  renameSync(file + ".tmp", file);
  return data;
}
