// Local-only server that reproduces the Pages base path and custom 404 behavior.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";
export function startServer(port = 4173) {
  const root = resolve("dist"),
    base = "/acervo-pvca";
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname
      );
      if (!pathname.startsWith(base + "/")) throw new Error("outside base");
      let file = resolve(root, "." + pathname.slice(base.length));
      if (file !== root && !file.startsWith(root + "/"))
        throw new Error("outside root");
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".jpg": "image/jpeg",
        ".png": "image/png",
      };
      res.setHeader(
        "Content-Type",
        types[extname(file)] ?? "application/octet-stream"
      );
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(await readFile(resolve(root, "404.html")));
    }
  });
  return new Promise((done) =>
    server.listen(port, "127.0.0.1", () => done(server))
  );
}
if (
  process.argv[1] &&
  import.meta.url === new URL(process.argv[1], "file:").href
) {
  const server = await startServer();
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () => server.close(() => process.exit()));
  console.log("Static Pages test server: http://127.0.0.1:4173/acervo-pvca/");
}
