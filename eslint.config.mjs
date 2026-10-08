import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import ts from "typescript-eslint";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "prototype/**",
      "references/**",
      "data/**",
      "test-results/**",
      "playwright-report/**",
      "reports/**",
    ],
  },
  { ...js.configs.recommended, files: ["**/*.{js,mjs,ts,astro}"] },
  {
    files: ["**/*.{js,mjs,ts,astro}"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": [
        "error",
        { args: "none", caughtErrors: "none", ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: { parser: ts.parser },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { args: "none", caughtErrors: "none", ignoreRestSiblings: true },
      ],
    },
    plugins: { "@typescript-eslint": ts.plugin },
  },
  ...astro.configs["flat/recommended"],
];
