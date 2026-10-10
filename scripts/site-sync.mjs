#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import {
  prepare,
  apply,
  status,
  read,
  recoverBatch,
} from "./lib/site-sync.mjs";
import { publish } from "./lib/site-deploy.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const [action, ...args] = process.argv.slice(2);
const batch = args[0];
try {
  let result;
  if (action === "prepare") {
    if (!args[0] || args.slice(1).some((a) => a !== "--no-enrich"))
      throw Error("prepare RECEIPT [--no-enrich]");
    result = await prepare(root, read(resolve(args[0])), {
      enrich: !args.includes("--no-enrich"),
    });
  } else if (action === "status") result = status(root, batch);
  else if (action === "recover") result = recoverBatch(root, batch);
  else if (action === "apply") result = apply(root, batch);
  else if (action === "publish") result = await publish(root, batch);
  else if (action === "resume") {
    recoverBatch(root, batch);
    apply(root, batch);
    result = await publish(root, batch);
  } else
    throw Error(
      "Use prepare RECEIPT | apply BATCH | publish BATCH | status BATCH | recover BATCH | resume BATCH"
    );
  // Private receipts stay on disk; console output is a compact operational summary.
  console.log(
    JSON.stringify(
      {
        status: result.status,
        batch_id: result.batch_id,
        events: Object.entries(result.events ?? {}).map(([id, e]) => ({
          id,
          status: e.status,
          reasons: e.result?.reasons,
          error: e.error,
        })),
        error: result.error,
        commit: result.deployment?.commit,
        workflow: result.deployment?.workflow_id,
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(
    error instanceof SyntaxError ? "INVALID_JSON_RECEIPT" : error.message
  );
  process.exitCode = 1;
}
