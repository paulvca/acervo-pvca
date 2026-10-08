import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";
import { translate } from "./i18n/public.mjs";

function runComponent(file, context) {
  const source = readFileSync(
    new URL(`../src/${file}`, import.meta.url),
    "utf8"
  )
    .match(/<script(?:[\s/][^>]*)?>([\s\S]*?)<\/script(?:[\s/][^>]*)?>/i)[1]
    .replace(/import[\s\S]*?from\s*["'][^"']+["'];/g, "")
    .replaceAll("import.meta.env.BASE_URL", '"/acervo-pvca"');
  vm.runInNewContext(
    ts.transpileModule(
      (context.probe
        ? `
      const originalNormalize = String.prototype.normalize;
      String.prototype.normalize = function(...args) {
        probe.normalizations++;
        return originalNormalize.apply(this, args);
      };
      const originalSort = Array.prototype.sort;
      Array.prototype.sort = function(...args) {
        probe.sorts++;
        return originalSort.apply(this, args);
      };
    `
        : "") + source,
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      }
    ).outputText,
    { translate, URL, ...context }
  );
}

for (const [pathname, manual, browserLanguage] of [
  ["/acervo-pvca/en/filmes/", "pt-BR", "pt-BR"],
  ["/acervo-pvca/filmes/", "en", "en-US"],
]) {
  test(`explicit locale stays on ${pathname} and manual switch preserves query/hash`, () => {
    const replacements = [];
    const links = ["pt-BR", "en"].map((language) => ({
      dataset: { language },
      href: `https://paulvca.github.io/acervo-pvca/${language === "en" ? "en/" : ""}filmes/`,
      addEventListener(type, callback) {
        this[type] = callback;
      },
    }));
    const saved = [];
    runComponent("layouts/BaseLayout.astro", {
      document: { querySelectorAll: () => links },
      location: {
        pathname,
        search: "?q=Tokyo",
        hash: "#catalog",
        replace: (value) => replacements.push(value),
      },
      navigator: { languages: [browserLanguage] },
      localStorage: {
        getItem: () => manual,
        setItem: (...args) => saved.push(args),
      },
      // Baseline dependencies; these deliberately conflict with the URL.
      preferredLanguage: () => manual,
      countryHint: () => "BR",
      languagePath: (language) =>
        `/acervo-pvca/${language === "en" ? "en/" : ""}filmes/`,
    });
    assert.deepEqual(replacements, []);
    for (const link of links) {
      link.click();
      assert.equal(new URL(link.href).search, "?q=Tokyo");
      assert.equal(new URL(link.href).hash, "#catalog");
      // Repeated activation must not append query/hash twice.
      link.click();
      assert.equal(new URL(link.href).hash, "#catalog");
    }
    assert.equal(saved.length, 4);
  });
}

class Element {
  hidden = false;
  dataset = {};
  listeners = {};
  classList = { toggle() {} };
  addEventListener(type, callback) {
    this.listeners[type] = callback;
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  getAttribute(name) {
    return this[name];
  }
}
class Input extends Element {
  value = "";
}
class Select extends Element {
  value = "title";
}

test("search and filters preserve DOM order; only sort batches node moves", () => {
  const cards = Array.from({ length: 526 }, (_, i) =>
    Object.assign(new Element(), {
      dataset: {
        title: `film ${i}`,
        search: i === 0 ? "Tóquio 1953" : `Film ${i}`,
        year: String(1953 + i),
        ptbr: i === 0 ? "true" : "false",
        resolution: i === 0 ? "2160p" : "1080p",
      },
    })
  );
  const catalog = new Element();
  catalog["data-preview"] = "false";
  catalog.querySelectorAll = () => cards;
  let moves = 0;
  let insertions = 0;
  let order = [...cards];
  catalog.append = (...nodes) => {
    insertions++;
    const batch = nodes.flatMap((node) => node.children ?? [node]);
    moves += batch.length;
    order = order.filter((node) => !batch.includes(node)).concat(batch);
  };
  const search = new Input(),
    sort = new Select(),
    counter = new Element(),
    empty = new Element();
  const filters = ["all", "ptbr", "4k"].map((filter) =>
    Object.assign(new Element(), { dataset: { filter } })
  );
  const probe = { normalizations: 0, sorts: 0 };
  runComponent("components/FilmCatalog.astro", {
    probe,
    document: {
      documentElement: { lang: "pt-BR" },
      querySelector: (selector) =>
        ({
          "#catalog": catalog,
          "#filmSearch": search,
          "#filmSort": sort,
          "#resultCount": counter,
          "#emptyCatalog": empty,
        })[selector],
      querySelectorAll: (selector) =>
        selector === ".catalog-filter" ? filters : [],
      createDocumentFragment: () => ({
        children: [],
        append(...nodes) {
          this.children.push(...nodes);
        },
      }),
    },
    HTMLInputElement: Input,
    HTMLSelectElement: Select,
    URLSearchParams,
    window: { location: { search: "" } },
  });
  assert.equal(moves, 0, "initial hydration must keep server order");
  assert.equal(probe.normalizations, 527);
  search.value = "toquio";
  search.listeners.input();
  assert.equal(cards.filter((card) => !card.hidden).length, 1);
  assert.equal(counter.textContent, "1 filme");
  assert.equal(
    probe.normalizations,
    528,
    "only the query is normalized on input"
  );
  filters[1].listeners.click();
  assert.equal(probe.normalizations, 529);
  assert.equal(probe.sorts, 0, "search and filters must not sort");
  assert.equal(moves, 0, "search/filter must not move any card");
  assert.deepEqual(order, cards);
  sort.value = "year-desc";
  sort.listeners.change();
  assert.equal(moves, 526);
  assert.equal(probe.sorts, 1);
  assert.equal(insertions, 1, "insert sorted cards in one batch");
  assert.equal(order[0], cards[525]);
  assert.equal(cards.filter((card) => !card.hidden).length, 1);
  search.value = "absent";
  search.listeners.input();
  assert.equal(empty.hidden, false);
  assert.equal(moves, 526);
});
