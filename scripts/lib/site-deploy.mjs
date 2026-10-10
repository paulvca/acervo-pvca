import { spawn } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  existsSync,
  realpathSync,
} from "node:fs";
import { resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";
import {
  status,
  publicSnapshot,
  atomicJson,
  queueFile,
  hash,
} from "./site-sync.mjs";
import { withStoreLock } from "./store.mjs";
import { validateCatalog } from "./catalog.mjs";
const REPOSITORY = "pv-ca/acervo-pvca";
const PUBLIC_URL = "https://pv-ca.github.io/acervo-pvca";
export function command(argv, cwd) {
  return new Promise((done, reject) => {
    const child = spawn(argv[0], argv.slice(1), {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      signal: AbortSignal.timeout(15 * 60 * 1000),
    });
    let stdout = "",
      stderr = "";
    child.stdout.on("data", (value) => {
      stdout += value;
      if (stdout.length > 16 * 1024 * 1024) child.kill();
    });
    child.stderr.on("data", (value) => {
      stderr += value;
      if (stderr.length > 16 * 1024 * 1024) child.kill();
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? done(stdout.trim())
        : reject(Error(`${argv[0]} failed (${code}): ${stderr.slice(-1200)}`))
    );
  });
}
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
function persist(root, batch, mutate) {
  return withStoreLock(root, () => {
    const queue = status(root, batch);
    mutate(queue);
    atomicJson(queueFile(root, batch), queue);
    return queue;
  });
}
export async function publish(
  root,
  batch,
  { run = command, fetchPage = fetch, sleep = delay, attempts = 90 } = {}
) {
  let queue = status(root, batch);
  if (!Object.values(queue.events).some((e) => e.status === "APPLIED"))
    return queue;
  if (queue.status === "PUBLISHING")
    throw Error("BATCH_PUBLICATION_IN_PROGRESS");
  queue = persist(root, batch, (q) => {
    if (q.status === "PUBLISHING") throw Error("BATCH_PUBLICATION_IN_PROGRESS");
    q.status = "PUBLISHING";
    q.publisher_pid = process.pid;
  });
  try {
    let deployment = queue.deployment;
    if (!deployment || deployment.status === "VERIFIED") {
      const snapshot = publicSnapshot(root);
      const staging = resolve(
        root,
        ".local-admin/site-sync/deploy",
        randomUUID()
      );
      mkdirSync(resolve(staging, ".."), { recursive: true, mode: 0o700 });
      const remote = await run(["git", "remote", "get-url", "origin"], root);
      if (
        ![
          "https://github.com/pv-ca/acervo-pvca.git",
          "git@github.com:pv-ca/acervo-pvca.git",
        ].includes(remote)
      )
        throw Error("SITE_REMOTE_MISMATCH");
      await run(["git", "clone", "--no-hardlinks", root, staging], root);
      await run(["git", "remote", "set-url", "origin", remote], staging);
      for (const key of ["user.name", "user.email"])
        await run(
          [
            "git",
            "config",
            key,
            await run(["git", "config", "--get", key], root),
          ],
          staging
        );
      await run(["git", "fetch", "origin", "main"], staging);
      const base = await run(["git", "rev-parse", "origin/main"], staging);
      await run(["git", "checkout", "-B", "main", base], staging);
      const old = JSON.parse(
        readFileSync(resolve(staging, "data/public/catalog.json"))
      );
      const allowed = new Set(
        Object.values(queue.events)
          .filter((e) => e.status === "APPLIED")
          .map((e) => e.record.tmdb_id)
      );
      const byId = new Map(snapshot.records.map((film) => [film.id, film]));
      for (const film of old) {
        const next = byId.get(film.id);
        if (
          !next ||
          (JSON.stringify(next) !== JSON.stringify(film) &&
            !allowed.has(next.tmdb_id))
        )
          throw Error("UNRELATED_CATALOG_CHANGES");
      }
      for (const film of snapshot.records)
        if (!old.some((f) => f.id === film.id) && !allowed.has(film.tmdb_id))
          throw Error("UNRELATED_CATALOG_CHANGES");
      atomicJson(
        resolve(staging, "data/public/catalog.json"),
        snapshot.records
      );
      for (const film of snapshot.records) {
        if (
          !/^\/posters\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|avif)$/.test(
            film.poster
          )
        )
          throw Error("INVALID_POSTER");
        const source = realpathSync(
          resolve(root, "public", film.poster.slice(1))
        );
        if (!source.startsWith(realpathSync(resolve(root, "public")) + sep))
          throw Error("PRIVATE_ASSET_BOUNDARY");
        const destination = resolve(staging, "public", film.poster.slice(1));
        if (
          !existsSync(destination) ||
          hash(readFileSync(destination)) !== hash(readFileSync(source))
        ) {
          if (!allowed.has(film.tmdb_id))
            throw Error("UNRELATED_POSTER_CHANGES");
          mkdirSync(resolve(destination, ".."), { recursive: true });
          cpSync(source, destination);
        }
      }
      const schema = JSON.parse(
        readFileSync(resolve(staging, "data/schema/public-catalog.schema.json"))
      );
      const errors = validateCatalog(
        snapshot.records,
        schema,
        resolve(staging, "public")
      );
      if (errors.length) throw Error(errors.join("\n"));
      await run(["npm", "ci"], staging);
      await run(["npm", "run", "catalog:check"], staging);
      await run(
        [
          "npx",
          "--no-install",
          "astro",
          "build",
          "--site",
          "https://pv-ca.github.io",
          "--base",
          "/acervo-pvca",
        ],
        staging
      );
      await run(
        ["python3", "scripts/site_check.py", "--base", "/acervo-pvca"],
        staging
      );
      if (publicSnapshot(root).fingerprint !== snapshot.fingerprint)
        throw Error("CATALOG_CHANGED_DURING_BUILD");
      const pages = [];
      for (const film of snapshot.records.filter((f) => allowed.has(f.tmdb_id)))
        for (const prefix of ["", "en/"]) {
          const route = `${prefix}filmes/${film.slug}/`;
          pages.push({
            route,
            sha256: hash(
              readFileSync(resolve(staging, "dist", route, "index.html"))
            ),
          });
        }
      await run(
        ["git", "add", "--", "data/public/catalog.json", "public/posters"],
        staging
      );
      const changed = await run(
        ["git", "diff", "--cached", "--name-only"],
        staging
      );
      if (
        changed &&
        changed
          .split("\n")
          .some(
            (path) =>
              path !== "data/public/catalog.json" &&
              !/^public\/posters\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|avif)$/.test(
                path
              )
          )
      )
        throw Error("PUBLICATION_PATH_BOUNDARY");
      if (changed)
        await run(
          [
            "git",
            "-c",
            "core.hooksPath=/dev/null",
            "commit",
            "-m",
            `Update catalog after verified uploads (${batch})`,
          ],
          staging
        );
      const commit = await run(["git", "rev-parse", "HEAD"], staging);
      deployment = { staging, base, commit, pages, status: "PREPARED" };
      persist(root, batch, (q) => {
        q.deployment = deployment;
      });
    }
    // Resume reuses the same commit. A push rejection never resets or force-pushes main.
    if (
      (await run(["git", "rev-parse", "HEAD"], deployment.staging)) !==
      deployment.commit
    )
      throw Error("DEPLOYMENT_CHECKOUT_CHANGED");
    await run(["git", "push", "origin", "HEAD:main"], deployment.staging);
    persist(root, batch, (q) => {
      q.deployment.status = "PUSHED";
    });
    let workflow;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const runs = JSON.parse(
        await run(
          [
            "gh",
            "run",
            "list",
            "--repo",
            REPOSITORY,
            "--workflow",
            "pages.yml",
            "--commit",
            deployment.commit,
            "--json",
            "databaseId,status,conclusion",
            "--limit",
            "5",
          ],
          root
        )
      );
      workflow =
        runs.find(
          (item) => item.status === "completed" && item.conclusion === "success"
        ) ?? runs[0];
      if (workflow?.status === "completed") {
        if (workflow.conclusion !== "success")
          throw Error("PAGES_WORKFLOW_FAILED");
        break;
      }
      await sleep(10000);
    }
    if (workflow?.conclusion !== "success")
      throw Error("PAGES_WORKFLOW_PENDING");
    persist(root, batch, (q) => {
      q.deployment.workflow_id = workflow.databaseId;
    });
    for (const page of deployment.pages) {
      let matched = false;
      for (let attempt = 0; attempt < 6 && !matched; attempt++) {
        try {
          const response = await fetchPage(
            `${PUBLIC_URL}/${page.route}?pvca=${deployment.commit}`,
            { signal: AbortSignal.timeout(15000) }
          );
          matched =
            response.ok &&
            hash(Buffer.from(await response.arrayBuffer())) === page.sha256;
        } catch {
          /* deployment can still be propagating */
        }
        if (!matched) await sleep(10000);
      }
      if (!matched) throw Error("PUBLIC_PAGE_NOT_VERIFIED: " + page.route);
    }
    return persist(root, batch, (q) => {
      q.status = "PUBLISHED";
      delete q.publisher_pid;
      q.deployment.status = "VERIFIED";
      q.deployment.verified_at = new Date().toISOString();
      for (const event of Object.values(q.events))
        if (event.status === "APPLIED") event.status = "PUBLISHED";
      delete q.error;
    });
  } catch (error) {
    persist(root, batch, (q) => {
      q.status = "PENDING_PUBLICATION";
      delete q.publisher_pid;
      q.error = error.message;
    });
    throw error;
  }
}
