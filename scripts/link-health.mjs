// Scheduled maintenance only; HTTP reachability does not certify a playable/shared copy.
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { checkLink } from "./lib/link-health.mjs";
const records = JSON.parse(await readFile("data/public/catalog.json", "utf8"));
const urls = [
  ...new Set(
    records
      .flatMap((record) => record.external_links ?? [])
      .map((link) => link.url)
      .filter(Boolean)
  ),
];
const results = [];
let index = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (index < urls.length) {
      const url = urls[index++];
      results.push(await checkLink(url));
    }
  })
);
results.sort((a, b) => a.url.localeCompare(b.url));
await mkdir("reports/link-health", { recursive: true });
await writeFile(
  "reports/link-health/results.json",
  JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) +
    "\n"
);
const counts = Object.fromEntries(
  [
    "http-reachable",
    "broken-http",
    "timeout",
    "rate-limit",
    "host-excluded",
    "inconclusive",
  ].map((kind) => [
    kind,
    results.filter((result) => result.result === kind).length,
  ])
);
const actionable = results.filter(
  (result) => result.result !== "http-reachable"
);
await writeFile(
  "reports/link-health/REPORT.md",
  `# Public link health\n\nHTTP reachability only. Google Drive 404/auth responses are inconclusive, not proof of a removed copy. GET, 10-second timeout, up to two retries, four workers.\n\n${JSON.stringify(counts)}\n\n| Link | Classification | HTTP | Attempts |\n| --- | --- | --- | --- |\n${actionable.map((result) => `| ${result.url} | ${result.result} | ${result.status ?? "unknown"} | ${result.attempts} |`).join("\n")}\n`
);
console.log(counts);
