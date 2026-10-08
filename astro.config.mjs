import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/(?:en\/)?404(?:\.html|\/)?$/.test(new URL(page).pathname),
    }),
  ],
});
