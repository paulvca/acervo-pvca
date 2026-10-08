// Enforce formatting on every supported file, with exact hashes for untouched legacy debt.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import * as prettier from "prettier";

const baseline = JSON.parse(
  await readFile(new URL("./format-baseline.json", import.meta.url), "utf8")
);
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" }
)
  .split("\0")
  .filter(Boolean);
let legacy = 0,
  checked = 0,
  failed = 0;
for (const file of new Set(files)) {
  const config = await prettier.resolveConfig(file);
  const info = await prettier.getFileInfo(file, { plugins: config?.plugins });
  if (!info.inferredParser || info.ignored) continue;
  const text = await readFile(file, "utf8");
  if (await prettier.check(text, { ...config, filepath: file })) {
    checked++;
  } else if (
    baseline[file] === createHash("sha256").update(text).digest("hex")
  ) {
    legacy++;
  } else {
    console.error(`Formatting required: ${file}`);
    failed++;
  }
}
console.log(
  `Prettier: ${checked} formatted; ${legacy} unchanged legacy files; ${failed} failures.`
);
process.exitCode = failed ? 1 : 0;
