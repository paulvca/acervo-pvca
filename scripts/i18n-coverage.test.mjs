import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import ts from "typescript";
import { en } from "./i18n/public.mjs";

// Proper brand identity; this is deliberately shared across both locales.
const allowlist = new Map([
  ["Acervo PVCA", "Project name, not translatable UI"],
]);
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(`${directory}/${entry.name}`)
      : [`${directory}/${entry.name}`]
  );
}
export function staticTranslations(source) {
  const tree = ts.createSourceFile(
    "ui.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const strings = new Set();
  function literalBranches(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      strings.add(node.text);
    else if (ts.isConditionalExpression(node)) {
      literalBranches(node.whenTrue);
      literalBranches(node.whenFalse);
    }
  }
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "t" &&
      node.arguments[0]
    )
      literalBranches(node.arguments[0]);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return strings;
}
export function astroParts(raw) {
  return [
    raw.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "",
    ...[
      ...raw.matchAll(
        /<script(?:[\s/][^>]*)?>([\s\S]*?)<\/script(?:[\s/][^>]*)?>/gi
      ),
    ].map((match) => match[1]),
    "<>" +
      raw
        .replace(/^---\s*\n[\s\S]*?\n---/, "")
        .replace(
          /<(script|style)(?:[\s/][^>]*)?>[\s\S]*?<\/\1(?:[\s/][^>]*)?>/gi,
          " "
        ) +
      "</>",
  ];
}
test("all static public t() interface strings have English coverage", () => {
  const missing = [];
  for (const file of files("src").filter((file) =>
    /\.(astro|ts)$/.test(file)
  )) {
    const raw = readFileSync(file, "utf8");
    const parts = file.endsWith(".astro") ? astroParts(raw) : [raw];
    const found = new Set(
      parts.flatMap((part) => [...staticTranslations(part)])
    );
    for (const text of found)
      if (!Object.hasOwn(en, text) && !allowlist.has(text))
        missing.push({ file, text });
  }
  assert.deepEqual(missing, []);
});
test("coverage detects absent keys and conditional labels, leaving dynamic cinema data alone", () => {
  assert.deepEqual(
    [
      ...staticTranslations(
        't("Missing UI"); t(flag ? "filme" : "filmes"); t(film.title); t(selection.localized[lang].title);'
      ),
    ],
    ["Missing UI", "filme", "filmes"]
  );
  assert.equal(Object.hasOwn(en, "Missing UI"), false);
});

test("Astro UI extraction accepts uppercase tags and whitespace before end-tag brackets", () => {
  const parts = astroParts(`---
const title = t("filme");
---
<SCRIPT>const label = t("filmes");</SCRIPT >
<STYLE>p { color: red; }</STYLE >
<p>{t("Missing UI")}</p>`);
  const browserAcceptedEndTag = astroParts(
    '<SCRIPT>t("filme");</SCRIPT\t\n bar>'
  );
  assert.equal(browserAcceptedEndTag[1], 't("filme");');
  assert.equal(
    astroParts('<script-custom>t("filme");</script-custom>').length,
    2
  );
  assert.deepEqual(
    parts.flatMap((part) => [...staticTranslations(part)]),
    ["filme", "filmes", "Missing UI"]
  );
});
