import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173/acervo-pvca/",
    locale: "pt-BR",
    timezoneId: "America/Fortaleza",
    trace: "retain-on-failure",
    launchOptions: process.env.PVCA_BROWSER_PATH
      ? { executablePath: process.env.PVCA_BROWSER_PATH }
      : {},
  },
  webServer: {
    command: "npm run e2e:server",
    url: "http://127.0.0.1:4173/acervo-pvca/",
    reuseExistingServer: false,
  },
});
